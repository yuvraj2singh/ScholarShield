import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Scholarship from '@/models/Scholarship'
import { SCHOLARSHIPS } from '@/lib/data'

/**
 * GET /api/scholarships
 * Query params: page, limit, status, q, minThreat, maxThreat
 *
 * POST /api/scholarships
 * Body: { name, org, url, award, status, threat, vectors, notes }
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page      = Math.max(1, parseInt(searchParams.get('page')      || '1'))
  const limit     = Math.min(50, parseInt(searchParams.get('limit')    || '10'))
  const status    = searchParams.get('status')                         || 'ALL'
  const q         = searchParams.get('q')                              || ''
  const minThreat = parseInt(searchParams.get('minThreat')             || '0')
  const maxThreat = parseInt(searchParams.get('maxThreat')             || '100')

  try {
    await dbConnect()

    const filter = {
      threat: { $gte: minThreat, $lte: maxThreat },
    }
    if (status !== 'ALL') filter.status = status
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { org:  { $regex: q, $options: 'i' } },
        { url:  { $regex: q, $options: 'i' } },
      ]
    }

    const [total, data] = await Promise.all([
      Scholarship.countDocuments(filter),
      Scholarship.find(filter)
        .sort({ threat: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ])

    return NextResponse.json({
      data,
      meta:   { total, page, limit, pages: Math.ceil(total / limit) },
      source: 'mongodb',
    })
  } catch (err) {
    console.warn('[GET /api/scholarships] MongoDB unavailable, using mock:', err.message)
  }

  // ── Fallback: in-memory mock ─────────────────────────────────────────────────
  let results = [...SCHOLARSHIPS]
  if (status !== 'ALL') results = results.filter(s => s.status === status)
  if (q) {
    const lo = q.toLowerCase()
    results = results.filter(s =>
      s.name.toLowerCase().includes(lo) ||
      s.org.toLowerCase().includes(lo)  ||
      s.url.toLowerCase().includes(lo)
    )
  }
  results = results.filter(s => (s.threat ?? 0) >= minThreat && (s.threat ?? 0) <= maxThreat)
  const total = results.length
  return NextResponse.json({
    data:   results.slice((page - 1) * limit, page * limit),
    meta:   { total, page, limit, pages: Math.ceil(total / limit) },
    source: 'mock',
  })
}

export async function POST(request) {
  const body = await request.json()

  if (!body.name || !body.org || !body.url) {
    return NextResponse.json({ error: 'name, org, and url are required' }, { status: 400 })
  }

  try {
    await dbConnect()
    const scholarship = await Scholarship.create({
      name:   body.name,
      org:    body.org,
      url:    body.url,
      award:  body.award  || 'Amount not specified',
      status: body.status || 'UNVERIFIED',
      threat: body.threat ?? 0,
      vectors:body.vectors || [],
      notes:  body.notes   || [],
      irs:    body.irs ?? false,
      date:   body.date || new Date().toISOString().slice(0, 10),
    })
    return NextResponse.json({ success: true, data: scholarship }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Database write failed', detail: err.message }, { status: 500 })
  }
}
