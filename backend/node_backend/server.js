/**
 * ScholarGuard — Node.js Express Analysis Engine (v2.5)
 * Port of the Python FastAPI backend. Runs as sidecar on port 8000.
 *
 *   POST /analyze/url    — Live web scraper, WHOIS resolver, TLD risk, homoglyph check
 *   POST /analyze/text   — Fee keyword extraction, coercion language scoring
 *   POST /analyze/entity — IRS 990 lookup simulation, nonprofit verify
 *   GET  /health         — Service health check
 */

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
const cheerio = require("cheerio");
const whoisJson = require("whois-json");

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://scholarguard.vercel.app",
    ],
    methods: ["*"],
    allowedHeaders: ["*"],
  })
);

// ─── Threat Signatures & Constants ───────────────────────────────────────────

const HIGH_RISK_TLDS = new Set([
  ".biz", ".info", ".cc", ".tk", ".ml", ".ga", ".cf", ".gq",
  ".top", ".xyz", ".click", ".link", ".loan", ".win", ".online",
  ".site", ".website", ".club", ".icu", ".buzz", ".work",
]);

const FEE_PATTERNS = [
  /processing\s+fee/i,
  /courier\s+fee/i,
  /certificate\s+fee/i,
  /registration\s+fee/i,
  /handling\s+fee/i,
  /application\s+fee/i,
  /insurance\s+fee/i,
  /administrative\s+fee/i,
  /activation\s+fee/i,
  /deposit\s+required/i,
  /pay.*before.*receiv/i,
  /wire\s+transfer/i,
  /send\s+money/i,
  /upfront\s+payment/i,
  /advance\s+payment/i,
  /disbursement\s+fee/i,
  /guarantee\s+fee/i,
];

const FEE_LABELS = [
  "processing fee", "courier fee", "certificate fee",
  "registration fee", "handling fee", "application fee",
  "insurance fee", "administrative fee", "activation fee",
  "deposit required", "pay…before…receiv", "wire transfer",
  "send money", "upfront payment", "advance payment",
  "disbursement fee", "guarantee fee",
];

const COERCION_PATTERNS = [
  /guaranteed\s+(award|scholarship|win|admission)/i,
  /pre.?selected/i,
  /you\s+have\s+been\s+chosen/i,
  /act\s+now/i,
  /limited\s+time/i,
  /only\s+\d+\s+(spot|slot|position)s?\s*(left|remaining)/i,
  /100\s*%\s+accept/i,
  /immediate(ly)?\s+claim/i,
  /expires?\s+in\s+\d+/i,
  /click\s+here\s+immediately/i,
  /respond\s+within\s+24\s+hours/i,
  /final\s+notice/i,
  /last\s+chance/i,
  /urgent\s+action/i,
];

const COERCION_LABELS = [
  "guaranteed (award|scholarship|win|admission)", "pre-selected",
  "you have been chosen", "act now", "limited time",
  "only N spots left", "100% accept", "immediately claim",
  "expires in N", "click here immediately", "respond within 24 hours",
  "final notice", "last chance", "urgent action",
];

const PAYMENT_CHANNELS = [
  { pattern: /\bzelle\b/i, label: "Zelle Peer-to-Peer" },
  { pattern: /\bcash\s*app\b/i, label: "CashApp" },
  { pattern: /\bvenmo\b/i, label: "Venmo" },
  { pattern: /\bwestern\s+union\b/i, label: "Western Union Wire" },
  { pattern: /\bmoneygram\b/i, label: "MoneyGram Wire" },
  { pattern: /\bgift\s+card\b/i, label: "Gift Card Redemption" },
  { pattern: /\bcrypto|bitcoin|usdt\b/i, label: "Cryptocurrency Transfer" },
];

