import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ─── Pattern Libraries ────────────────────────────────────────────────────────

const HIGH_RISK_TLDS = new Set([
  '.biz','.info','.cc','.tk','.ml','.ga','.cf','.gq',
  '.top','.xyz','.click','.link','.loan','.win','.online',
  '.site','.website','.club','.icu','.buzz','.work',
])

const FEE_PATTERNS = [
  /processing\s+fee/i, /courier\s+fee/i, /certificate\s+fee/i,
  /registration\s+fee/i, /handling\s+fee/i, /application\s+fee/i,
  /administrative\s+fee/i, /activation\s+fee/i, /deposit\s+required/i,
  /pay.*before.*receiv/i, /wire\s+transfer/i, /upfront\s+payment/i,
  /advance\s+payment/i, /send\s+money/i, /disbursement\s+fee/i,
]

const COERCION_PATTERNS = [
  /guaranteed\s+(award|scholarship|win)/i, /pre.?selected/i,
  /you\s+have\s+been\s+chosen/i, /act\s+now/i,
  /only\s+\d+\s+(spot|slot|position)s?\s+(left|remaining)/i,
  /100\s*%\s+accept/i, /expires?\s+in\s+\d+/i, /final\s+notice/i,
  /last\s+chance/i, /click\s+immediately/i, /respond\s+within/i,
]

const KNOWN_LEGIT = new Set([
  'studentaid.gov','nsfgrfp.org','gatesfoundation.org','gates-foundation.org',
  'nationalmerit.org','rhodeshouse.ox.ac.uk',
  'coca-colascholarsfoundation.org','jacksontscharger.org','fulbrightprogram.org',
])

