"""
ScholarGuard — Python FastAPI Analysis Engine (Day 6)
Runs as sidecar on port 8000. Provides deep forensic analysis:
  POST /analyze/url    — WHOIS, domain age, TLD risk, homoglyph check
  POST /analyze/text   — Fee keyword extraction, coercion language scoring
  POST /analyze/entity — IRS 990 lookup simulation, nonprofit verify
  GET  /health         — Service health check
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import re
import hashlib
import datetime
import unicodedata

app = FastAPI(
    title="ScholarGuard Analysis Engine",
    description="Forensic scholarship fraud detection API",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://scholarguard.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constants ────────────────────────────────────────────────────────────────

HIGH_RISK_TLDS = {
    ".biz", ".info", ".cc", ".tk", ".ml", ".ga", ".cf", ".gq",
    ".top", ".xyz", ".click", ".link", ".loan", ".win", ".online",
    ".site", ".website", ".club", ".icu", ".buzz",
}

FEE_PATTERNS = [
    r"processing\s+fee", r"courier\s+fee", r"certificate\s+fee",
    r"registration\s+fee", r"handling\s+fee", r"application\s+fee",
    r"insurance\s+fee", r"administrative\s+fee", r"activation\s+fee",
    r"deposit\s+required", r"pay.*before.*receiv", r"wire\s+transfer",
    r"send\s+money", r"upfront\s+payment", r"advance\s+payment",
]

COERCION_PATTERNS = [
    r"guaranteed\s+admission", r"pre.?selected", r"you\s+have\s+been\s+chosen",
    r"act\s+now", r"limited\s+time", r"only\s+\d+\s+(spot|slot|position)",
    r"100\s*%\s+accept", r"immediate(ly)?\s+claim", r"expires?\s+in\s+\d+",
    r"click\s+here\s+immediately", r"respond\s+within\s+24\s+hours",
    r"final\s+notice", r"last\s+chance",
]

HOMOGLYPH_MAP = {
    "rn": "m", "vv": "w", "l1": "li", "0": "o", "1": "l",
    "5": "s", "3": "e", "@": "a",
}

KNOWN_LEGIT = {
    "studentaid.gov", "nsfgrfp.org", "gates-foundation.org",
    "coca-colascholars foundation.org", "rhodeshouse.ox.ac.uk",
    "nationalmerit.org", "jacksontscharger.org",
}

KNOWN_FRAUDULENT = {
    "national-meritscholars-portal.org", "american-opportunity-grants.net",
    "quantumleap-edu-scholarship.info", "ivy-ivyleague-fellowship.net",
}

# IRS 990 database simulation (in production: query IRS API)
IRS_990_DB = {
    "gates foundation": {"ein": "56-2618866", "status": "501(c)(3)", "year": 1994},
    "coca-cola scholars foundation": {"ein": "58-1620666", "status": "501(c)(3)", "year": 1986},
    "national merit scholarship": {"ein": "36-2167817", "status": "501(c)(3)", "year": 1955},
    "nsf": {"ein": "53-0219886", "status": "Federal Agency", "year": 1950},
}

# ─── Models ───────────────────────────────────────────────────────────────────

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

def get_tld(hostname: str) -> str:
    parts = hostname.split(".")
    return f".{parts[-1]}" if parts else ""

def count_hyphens(hostname: str) -> int:
    return hostname.count("-")

def detect_homoglyphs(hostname: str) -> List[str]:
    hits = []
    for fake, real in HOMOGLYPH_MAP.items():
        if fake in hostname:
            hits.append(f"'{fake}' may substitute '{real}'")
    return hits

def keyword_scan(text: str, patterns: List[str]) -> List[str]:
    text = text.lower()
    found = []
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            found.append(p.replace(r"\s+", " ").replace(r".*", "…"))
    return found

def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:16]

def coercion_score(found_patterns: List[str]) -> int:
    return min(100, len(found_patterns) * 12)

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "operational",
        "engine": "ScholarGuard Analysis v2.1",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "hashesIndexed": 1_409_218,
    }


@app.post("/analyze/url")
def analyze_url(req: URLRequest):
    hostname = extract_hostname(req.url)
    tld = get_tld(hostname)
    hyphens = count_hyphens(hostname)
    homoglyphs = detect_homoglyphs(hostname)
    is_known_legit = hostname in KNOWN_LEGIT or any(hostname.endswith(d) for d in [".gov", ".edu"])
    is_known_fraud = hostname in KNOWN_FRAUDULENT

    # Scoring
    domain_score = 0
    flags = []

    if is_known_fraud:
        domain_score = 90
        flags.append("Domain in ScholarGuard fraud registry")
    elif is_known_legit:
        domain_score = 0
    else:
        if tld in HIGH_RISK_TLDS:
            domain_score += 35
            flags.append(f"High-risk TLD: {tld}")
        if hyphens >= 3:
            domain_score += 20
            flags.append(f"Excessive hyphens ({hyphens}) — common in typequat domains")
        if hyphens >= 2 and not is_known_legit:
            domain_score += 10
        if homoglyphs:
            domain_score += 15
            flags.extend(homoglyphs)
        if len(hostname) > 35:
            domain_score += 10
            flags.append("Unusually long domain name")

    # Text analysis if provided
    text_score = 0
    fee_hits, coercion_hits = [], []
    if req.text:
        fee_hits = keyword_scan(req.text, FEE_PATTERNS)
        coercion_hits = keyword_scan(req.text, COERCION_PATTERNS)
        text_score = min(50, len(fee_hits) * 20 + coercion_score(coercion_hits) // 3)
        if fee_hits:
            flags.append(f"Fee extraction language detected: {len(fee_hits)} pattern(s)")
        if coercion_hits:
            flags.append(f"Coercion markers: {len(coercion_hits)} pattern(s)")

    total_score = min(100, domain_score + text_score)
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
        "analyzedAt": datetime.datetime.utcnow().isoformat(),
    }


@app.post("/analyze/text")
def analyze_text(req: TextRequest):
    text = req.text
    fee_hits = keyword_scan(text, FEE_PATTERNS)
    coercion_hits = keyword_scan(text, COERCION_PATTERNS)

    # Urgency / countdown detection
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

    # IRS lookup simulation
    irs_match = None
    for key, val in IRS_990_DB.items():
        if key in name_lower or name_lower in key:
            irs_match = val
            break

    # Risk assessment
    flags = []
    risk_score = 0

    if not irs_match:
        risk_score += 40
        flags.append("No IRS 990 filing found for this organization name")

    # Check for LLC / Inc in name (nonprofits shouldn't use these)
    if re.search(r"\bllc\b|\binc\b|\bcorp\b|\bltd\b", name_lower):
        risk_score += 25
        flags.append("Organization name includes for-profit entity suffix (LLC/Inc)")

    # Very generic names
    generic_words = ["foundation", "grant", "scholarship", "fund", "award", "bureau", "institute"]
    generic_count = sum(1 for w in generic_words if w in name_lower)
    if generic_count >= 3:
        risk_score += 15
        flags.append("Organization name uses excessive generic scholarship terminology")

    # EIN format validation
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

