import { NextResponse } from 'next/server'

/**
 * POST /api/analyze/entity
 * Proxies to the Python FastAPI /analyze/entity endpoint.
 * Falls back to a JS-based entity check when Python engine is unavailable.
 *
 * Body:
 *   organization_name  string  (required)
 *   claimed_ein        string  (optional, format: XX-XXXXXXX)
 *   state              string  (optional)
 */

// Known nonprofits (JS fallback DB)
const IRS_990_DB = {
  'gates foundation':           { ein: '56-2618866', status: '501(c)(3)', year: 1994 },
  'coca-cola scholars':         { ein: '58-1620666', status: '501(c)(3)', year: 1986 },
  'national merit scholarship': { ein: '36-2167817', status: '501(c)(3)', year: 1955 },
  'nsf':                        { ein: '53-0219886', status: 'Federal Agency', year: 1950 },
  'jack kent cooke':            { ein: '52-1948667', status: '501(c)(3)', year: 2000 },
  'gates millennium':           { ein: '56-2618866', status: '501(c)(3)', year: 1999 },
}

function jsEntityCheck(orgName, claimedEin) {
  const lower = orgName.toLowerCase().trim()

  let irsMatch = null
  for (const [key, val] of Object.entries(IRS_990_DB)) {
    if (lower.includes(key) || key.includes(lower.slice(0, 10))) {
      irsMatch = val
      break
    }
  }

  const flags = []
  let riskScore = 0

  if (!irsMatch) {
    riskScore += 40
    flags.push('No IRS 990 filing found for this organization name')
  }

  if (/\bllc\b|\binc\b|\bcorp\b|\bltd\b/i.test(lower)) {
    riskScore += 25
    flags.push('Organization name includes for-profit entity suffix (LLC/Inc/Corp)')
  }

  const genericTerms = ['foundation','grant','scholarship','fund','award','bureau','institute']
  const genericCount = genericTerms.filter(w => lower.includes(w)).length
  if (genericCount >= 3) {
    riskScore += 15
    flags.push('Organization name uses excessive generic scholarship terminology')
  }

  let einValid = null
  if (claimedEin) {
    einValid = /^\d{2}-\d{7}$/.test(claimedEin)
    if (!einValid) {
      riskScore += 10
      flags.push('Claimed EIN format is invalid (expected XX-XXXXXXX)')
    }
  }

  riskScore = Math.min(100, riskScore)

  const status =
    riskScore >= 80 ? 'FRAUD' :
    riskScore >= 60 ? 'HIGH_RISK' :
    riskScore >= 40 ? 'SUSPICIOUS' :
    riskScore >= 20 ? 'CAUTION' : 'VERIFIED'

  return {
    organizationName: orgName,
    irs990Found:      irsMatch !== null,
    irs990Data:       irsMatch,
    einValid,
    threatIndex:      riskScore,
    status,
    flags,
    engine:           'js-builtin',
    analyzedAt:       new Date().toISOString(),
  }
}

export async function POST(request) {
  const body = await request.json()

  if (!body.organization_name) {
    return NextResponse.json({ error: 'organization_name is required' }, { status: 400 })
  }

  // Try Python engine
  const engineUrl = process.env.ANALYSIS_ENGINE_URL || 'http://localhost:8000'
  try {
    const pyRes = await fetch(`${engineUrl}/analyze/entity`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(3000),
    })
    if (pyRes.ok) {
      const data = await pyRes.json()
      return NextResponse.json({ ...data, engine: 'python-fastapi' })
    }
  } catch {
    // Python unavailable — use JS fallback
  }

  return NextResponse.json(jsEntityCheck(body.organization_name, body.claimed_ein))
}