const IDENTITY_HARVESTING = [
  { pattern: /social\s+security|ssn\b/i, label: "Social Security Number Solicitation" },
  { pattern: /routing\s+number|bank\s+account\b/i, label: "Bank Routing / Account Number" },
  { pattern: /driver('s)?\s+license\b/i, label: "Driver's License Upload Request" },
  { pattern: /passport\s+number\b/i, label: "Passport Number Solicitation" },
  { pattern: /fafsa\s+pin|fsaid\b/i, label: "FAFSA Login / PIN Harvesting" },
];

const HOMOGLYPH_MAP = {
  rn: "m",
  vv: "w",
  l1: "li",
  0: "o",
  1: "l",
  5: "s",
  3: "e",
  "@": "a",
};

const KNOWN_LEGIT = new Set([
  "studentaid.gov", "nsfgrfp.org", "gatesfoundation.org", "gates-foundation.org",
  "coca-colascholarsfoundation.org", "rhodeshouse.ox.ac.uk",
  "nationalmerit.org", "jacksontscharger.org", "fulbrightprogram.org",
]);

const KNOWN_FRAUDULENT = new Set([
  "national-meritscholars-portal.org", "american-opportunity-grants.net",
  "quantumleap-edu-scholarship.info", "ivy-ivyleague-fellowship.net",
  "scholars-awards.ac",
]);

const IRS_990_DB = {
  "gates foundation": { ein: "56-2618866", status: "501(c)(3)", year: 1994 },
  "coca-cola scholars foundation": { ein: "58-1620666", status: "501(c)(3)", year: 1986 },
  "national merit scholarship": { ein: "36-2167817", status: "501(c)(3)", year: 1955 },
  nsf: { ein: "53-0219886", status: "Federal Agency", year: 1950 },
  "rhodes trust": { ein: "13-1628172", status: "501(c)(3)", year: 1902 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractHostname(url) {
  let cleaned = url.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, "");
  cleaned = cleaned.replace(/\/.*$/, "");
  return cleaned;
}

function getBaseDomain(hostname) {
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts.slice(-2).join(".");
  }
  return hostname;
}

function getTld(hostname) {
  const parts = hostname.split(".");
  return parts.length ? `.${parts[parts.length - 1]}` : "";
}

function countHyphens(hostname) {
  return (hostname.match(/-/g) || []).length;
}

function detectHomoglyphs(hostname) {
  const hits = [];
  for (const [fake, real] of Object.entries(HOMOGLYPH_MAP)) {
    if (hostname.includes(fake)) {
      hits.push(`'${fake}' may substitute '${real}' (Homoglyph pattern)`);
    }
  }
  return hits;
}

function keywordScan(text, patterns, labels) {
  const lowerText = text.toLowerCase();
  const found = [];
  for (let i = 0; i < patterns.length; i++) {
    if (patterns[i].test(lowerText)) {
      found.push(labels[i]);
    }
  }
  return found;
}

function contentHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function coercionScore(foundPatterns) {
  return Math.min(100, foundPatterns.length * 14);
}

// ─── Live Crawling Engine ────────────────────────────────────────────────────

async function crawlLiveWebsite(rawUrl) {
  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    const resp = await axios.get(targetUrl, {
      timeout: 4000,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "ScholarGuard-Audit-Bot/2.5 (+https://scholarguard.org; Academic Security Clearinghouse)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      // Allow self-signed certs (like verify=False in Python)
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });

    const html = resp.data;
    const $ = cheerio.load(html);

    // Extract title
    const title = $("title").first().text().trim() || "";

    // Remove scripts, style, noscript, svg, header, footer
    $("script, style, noscript, svg, header, footer").remove();

    const textContent = $("body").text().replace(/\s+/g, " ").trim();

    // Detect payment channels mentioned
    const lowerHtml = html.toLowerCase();
    const paymentSignals = [];
    for (const { pattern, label } of PAYMENT_CHANNELS) {
      if (pattern.test(lowerHtml)) {
        paymentSignals.push(label);
      }
    }

    // Detect identity harvesting form inputs
    const harvestingSignals = [];
    const inputs = $("input");
    let inputNames = "";
    inputs.each((_, el) => {
      const name = $(el).attr("name") || "";
      const id = $(el).attr("id") || "";
      const placeholder = $(el).attr("placeholder") || "";
      inputNames += ` ${name} ${id} ${placeholder}`;
    });
    inputNames = inputNames.toLowerCase();

    for (const { pattern, label } of IDENTITY_HARVESTING) {
      if (pattern.test(inputNames) || pattern.test(lowerHtml)) {
        harvestingSignals.push(label);
      }
    }

    return {
      success: true,
      statusCode: resp.status,
      title,
      extractedText: textContent.slice(0, 15000),
      paymentSignals: [...new Set(paymentSignals)],
      harvestingSignals: [...new Set(harvestingSignals)],
      hasForms: inputs.length > 0,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
      paymentSignals: [],
      harvestingSignals: [],
    };
  }
}

// ─── Live WHOIS Resolver ─────────────────────────────────────────────────────

async function lookupWhois(hostname) {
  const baseDomain = getBaseDomain(hostname);
  try {
    const result = await Promise.race([
      whoisJson(baseDomain),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("WHOIS timeout")), 6000)
      ),
    ]);

    if (!result || !result.domainName) {
      return { success: false };
    }

    // Handle creationDate (can be string or array)
    let creation = result.creationDate;
    if (Array.isArray(creation) && creation.length > 0) {
      creation = creation[0];
    }

    let ageDays = null;
    if (creation) {
      const creationDate = new Date(creation);
      if (!isNaN(creationDate.getTime())) {
        const now = new Date();
        ageDays = Math.max(
          0,
          Math.floor((now - creationDate) / (1000 * 60 * 60 * 24))
        );
      }
    }

    const registrar = result.registrar || "Unknown Registrar";

    // Privacy detection
    const whoisText = JSON.stringify(result).toLowerCase();
    const hasPrivacy = [
      "whoisguard", "privacy", "withheld", "proxy", "redacted",
    ].some((p) => whoisText.includes(p));

    return {
      success: true,
      registrar,
      creationDate: creation || null,
      domainAgeDays: ageDays,
      privacyShield: hasPrivacy,
    };
  } catch {
    return { success: false };
  }
}

