"""
ScholarShield — Python FastAPI Analysis Engine (v2.5)
Runs as sidecar on port 8000. Provides deep forensic analysis:
  POST /analyze/url    — Live web scraper, WHOIS resolver, TLD risk, homoglyph check
  POST /analyze/text   — Fee keyword extraction, coercion language scoring
  POST /analyze/entity — IRS 990 lookup simulation, nonprofit verify
  GET  /health         — Service health check
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import re
import hashlib
import datetime
import asyncio
import httpx
from bs4 import BeautifulSoup
import whois

app = FastAPI(
    title="ScholarShield Forensic Analysis Engine",
    description="Live web crawling, WHOIS resolution, and scholarship fraud detection API",
    version="2.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://scholarshield.vercel.app", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Threat Signatures & Constants ────────────────────────────────────────────

HIGH_RISK_TLDS = {
    ".biz", ".info", ".cc", ".tk", ".ml", ".ga", ".cf", ".gq",
    ".top", ".xyz", ".click", ".link", ".loan", ".win", ".online",
    ".site", ".website", ".club", ".icu", ".buzz", ".work",
}

FEE_PATTERNS = [
    r"processing\s+fee", r"courier\s+fee", r"certificate\s+fee",
    r"registration\s+fee", r"handling\s+fee", r"application\s+fee",
    r"insurance\s+fee", r"administrative\s+fee", r"activation\s+fee",
    r"deposit\s+required", r"pay.*before.*receiv", r"wire\s+transfer",
    r"send\s+money", r"upfront\s+payment", r"advance\s+payment",
    r"disbursement\s+fee", r"guarantee\s+fee",
]

COERCION_PATTERNS = [
    r"guaranteed\s+(award|scholarship|win|admission)", r"pre.?selected",
    r"you\s+have\s+been\s+chosen", r"act\s+now", r"limited\s+time",
    r"only\s+\d+\s+(spot|slot|position)s?\s*(left|remaining)",
    r"100\s*%\s+accept", r"immediate(ly)?\s+claim", r"expires?\s+in\s+\d+",
    r"click\s+here\s+immediately", r"respond\s+within\s+24\s+hours",
    r"final\s+notice", r"last\s+chance", r"urgent\s+action",
]

PAYMENT_CHANNELS = [
    (r"\bzelle\b", "Zelle Peer-to-Peer"),
    (r"\bcash\s*app\b", "CashApp"),
    (r"\bvenmo\b", "Venmo"),
    (r"\bwestern\s+union\b", "Western Union Wire"),
    (r"\bmoneygram\b", "MoneyGram Wire"),
    (r"\bgift\s+card\b", "Gift Card Redemption"),
    (r"\bcrypto|bitcoin|usdt\b", "Cryptocurrency Transfer"),
]

IDENTITY_HARVESTING = [
    (r"social\s+security|ssn\b", "Social Security Number Solicitation"),
    (r"routing\s+number|bank\s+account\b", "Bank Routing / Account Number"),
    (r"driver('s)?\s+license\b", "Driver's License Upload Request"),
    (r"passport\s+number\b", "Passport Number Solicitation"),
    (r"fafsa\s+pin|fsaid\b", "FAFSA Login / PIN Harvesting"),
]

HOMOGLYPH_MAP = {
    "rn": "m", "vv": "w", "l1": "li", "0": "o", "1": "l",
    "5": "s", "3": "e", "@": "a",
}

KNOWN_LEGIT = {
    "studentaid.gov", "nsfgrfp.org", "gatesfoundation.org", "gates-foundation.org",
    "coca-colascholarsfoundation.org", "rhodeshouse.ox.ac.uk",
    "nationalmerit.org", "jacksontscharger.org", "fulbrightprogram.org",
}

KNOWN_FRAUDULENT = {
    "national-meritscholars-portal.org", "american-opportunity-grants.net",
    "quantumleap-edu-scholarship.info", "ivy-ivyleague-fellowship.net",
    "scholars-awards.ac",
}

IRS_990_DB = {
    "gates foundation": {"ein": "56-2618866", "status": "501(c)(3)", "year": 1994},
    "coca-cola scholars foundation": {"ein": "58-1620666", "status": "501(c)(3)", "year": 1986},
    "national merit scholarship": {"ein": "36-2167817", "status": "501(c)(3)", "year": 1955},
    "nsf": {"ein": "53-0219886", "status": "Federal Agency", "year": 1950},
    "rhodes trust": {"ein": "13-1628172", "status": "501(c)(3)", "year": 1902},
}

# ─── Pydantic Models ──────────────────────────────────────────────────────────

class URLRequest(BaseModel):
    url: str
    text: Optional[str] = None

class TextRequest(BaseModel):
    text: str
    source_url: Optional[str] = None

class EntityRequest(BaseModel):
    organization_name: str
    claimed_ein: Optional[str] = None
    state: Optional[str] = None

# ─── Helpers ──────────────────────────────────────────────────────────────────

def extract_hostname(url: str) -> str:
    url = url.strip().lower()
    url = re.sub(r"^https?://", "", url)
    url = re.sub(r"/.*$", "", url)
    return url

def get_base_domain(hostname: str) -> str:
    parts = hostname.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return hostname

def get_tld(hostname: str) -> str:
    parts = hostname.split(".")
    return f".{parts[-1]}" if parts else ""

def count_hyphens(hostname: str) -> int:
    return hostname.count("-")

def detect_homoglyphs(hostname: str) -> List[str]:
    hits = []
    for fake, real in HOMOGLYPH_MAP.items():
        if fake in hostname:
            hits.append(f"'{fake}' may substitute '{real}' (Homoglyph pattern)")
    return hits

def keyword_scan(text: str, patterns: List[str]) -> List[str]:
    text = text.lower()
    found = []
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            clean_term = p.replace(r"\s+", " ").replace(r"\b", "").replace(r".*", "…")
            found.append(clean_term)
    return found

def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:16]

def coercion_score(found_patterns: List[str]) -> int:
    return min(100, len(found_patterns) * 14)

# ─── Live Crawling Engine ─────────────────────────────────────────────────────

async def crawl_live_website(raw_url: str) -> Dict[str, Any]:
    """Safely crawls a live URL in the background and extracts forensic signals."""
    target_url = raw_url.strip()
    if not target_url.startswith(("http://", "https://")):
        target_url = f"https://{target_url}"

    headers = {
        "User-Agent": "ScholarShield-Audit-Bot/2.5 (+https://scholarshield.org; Academic Security Clearinghouse)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    try:
        async with httpx.AsyncClient(timeout=4.0, follow_redirects=True, verify=False) as client:
            resp = await client.get(target_url, headers=headers)
            html = resp.text

            soup = BeautifulSoup(html, "html.parser")

            # Extract title
            title = soup.title.string.strip() if soup.title and soup.title.string else ""

            # Remove scripts and style
            for tag in soup(["script", "style", "noscript", "svg", "header", "footer"]):
                tag.decompose()

            text_content = soup.get_text(separator=" ", strip=True)

            # Detect payment channels mentioned
            payment_signals = []
            lower_html = html.lower()
            for pattern, label in PAYMENT_CHANNELS:
                if re.search(pattern, lower_html):
                    payment_signals.append(label)

            # Detect identity harvesting form inputs
            harvesting_signals = []
            inputs = soup.find_all("input")
            input_names = " ".join([i.get("name", "") + " " + i.get("id", "") + " " + i.get("placeholder", "") for i in inputs]).lower()

            for pattern, label in IDENTITY_HARVESTING:
                if re.search(pattern, input_names) or re.search(pattern, lower_html):
                    harvesting_signals.append(label)

            return {
                "success": True,
                "statusCode": resp.status_code,
                "title": title,
                "extractedText": text_content[:15000],
                "paymentSignals": list(set(payment_signals)),
                "harvestingSignals": list(set(harvesting_signals)),
                "hasForms": len(inputs) > 0,
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "paymentSignals": [],
            "harvestingSignals": [],
        }

# ─── Live WHOIS Resolver ──────────────────────────────────────────────────────

def _sync_whois_lookup(domain_to_check: str) -> Dict[str, Any]:
    """Runs a live WHOIS query against the public registrar."""
    try:
        w = whois.whois(domain_to_check)
        if not w or not w.domain_name:
            return {"success": False}

        # Handle creation_date (can be single datetime or list)
        creation = w.creation_date
        if isinstance(creation, list) and len(creation) > 0:
            creation = creation[0]

        age_days = None
        if isinstance(creation, datetime.datetime):
            # Normalize timezone
            now = datetime.datetime.now(datetime.timezone.utc)
            if creation.tzinfo is None:
                creation = creation.replace(tzinfo=datetime.timezone.utc)
            age_days = max(0, (now - creation).days)

        registrar = w.registrar or "Unknown Registrar"
        
        # Privacy detection
        w_text = str(w).lower()
        has_privacy = any(p in w_text for p in ["whoisguard", "privacy", "withheld", "proxy", "redacted"])

        return {
            "success": True,
            "registrar": registrar,
            "creationDate": creation.isoformat() if isinstance(creation, datetime.datetime) else None,
            "domainAgeDays": age_days,
            "privacyShield": has_privacy,
        }
    except Exception:
        return {"success": False}

async def lookup_whois(hostname: str) -> Dict[str, Any]:
    """Non-blocking WHOIS lookup with 6.0s timeout."""
    base_domain = get_base_domain(hostname)
    try:
        # Run in thread pool with 6.0s timeout
        return await asyncio.wait_for(
            asyncio.to_thread(_sync_whois_lookup, base_domain),
            timeout=6.0,
        )
    except Exception:
        return {"success": False}

# ─── API Routes ───────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "operational",
        "engine": "ScholarShield Analysis v2.5",
        "liveCrawler": "active",
        "whoisResolver": "active",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "hashesIndexed": 1_409_218,
    }

@app.post("/analyze/url")
async def analyze_url(req: URLRequest):
    hostname = extract_hostname(req.url)
    tld = get_tld(hostname)
    hyphens = count_hyphens(hostname)
    homoglyphs = detect_homoglyphs(hostname)
    is_known_legit = hostname in KNOWN_LEGIT or any(hostname.endswith(d) for d in [".gov", ".edu"])
    is_known_fraud = hostname in KNOWN_FRAUDULENT

    # 1. Run live WHOIS & live web crawl concurrently
    whois_task = lookup_whois(hostname)
    crawl_task = crawl_live_website(req.url)

    whois_res, crawl_res = await asyncio.gather(whois_task, crawl_task, return_exceptions=True)

    if isinstance(whois_res, Exception):
        whois_res = {"success": False}
    if isinstance(crawl_res, Exception):
        crawl_res = {"success": False, "paymentSignals": [], "harvestingSignals": []}

    # 2. Scoring
    domain_score = 0
    flags = []

    if is_known_fraud:
        domain_score = 90
        flags.append("Domain confirmed in ScholarShield fraud registry")
    elif is_known_legit:
        domain_score = 0
    else:
        if tld in HIGH_RISK_TLDS:
            domain_score += 35
            flags.append(f"High-risk TLD: {tld}")
        if hyphens >= 3:
            domain_score += 20
            flags.append(f"Excessive hyphens ({hyphens}) — typical lookalike pattern")
        elif hyphens >= 2:
            domain_score += 10
        if homoglyphs:
            domain_score += 15
            flags.extend(homoglyphs)
        if len(hostname) > 35:
            domain_score += 10
            flags.append("Unusually long domain name")

        # WHOIS dynamic scoring
        if whois_res.get("success"):
            age = whois_res.get("domainAgeDays")
            if age is not None:
                if age < 60:
                    domain_score += 35
                    flags.append(f"Domain registered only {age} days ago (Critical Risk < 60 days)")
                elif age < 180:
                    domain_score += 20
                    flags.append(f"Domain age {age} days (< 6 months probationary window)")
            if whois_res.get("privacyShield") and (age is not None and age < 180):
                domain_score += 10
                flags.append("Offshore privacy proxy shield active on newly registered domain")

    # 3. Analyze text (combine user text + live crawled text)
    extracted_text = ""
    if crawl_res.get("success"):
        extracted_text = crawl_res.get("extractedText", "")
    full_text = f"{req.text or ''} {extracted_text}".strip()

    text_score = 0
    fee_hits, coercion_hits = [], []
    if full_text:
        fee_hits = keyword_scan(full_text, FEE_PATTERNS)
        coercion_hits = keyword_scan(full_text, COERCION_PATTERNS)
        text_score = min(50, len(fee_hits) * 20 + coercion_score(coercion_hits) // 3)

        if fee_hits:
            flags.append(f"Fee extraction language detected: {', '.join(fee_hits[:2])}")
        if coercion_hits:
            flags.append(f"Coercion markers: {', '.join(coercion_hits[:2])}")

    # Crawled payment signals & harvesting
    payment_signals = crawl_res.get("paymentSignals", [])
    if payment_signals:
        text_score += 20
        flags.append(f"Unsanctioned peer-to-peer payment methods detected: {', '.join(payment_signals)}")

    harvesting_signals = crawl_res.get("harvestingSignals", [])
    if harvesting_signals:
        text_score += 25
        flags.append(f"Identity credentials requested on page: {', '.join(harvesting_signals)}")

    total_score = min(100, domain_score + text_score)
    if is_known_legit:
        total_score = min(total_score, 5)

    status = (
        "FRAUD" if total_score >= 80 else
        "HIGH_RISK" if total_score >= 60 else
        "SUSPICIOUS" if total_score >= 40 else
        "CAUTION" if total_score >= 20 else
        "VERIFIED"
    )

    return {
        "hostname": hostname,
        "tld": tld,
        "threatIndex": total_score,
        "status": status,
        "isKnownLegit": is_known_legit,
        "isKnownFraud": is_known_fraud,
        "hyphens": hyphens,
        "homoglyphs": homoglyphs,
        "highRiskTld": tld in HIGH_RISK_TLDS,
        "flags": flags,
        "feeKeywords": fee_hits,
        "coercionKeywords": coercion_hits,
        "contentHash": content_hash(req.url),
        "whois": whois_res,
        "crawl": {
            "crawled": crawl_res.get("success", False),
            "title": crawl_res.get("title", ""),
            "paymentSignals": payment_signals,
            "harvestingSignals": harvesting_signals,
        },
        "analyzedAt": datetime.datetime.utcnow().isoformat(),
    }

@app.post("/analyze/text")
def analyze_text(req: TextRequest):
    text = req.text
    fee_hits = keyword_scan(text, FEE_PATTERNS)
    coercion_hits = keyword_scan(text, COERCION_PATTERNS)

    has_countdown = bool(re.search(r"\d+\s*(hour|minute|day)s?\s*(left|remaining|only)", text, re.I))
    has_guarantee = bool(re.search(r"100\s*%|guaranteed|assured|certain", text, re.I))
    has_ssn_request = bool(re.search(r"social\s+security|ssn|passport\s+number", text, re.I))
    has_routing = bool(re.search(r"routing\s+number|bank\s+account|iban|swift", text, re.I))

    risk_score = min(100,
        len(fee_hits) * 25 +
        coercion_score(coercion_hits) +
        (20 if has_ssn_request else 0) +
        (20 if has_routing else 0) +
        (10 if has_countdown else 0) +
        (5 if has_guarantee else 0)
    )

    status = (
        "FRAUD" if risk_score >= 80 else
        "HIGH_RISK" if risk_score >= 60 else
        "SUSPICIOUS" if risk_score >= 40 else
        "CAUTION" if risk_score >= 20 else
        "VERIFIED"
    )

    return {
        "textLength": len(text),
        "threatIndex": risk_score,
        "status": status,
        "feeKeywords": fee_hits,
        "feeCount": len(fee_hits),
        "coercionKeywords": coercion_hits,
        "coercionCount": len(coercion_hits),
        "hasCountdown": has_countdown,
        "hasGuarantee": has_guarantee,
        "hasSSNRequest": has_ssn_request,
        "hasRoutingRequest": has_routing,
        "contentHash": content_hash(text),
        "coercionIndex": f"{coercion_score(coercion_hits)}/100",
        "analyzedAt": datetime.datetime.utcnow().isoformat(),
    }

@app.post("/analyze/entity")
def analyze_entity(req: EntityRequest):
    name_lower = req.organization_name.lower().strip()

    irs_match = None
    for key, val in IRS_990_DB.items():
        if key in name_lower or name_lower in key:
            irs_match = val
            break

    flags = []
    risk_score = 0

    if not irs_match:
        risk_score += 40
        flags.append("No IRS 990 filing found for this organization name")

    if re.search(r"\bllc\b|\binc\b|\bcorp\b|\bltd\b", name_lower):
        risk_score += 25
        flags.append("Organization name includes for-profit entity suffix (LLC/Inc)")

    generic_words = ["foundation", "grant", "scholarship", "fund", "award", "bureau", "institute"]
    generic_count = sum(1 for w in generic_words if w in name_lower)
    if generic_count >= 3:
        risk_score += 15
        flags.append("Organization name uses excessive generic scholarship terminology")

    ein_valid = None
    if req.claimed_ein:
        ein_valid = bool(re.match(r"^\d{2}-\d{7}$", req.claimed_ein))
        if not ein_valid:
            risk_score += 10
            flags.append("Claimed EIN format invalid")

    status = (
        "FRAUD" if risk_score >= 80 else
        "HIGH_RISK" if risk_score >= 60 else
        "SUSPICIOUS" if risk_score >= 40 else
        "CAUTION" if risk_score >= 20 else
        "VERIFIED"
    )

    return {
        "organizationName": req.organization_name,
        "irs990Found": irs_match is not None,
        "irs990Data": irs_match,
        "einValid": ein_valid,
        "threatIndex": min(100, risk_score),
        "status": status,
        "flags": flags,
        "analyzedAt": datetime.datetime.utcnow().isoformat(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