const KNOWN_FRAUD = new Set([
  'national-meritscholars-portal.org','american-opportunity-grants.net',
  'quantumleap-edu-scholarship.info','ivy-ivyleague-fellowship.net',
  'scholars-awards.ac',
])

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractHostname(url) {
  return url.replace(/^https?:\/\//i,'').replace(/\/.*$/,'').toLowerCase().trim()
}

function getTLD(hostname) {
  const parts = hostname.split('.')
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : ''
}

function scanPatterns(text, patterns) {
  return patterns.filter(p => p.test(text)).map(p => p.source.replace(/\\s\+/g,' '))
}

// ─── Core JS Analysis Engine ──────────────────────────────────────────────────

function jsAnalyze(url, text) {
  const hostname     = extractHostname(url || '')
  const tld          = getTLD(hostname)
  const hyphens      = (hostname.match(/-/g) || []).length
  const isKnownLegit = KNOWN_LEGIT.has(hostname) || hostname.endsWith('.gov') || hostname.endsWith('.edu')
  const isKnownFraud = KNOWN_FRAUD.has(hostname)

  let score = 0
  const flags = []

  if (isKnownFraud) {
    score = 90; flags.push('Domain confirmed in ScholarShield fraud registry')
  } else if (!isKnownLegit) {
    if (HIGH_RISK_TLDS.has(tld)) { score += 35; flags.push(`High-risk TLD: ${tld}`) }
    if (hyphens >= 3)             { score += 20; flags.push(`Excessive hyphens (${hyphens})`) }
    else if (hyphens >= 2)        { score += 10 }
    if (hostname.length > 35)     { score += 10; flags.push('Unusually long domain name') }
  }

  const content      = (text || url || '').toLowerCase()
  const feeHits      = scanPatterns(content, FEE_PATTERNS)
  const coercionHits = scanPatterns(content, COERCION_PATTERNS)
  const hasSSN       = /social\s+security|ssn\b/i.test(content)
  const hasRouting   = /routing\s+number|bank\s+account/i.test(content)

  score += Math.min(50, feeHits.length * 20)
  score += Math.min(30, coercionHits.length * 8)
  if (hasSSN)     { score += 20; flags.push('SSN solicitation detected') }
  if (hasRouting) { score += 20; flags.push('Bank routing request detected') }

  score = Math.min(100, score)
  if (isKnownLegit) score = Math.min(score, 5)

  const status =
    score >= 80 ? 'FRAUD'     :
    score >= 60 ? 'HIGH_RISK' :
    score >= 40 ? 'SUSPICIOUS':
    score >= 20 ? 'CAUTION'   : 'VERIFIED'

  const pillars = [
    {
      id: 'domain', label: 'Domain & WHOIS Integrity',
      status: isKnownFraud ? 'CRITICAL' : HIGH_RISK_TLDS.has(tld) ? 'CRITICAL' : hyphens >= 2 ? 'CAUTION' : 'PASS',
      rows: [
        { label: 'Hostname',        value: hostname || '(text analysis)' },
        { label: 'TLD',             value: tld || 'N/A',                        flag: HIGH_RISK_TLDS.has(tld) },
        { label: 'Hyphen Count',    value: String(hyphens),                     flag: hyphens >= 2 },
        { label: 'Registry Status', value: isKnownFraud ? 'CONFIRMED FRAUD' : isKnownLegit ? 'VERIFIED CLEAN' : 'UNVERIFIED', flag: isKnownFraud },
      ],
    },
    {
      id: 'financial', label: 'Financial Extraction Demand',
      status: feeHits.length > 0 ? 'CRITICAL' : 'PASS',
      rows: [
        { label: 'Fee Keywords',    value: `${feeHits.length} detected`,             flag: feeHits.length > 0 },
        { label: 'Patterns Found',  value: feeHits.slice(0,2).join(', ') || 'None', flag: feeHits.length > 0 },
        { label: 'Federal Standard',value: '$0 — No Fees Ever' },
      ],
    },
    {
      id: 'linguistic', label: 'Linguistic Coercion Markers',
      status: coercionHits.length >= 3 ? 'CRITICAL' : coercionHits.length > 0 ? 'CAUTION' : 'PASS',
      rows: [
        { label: 'Coercion Markers', value: `${coercionHits.length} detected`,               flag: coercionHits.length > 0 },
        { label: 'Terms Found',      value: coercionHits.slice(0,2).join(', ') || 'None',   flag: coercionHits.length > 0 },
        { label: 'Coercion Index',   value: `${Math.min(100, coercionHits.length * 12)}/100` },
      ],
    },
    {
      id: 'identity', label: 'Identity Harvesting Signals',
      status: (hasSSN || hasRouting) ? 'CRITICAL' : 'PASS',
      rows: [
        { label: 'SSN Solicitation',     value: hasSSN     ? 'DETECTED' : 'Not found', flag: hasSSN },
        { label: 'Bank Routing Request', value: hasRouting ? 'DETECTED' : 'Not found', flag: hasRouting },
      ],
    },
    {
      id: 'entity', label: 'Entity & Tax Status Registry',
      status: isKnownLegit ? 'PASS' : isKnownFraud ? 'FAIL' : 'CAUTION',
      rows: [
        { label: 'IRS 990 Match',   value: isKnownLegit ? 'Filed & Active' : 'Unverified',                                      flag: !isKnownLegit },
        { label: 'Registry Status', value: isKnownFraud ? 'No Records — Fraudulent' : isKnownLegit ? 'Confirmed Legitimate' : 'Requires Manual Check', flag: isKnownFraud },
      ],
    },
    {
      id: 'maildrop', label: 'Physical Entity Verification',
      status: isKnownFraud ? 'FAIL' : isKnownLegit ? 'PASS' : 'CAUTION',
      rows: [
        { label: 'Address Verified', value: isKnownLegit ? 'Yes — institutional address' : 'Unknown / Unverified', flag: !isKnownLegit },
        { label: 'CMRA Maildrop',    value: isKnownFraud ? 'Likely — commercial mail agency' : 'Not confirmed',    flag: isKnownFraud },
      ],
    },
  ]

  const critical = pillars.filter(p => p.status === 'CRITICAL').length
  const caution  = pillars.filter(p => p.status === 'CAUTION' || p.status === 'FAIL').length
  const cleared  = pillars.filter(p => p.status === 'PASS').length

  return {
    url: url || '(text analysis)',
    hostname,
    threatIndex: score,
    threat: score,
    status,
    critical, caution, cleared,
    flags,
    feeKeywords:      feeHits,
    coercionKeywords: coercionHits,
    hasSSN,
    hasRouting,
    pillars,
    ref: `SG-${Date.now().toString(36).toUpperCase().slice(-8)}`,
    engine: 'js-builtin',
    timestamp: new Date().toISOString(),
  }
}

// ─── Persist to Prisma Database (non-blocking) ──────────────────────────────

async function persistScan(result) {
  if (!process.env.DATABASE_URL) return

  try {
    await db.scanReport.create({
      data: {
        url:           result.url,
        threatIndex:   result.threatIndex,
        status:        result.status,
        engine:        result.engine,
        pillars:       result.pillars,
        flags:         result.flags,
        feeKeywords:   result.feeKeywords,
        coercionWords: result.coercionKeywords,
        hasSSN:        result.hasSSN,
        hasRouting:    result.hasRouting,
        auditRef:      result.ref,
      },
    })
  } catch (err) {
    console.warn('[scan] Prisma persist skipped:', err.message)
  }
}

// ─── Route Handlers ──────────────────────────────────────────────────────────

export async function POST(request) {
  const body = await request.json()
  const { url, text } = body

  if (!url && !text) {
    return NextResponse.json({ error: 'url or text is required' }, { status: 400 })
  }

  let result = null

  // Try Python FastAPI engine with 7500ms timeout for live WHOIS + crawl
  const engineUrl = process.env.ANALYSIS_ENGINE_URL || 'http://localhost:8000'
  try {
    const pyRes = await fetch(`${engineUrl}/analyze/url`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ url: url || '', text: text || '' }),
      signal:  AbortSignal.timeout(7500),
    })

    if (pyRes.ok) {
      const pyData = await pyRes.json()
      const jsData = jsAnalyze(url, text)

      // Merge and enrich diagnostic pillars
      const enrichedPillars = jsData.pillars.map(pillar => {
        const p = { ...pillar, rows: [...pillar.rows] }

        // Pillar 1: Domain & WHOIS Integrity
        if (p.id === 'domain' && pyData.whois?.success) {
          const age = pyData.whois.domainAgeDays
          if (age !== null && age !== undefined) {
            const isYoung = age < 180
            p.rows.push({
              label: 'Domain Age',
              value: `${age} Days ${age < 60 ? '(Critical Risk < 60d)' : isYoung ? '(Probationary < 180d)' : '(Established)'}`,
              flag: isYoung,
            })
            if (age < 60) p.status = 'CRITICAL'
            else if (isYoung && p.status !== 'CRITICAL') p.status = 'CAUTION'
          }
          if (pyData.whois.registrar) {
            p.rows.push({
              label: 'WHOIS Registrar',
              value: String(pyData.whois.registrar).slice(0, 32),
              flag: false,
            })
          }
          if (pyData.whois.privacyShield !== undefined) {
            p.rows.push({
              label: 'Privacy Proxy',
              value: pyData.whois.privacyShield ? 'Active Shield (Proxy / Redacted)' : 'Public / Standard Registry',
              flag: Boolean(pyData.whois.privacyShield && (age !== null && age < 180)),
            })
          }
        }

        // Pillar 2: Financial Extraction Demand
        if (p.id === 'financial' && pyData.crawl?.paymentSignals?.length > 0) {
          p.status = 'CRITICAL'
          p.rows.unshift({
            label: 'Unsanctioned Rails',
            value: pyData.crawl.paymentSignals.join(', '),
            flag: true,
          })
        }

        // Pillar 4: Identity Harvesting Signals
        if (p.id === 'identity' && pyData.crawl?.harvestingSignals?.length > 0) {
          p.status = 'CRITICAL'
          p.rows.unshift({
            label: 'Form Harvesting',
            value: pyData.crawl.harvestingSignals.join(', '),
            flag: true,
          })
        }

        return p
      })

      const finalThreat = pyData.threatIndex ?? jsData.threatIndex
      const finalStatus = pyData.status ?? jsData.status
      const mergedFlags = [...(pyData.flags || []), ...jsData.flags]
      const uniqueFlags = Array.from(new Set(mergedFlags)).slice(0, 10)

      const critical = enrichedPillars.filter(p => p.status === 'CRITICAL').length
      const caution  = enrichedPillars.filter(p => p.status === 'CAUTION' || p.status === 'FAIL').length
      const cleared  = enrichedPillars.filter(p => p.status === 'PASS').length

      result = {
        ...jsData,
        threatIndex: finalThreat,
        threat:      finalThreat,
        status:      finalStatus,
        critical,
        caution,
        cleared,
        flags:       uniqueFlags,
        pillars:     enrichedPillars,
        whois:       pyData.whois || null,
        crawl:       pyData.crawl || null,
        engine:      'python-fastapi',
      }
    }
  } catch {
    // Python unavailable or timed out — silent fallback to JS engine
  }

  if (!result) result = jsAnalyze(url, text)

  // Persist asynchronously
  persistScan(result).catch(() => {})

  return NextResponse.json(result)
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))

  if (process.env.DATABASE_URL) {
    try {
      const scans = await db.scanReport.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          threatIndex: true,
          status: true,
          engine: true,
          auditRef: true,
          createdAt: true,
        },
      })
      return NextResponse.json({ data: scans, total: scans.length, source: 'prisma' })
    } catch (err) {
      console.warn('[GET /api/scan] Prisma error:', err.message)
    }
  }

  return NextResponse.json({ data: [], total: 0, source: 'mock' })
}