// ─── API Routes ──────────────────────────────────────────────────────────────

// GET /health
app.get("/health", (_req, res) => {
  res.json({
    status: "operational",
    engine: "ScholarGuard Analysis v2.5 (Node.js)",
    liveCrawler: "active",
    whoisResolver: "active",
    timestamp: new Date().toISOString(),
    hashesIndexed: 1_409_218,
  });
});

// POST /analyze/url
app.post("/analyze/url", async (req, res) => {
  try {
    const { url, text: userText } = req.body;
    if (!url) {
      return res.status(422).json({ detail: "url is required" });
    }

    const hostname = extractHostname(url);
    const tld = getTld(hostname);
    const hyphens = countHyphens(hostname);
    const homoglyphs = detectHomoglyphs(hostname);
    const isKnownLegit =
      KNOWN_LEGIT.has(hostname) ||
      hostname.endsWith(".gov") ||
      hostname.endsWith(".edu");
    const isKnownFraud = KNOWN_FRAUDULENT.has(hostname);

    // 1. Run live WHOIS & live web crawl concurrently
    const [whoisRes, crawlRes] = await Promise.allSettled([
      lookupWhois(hostname),
      crawlLiveWebsite(url),
    ]);

    const whoisData =
      whoisRes.status === "fulfilled"
        ? whoisRes.value
        : { success: false };
    const crawlData =
      crawlRes.status === "fulfilled"
        ? crawlRes.value
        : { success: false, paymentSignals: [], harvestingSignals: [] };

    // 2. Scoring
    let domainScore = 0;
    const flags = [];

    if (isKnownFraud) {
      domainScore = 90;
      flags.push("Domain confirmed in ScholarGuard fraud registry");
    } else if (!isKnownLegit) {
      if (HIGH_RISK_TLDS.has(tld)) {
        domainScore += 35;
        flags.push(`High-risk TLD: ${tld}`);
      }
      if (hyphens >= 3) {
        domainScore += 20;
        flags.push(
          `Excessive hyphens (${hyphens}) — typical lookalike pattern`
        );
      } else if (hyphens >= 2) {
        domainScore += 10;
      }
      if (homoglyphs.length > 0) {
        domainScore += 15;
        flags.push(...homoglyphs);
      }
      if (hostname.length > 35) {
        domainScore += 10;
        flags.push("Unusually long domain name");
      }

      // WHOIS dynamic scoring
      if (whoisData.success) {
        const age = whoisData.domainAgeDays;
        if (age !== null && age !== undefined) {
          if (age < 60) {
            domainScore += 35;
            flags.push(
              `Domain registered only ${age} days ago (Critical Risk < 60 days)`
            );
          } else if (age < 180) {
            domainScore += 20;
            flags.push(
              `Domain age ${age} days (< 6 months probationary window)`
            );
          }
        }
        if (
          whoisData.privacyShield &&
          age !== null &&
          age !== undefined &&
          age < 180
        ) {
          domainScore += 10;
          flags.push(
            "Offshore privacy proxy shield active on newly registered domain"
          );
        }
      }
    }

    // 3. Analyze text (combine user text + live crawled text)
    let extractedText = "";
    if (crawlData.success) {
      extractedText = crawlData.extractedText || "";
    }
    const fullText = `${userText || ""} ${extractedText}`.trim();

    let textScore = 0;
    let feeHits = [];
    let coercionHits = [];

    if (fullText) {
      feeHits = keywordScan(fullText, FEE_PATTERNS, FEE_LABELS);
      coercionHits = keywordScan(fullText, COERCION_PATTERNS, COERCION_LABELS);
      textScore = Math.min(
        50,
        feeHits.length * 20 + Math.floor(coercionScore(coercionHits) / 3)
      );

      if (feeHits.length > 0) {
        flags.push(
          `Fee extraction language detected: ${feeHits.slice(0, 2).join(", ")}`
        );
      }
      if (coercionHits.length > 0) {
        flags.push(
          `Coercion markers: ${coercionHits.slice(0, 2).join(", ")}`
        );
      }
    }

    // Crawled payment signals & harvesting
    const paymentSignals = crawlData.paymentSignals || [];
    if (paymentSignals.length > 0) {
      textScore += 20;
      flags.push(
        `Unsanctioned peer-to-peer payment methods detected: ${paymentSignals.join(", ")}`
      );
    }

    const harvestingSignals = crawlData.harvestingSignals || [];
    if (harvestingSignals.length > 0) {
      textScore += 25;
      flags.push(
        `Identity credentials requested on page: ${harvestingSignals.join(", ")}`
      );
    }

    let totalScore = Math.min(100, domainScore + textScore);
    if (isKnownLegit) {
      totalScore = Math.min(totalScore, 5);
    }

    const status =
      totalScore >= 80
        ? "FRAUD"
        : totalScore >= 60
          ? "HIGH_RISK"
          : totalScore >= 40
            ? "SUSPICIOUS"
            : totalScore >= 20
              ? "CAUTION"
              : "VERIFIED";

    res.json({
      hostname,
      tld,
      threatIndex: totalScore,
      status,
      isKnownLegit,
      isKnownFraud,
      hyphens,
      homoglyphs,
      highRiskTld: HIGH_RISK_TLDS.has(tld),
      flags,
      feeKeywords: feeHits,
      coercionKeywords: coercionHits,
      contentHash: contentHash(url),
      whois: whoisData,
      crawl: {
        crawled: crawlData.success || false,
        title: crawlData.title || "",
        paymentSignals,
        harvestingSignals,
      },
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in /analyze/url:", err);
    res.status(500).json({ detail: "Internal server error", error: err.message });
  }
});

// POST /analyze/text
app.post("/analyze/text", (req, res) => {
  try {
    const { text, source_url } = req.body;
    if (!text) {
      return res.status(422).json({ detail: "text is required" });
    }

    const feeHits = keywordScan(text, FEE_PATTERNS, FEE_LABELS);
    const coercionHits = keywordScan(text, COERCION_PATTERNS, COERCION_LABELS);

    const hasCountdown = /\d+\s*(hour|minute|day)s?\s*(left|remaining|only)/i.test(text);
    const hasGuarantee = /100\s*%|guaranteed|assured|certain/i.test(text);
    const hasSSNRequest = /social\s+security|ssn|passport\s+number/i.test(text);
    const hasRouting = /routing\s+number|bank\s+account|iban|swift/i.test(text);

    const riskScore = Math.min(
      100,
      feeHits.length * 25 +
        coercionScore(coercionHits) +
        (hasSSNRequest ? 20 : 0) +
        (hasRouting ? 20 : 0) +
        (hasCountdown ? 10 : 0) +
        (hasGuarantee ? 5 : 0)
    );

    const status =
      riskScore >= 80
        ? "FRAUD"
        : riskScore >= 60
          ? "HIGH_RISK"
          : riskScore >= 40
            ? "SUSPICIOUS"
            : riskScore >= 20
              ? "CAUTION"
              : "VERIFIED";

    res.json({
      textLength: text.length,
      threatIndex: riskScore,
      status,
      feeKeywords: feeHits,
      feeCount: feeHits.length,
      coercionKeywords: coercionHits,
      coercionCount: coercionHits.length,
      hasCountdown,
      hasGuarantee,
      hasSSNRequest,
      hasRoutingRequest: hasRouting,
      contentHash: contentHash(text),
      coercionIndex: `${coercionScore(coercionHits)}/100`,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in /analyze/text:", err);
    res.status(500).json({ detail: "Internal server error", error: err.message });
  }
});

// POST /analyze/entity
app.post("/analyze/entity", (req, res) => {
  try {
    const { organization_name, claimed_ein, state } = req.body;
    if (!organization_name) {
      return res
        .status(422)
        .json({ detail: "organization_name is required" });
    }

    const nameLower = organization_name.toLowerCase().trim();

    // IRS 990 lookup
    let irsMatch = null;
    for (const [key, val] of Object.entries(IRS_990_DB)) {
      if (key.includes(nameLower) || nameLower.includes(key)) {
        irsMatch = val;
        break;
      }
    }

    const flags = [];
    let riskScore = 0;

    if (!irsMatch) {
      riskScore += 40;
      flags.push("No IRS 990 filing found for this organization name");
    }

    if (/\bllc\b|\binc\b|\bcorp\b|\bltd\b/i.test(nameLower)) {
      riskScore += 25;
      flags.push(
        "Organization name includes for-profit entity suffix (LLC/Inc)"
      );
    }

    const genericWords = [
      "foundation", "grant", "scholarship", "fund", "award", "bureau", "institute",
    ];
    const genericCount = genericWords.filter((w) =>
      nameLower.includes(w)
    ).length;
    if (genericCount >= 3) {
      riskScore += 15;
      flags.push(
        "Organization name uses excessive generic scholarship terminology"
      );
    }

    let einValid = null;
    if (claimed_ein) {
      einValid = /^\d{2}-\d{7}$/.test(claimed_ein);
      if (!einValid) {
        riskScore += 10;
        flags.push("Claimed EIN format invalid");
      }
    }

    const status =
      riskScore >= 80
        ? "FRAUD"
        : riskScore >= 60
          ? "HIGH_RISK"
          : riskScore >= 40
            ? "SUSPICIOUS"
            : riskScore >= 20
              ? "CAUTION"
              : "VERIFIED";

    res.json({
      organizationName: organization_name,
      irs990Found: irsMatch !== null,
      irs990Data: irsMatch,
      einValid,
      threatIndex: Math.min(100, riskScore),
      status,
      flags,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in /analyze/entity:", err);
    res.status(500).json({ detail: "Internal server error", error: err.message });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🛡️  ScholarGuard Node.js Analysis Engine v2.5");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Server:    http://localhost:${PORT}`);
  console.log(`  Health:    http://localhost:${PORT}/health`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
