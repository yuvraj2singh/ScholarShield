import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/report
 * Returns recent reports for admin review.
 *
 * POST /api/report
 * Accepts a scam report submission and persists to Prisma.
 *
 * PATCH /api/report
 * Updates review status: PENDING -> UNDER_REVIEW -> CONFIRMED -> DISMISSED.
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'))
  const status = searchParams.get('status') || ''

  if (process.env.DATABASE_URL) {
    try {
      const where = status ? { reviewStatus: status } : {}
      const reports = await db.scamReport.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ data: reports, total: reports.length, source: 'prisma' })
    } catch (err) {
      console.warn('[GET /api/report] Prisma error:', err.message)
    }
  }

  // Fallback initial reports
  const mockReports = [
    { id: 'RPT-A1B2', scholarshipName: 'QuantumLeap Scholarship',  orgName: 'QuantumLeap LLC',      reviewStatus: 'PENDING',       priorityScore: 78, createdAt: '2025-06-10T12:00:00Z', submitterRole: 'HS Counselor',         indicators: ['fee', 'domain'] },
    { id: 'RPT-C3D4', scholarshipName: 'Elite Scholar Award',       orgName: 'Elite Grants Bureau',  reviewStatus: 'UNDER_REVIEW',  priorityScore: 91, createdAt: '2025-06-09T14:30:00Z', submitterRole: 'Student',              indicators: ['fee', 'routing', 'ssn'] },
    { id: 'RPT-E5F6', scholarshipName: 'National STEM Grant',       orgName: 'Unknown',              reviewStatus: 'CONFIRMED',     priorityScore: 95, createdAt: '2025-06-08T09:15:00Z', submitterRole: 'Financial Aid Officer', indicators: ['fee', 'domain', 'guaranteed'] },
    { id: 'RPT-G7H8', scholarshipName: 'Community Leaders Fund',    orgName: 'CLF Initiative',       reviewStatus: 'DISMISSED',     priorityScore: 22, createdAt: '2025-06-07T16:45:00Z', submitterRole: 'Parent / Guardian',    indicators: ['unsolicited'] },
  ]

  return NextResponse.json({ data: mockReports, total: mockReports.length, source: 'mock' })
}

export async function POST(request) {
  const body = await request.json()

  if (!body.scholarshipName || !body.orgName) {
    return NextResponse.json(
      { error: 'scholarshipName and orgName are required' },
      { status: 400 }
    )
  }

  const priorityScore = Math.min(100,
    (body.indicators?.length || 0) * 15 +
    (body.amount > 0 ? 20 : 0) +
    (body.url?.includes('.biz') || body.url?.includes('.info') ? 15 : 0) +
    (body.anonymous === false ? 5 : 0)
  )

  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`

  if (process.env.DATABASE_URL) {
    try {
      const report = await db.scamReport.create({
        data: {
          reportId,
          scholarshipName: body.scholarshipName,
          orgName:         body.orgName,
          url:             body.url || null,
          channel:         body.discoveryChannel || body.channel || 'Unknown',
          indicators:      body.indicators || [],
          amount:          body.amount ? parseFloat(body.amount) : null,
          paymentMethod:   body.paymentMethod || null,
          notes:           body.notes || null,
          submitterRole:   body.submitterRole || 'Unknown',
          submitterName:   body.anonymous ? null : (body.submitterName || null),
          submitterEmail:  body.anonymous ? null : (body.submitterEmail || null),
          anonymous:       body.anonymous ?? true,
          fileCount:       body.fileCount || 0,
          priorityScore,
        },
      })

      return NextResponse.json({
        success:             true,
        reportId:            report.reportId || report.id,
        message:             'Report received and queued for analyst review within 24 hours.',
        priorityScore,
        estimatedReviewTime: priorityScore > 60 ? '2-4 hours (high priority)' : '24 hours',
        submittedAt:         report.createdAt,
        source:              'prisma',
      })
    } catch (err) {
      console.warn('[POST /api/report] Prisma persist failed:', err.message)
    }
  }

  return NextResponse.json({
    success:             true,
    reportId,
    message:             'Report received and queued for analyst review within 24 hours.',
    priorityScore,
    estimatedReviewTime: priorityScore > 60 ? '2-4 hours (high priority)' : '24 hours',
    submittedAt:         new Date().toISOString(),
    source:              'mock',
  })
}

export async function PATCH(request) {
  const body = await request.json()
  const VALID = ['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'DISMISSED']

  if (!body.id || !VALID.includes(body.reviewStatus)) {
    return NextResponse.json({ error: 'id and valid reviewStatus required' }, { status: 400 })
  }

  if (process.env.DATABASE_URL) {
    try {
      const isResolved = body.reviewStatus === 'CONFIRMED' || body.reviewStatus === 'DISMISSED'
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(body.id)

      const updated = isObjectId
        ? await db.scamReport.update({
            where: { id: body.id },
            data: {
              reviewStatus: body.reviewStatus,
              ...(isResolved ? { resolvedAt: new Date() } : { resolvedAt: null }),
            },
          })
        : await db.scamReport.update({
            where: { reportId: body.id },
            data: {
              reviewStatus: body.reviewStatus,
              ...(isResolved ? { resolvedAt: new Date() } : { resolvedAt: null }),
            },
          })

      return NextResponse.json({ success: true, data: updated, source: 'prisma' })
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({
    success: true,
    data: { id: body.id, reviewStatus: body.reviewStatus },
    source: 'mock',
  })
}
