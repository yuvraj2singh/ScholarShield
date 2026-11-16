import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/analyze/text
 * Proxies to Python /analyze/text endpoint.
 * Falls back to built-in JS pattern engine.
 *
 * Body: { text: string, source_url?: string }
 */

const FEE_PATTERNS = [
  /processing\s+fee/i, /courier\s+fee/i, /certificate\s+fee/i,
  /registration\s+fee/i, /handling\s+fee/i, /application\s+fee/i,
  /administrative\s+fee/i, /deposit\s+required/i, /wire\s+transfer/i,
  /upfront\s+payment/i, /advance\s+payment/i, /send\s+money/i,
]

const COERCION_PATTERNS = [
  /guaranteed\s+(award|scholarship|win)/i, /pre.?selected/i,
  /you\s+have\s+been\s+chosen/i, /act\s+now/i,
  /100\s*%\s+accept/i, /expires?\s+in\s+\d+/i, /final\s+notice/i,
  /last\s+chance/i, /click\s+immediately/i, /respond\s+within/i,
]

function jsTextAnalyze(text) {
  const lower = text.toLowerCase()
  const feeHits      = FEE_PATTERNS.filter(p => p.test(lower)).map(p => p.source)
  const coercionHits = COERCION_PATTERNS.filter(p => p.test(lower)).map(p => p.source)
  const hasCountdown = /\d+\s*(hour|minute|day)s?\s*(left|remaining|only)/i.test(text)
  const hasGuarantee = /100\s*%|guaranteed|assured/i.test(text)
  const hasSSN       = /social\s+security|ssn|passport\s+number/i.test(text)
  const hasRouting   = /routing\s+number|bank\s+account|iban|swift/i.test(text)

  const riskScore = Math.min(100,
    feeHits.length * 25 +
    coercionHits.length * 12 +
    (hasSSN     ? 20 : 0) +
    (hasRouting ? 20 : 0) +
    (hasCountdown ? 10 : 0) +
    (hasGuarantee ?  5 : 0)
  )

  const status =
    riskScore >= 80 ? 'FRAUD' :
    riskScore >= 60 ? 'HIGH_RISK' :
    riskScore >= 40 ? 'SUSPICIOUS' :
    riskScore >= 20 ? 'CAUTION' : 'VERIFIED'

  return {
    textLength:       text.length,
    threatIndex:      riskScore,
    status,
    feeKeywords:      feeHits,
    feeCount:         feeHits.length,
    coercionKeywords: coercionHits,
    coercionCount:    coercionHits.length,
    hasCountdown,
    hasGuarantee,
    hasSSNRequest:    hasSSN,
    hasRoutingRequest: hasRouting,
    coercionIndex:    `${Math.min(100, coercionHits.length * 12)}/100`,
    engine:           'js-builtin',
    analyzedAt:       new Date().toISOString(),
  }
}

export async function POST(request) {
  const body = await request.json()
  if (!body.text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }

  const engineUrl = process.env.ANALYSIS_ENGINE_URL || 'http://localhost:8000'
  try {
    const pyRes = await fetch(`${engineUrl}/analyze/text`, {
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
    // Python unavailable — JS fallback
  }

  return NextResponse.json(jsTextAnalyze(body.text))
}

