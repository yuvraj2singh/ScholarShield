import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SCHOLARSHIPS } from '@/lib/data'

export const dynamic = 'force-dynamic'

/**
 * GET /api/scholarships
 * Query params: page, limit, status, q, minThreat, maxThreat
 *
 * POST /api/scholarships
 * Body: { name, org, url, award, status, threatIndex, vectors, notes, domain, irsCompliant }
 *
 * PATCH /api/scholarships
 * Body: { id, status, threatIndex }
 *
 * DELETE /api/scholarships?id=...
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page      = Math.max(1, parseInt(searchParams.get('page')      || '1'))
  const limit     = Math.min(50, parseInt(searchParams.get('limit')    || '10'))
  const status    = searchParams.get('status')                         || 'ALL'
  const q         = searchParams.get('q')                              || ''
  const minThreat = parseInt(searchParams.get('minThreat')             || '0')
  const maxThreat = parseInt(searchParams.get('maxThreat')             || '100')

  if (process.env.DATABASE_URL) {
    try {
      const where = {
        threatIndex: { gte: minThreat, lte: maxThreat },
        ...(status !== 'ALL' && { status }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { org:  { contains: q, mode: 'insensitive' } },
            { url:  { contains: q, mode: 'insensitive' } },
          ],
        }),
      }

      const [total, data] = await Promise.all([
        db.scholarship.count({ where }),
        db.scholarship.findMany({
          where,
          skip:    (page - 1) * limit,
          take:    limit,
          orderBy: { threatIndex: 'desc' },
        }),
      ])

      return NextResponse.json({
        data,
        meta:   { total, page, limit, pages: Math.ceil(total / limit) },
        source: 'prisma',
      })
    } catch (err) {
      console.warn('[GET /api/scholarships] Prisma DB error, falling back to mock:', err.message)
    }
  }

  // ── Fallback: in-memory mock ──
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
  results = results.filter(s => (s.threat ?? s.threatIndex ?? 0) >= minThreat && (s.threat ?? s.threatIndex ?? 0) <= maxThreat)
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

  if (process.env.DATABASE_URL) {
    try {
      const scholarship = await db.scholarship.create({
        data: {
          name:         body.name.trim(),
          org:          body.org.trim(),
          url:          body.url.trim(),
          award:        body.award        || 'Amount not specified',
          status:       body.status       || 'VERIFIED',
          threatIndex:  body.threatIndex  ?? (body.threat ?? 0),
          domain:       body.domain       || null,
          irsCompliant: body.irsCompliant ?? (body.irs ?? false),
          vectors:      body.vectors      || [],
          notes:        body.notes        || [],
        },
      })
      return NextResponse.json({ success: true, data: scholarship, source: 'prisma' }, { status: 201 })
    } catch (err) {
      console.error('[POST /api/scholarships] Prisma create error:', err.message)
      return NextResponse.json({ error: 'Database write failed', detail: err.message }, { status: 500 })
    }
  }

  // Mock return for development without DB
  const mockScholarship = {
    id: `SCH-${Date.now().toString(36).toUpperCase()}`,
    name: body.name,
    org: body.org,
    url: body.url,
    award: body.award || '$5,000',
    status: body.status || 'VERIFIED',
    threatIndex: body.threatIndex ?? (body.threat ?? 0),
    domain: body.domain || 'Registered recently',
    irsCompliant: body.irsCompliant ?? false,
    vectors: body.vectors || [],
    notes: body.notes || ['Added via Analyst Portal'],
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({ success: true, data: mockScholarship, source: 'mock' }, { status: 201 })
}

export async function PATCH(request) {
  const body = await request.json()
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  if (process.env.DATABASE_URL) {
    try {
      const updated = await db.scholarship.update({
        where: { id: body.id },
        data: {
          ...(body.status && { status: body.status }),
          ...(body.threatIndex !== undefined && { threatIndex: body.threatIndex }),
          ...(body.notes && { notes: body.notes }),
        },
      })
      return NextResponse.json({ success: true, data: updated, source: 'prisma' })
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, id: body.id, status: body.status, source: 'mock' })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if (process.env.DATABASE_URL) {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
      if (isObjectId) {
        await db.scholarship.delete({ where: { id } })
      } else {
        await db.scholarship.deleteMany({ where: { url: id } })
      }
      return NextResponse.json({ success: true, id, source: 'prisma' })
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, id, source: 'mock' })
}
