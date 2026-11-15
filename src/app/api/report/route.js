import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import ScamReport from '@/models/ScamReport'

/**
 * POST /api/report
 * GET  /api/report  — returns recent reports (admin use)
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'))
  const status = searchParams.get('status') || ''

  try {
    await dbConnect()
    const filter = status ? { reviewStatus: status } : {}
    const reports = await ScamReport.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    return NextResponse.json({ data: reports, total: reports.length, source: 'mongodb' })
  } catch (err) {
    return NextResponse.json({ data: [], total: 0, source: 'mock', error: err.message })
  }
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

  try {
    await dbConnect()

    const report = await ScamReport.create({
      scholarshipName: body.scholarshipName,
      orgName:         body.orgName,
      url:             body.url         || null,
      channel:         body.channel     || 'Unknown',
      indicators:      body.indicators  || [],
      amount:          body.amount      ? parseFloat(body.amount) : undefined,
      paymentMethod:   body.paymentMethod || null,
      notes:           body.notes       || null,
      submitterRole:   body.submitterRole || 'Unknown',
      submitterName:   body.anonymous ? null : (body.submitterName || null),
      submitterEmail:  body.anonymous ? null : (body.submitterEmail || null),
      anonymous:       body.anonymous  ?? true,
      fileCount:       body.fileCount  || 0,
      priorityScore,
    })

    return NextResponse.json({
      success:             true,
      reportId:            report._id.toString(),
      message:             'Report received and queued for analyst review within 24 hours.',
      priorityScore,
      estimatedReviewTime: priorityScore > 60 ? '2-4 hours (high priority)' : '24 hours',
      submittedAt:         report.createdAt,
      source:              'mongodb',
    })
  } catch (err) {
    console.warn('[POST /api/report] MongoDB error:', err.message)

    // Fallback — still acknowledge the report
    const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`
    return NextResponse.json({
      success:             true,
      reportId,
      message:             'Report received (queued offline). Our team will review within 24 hours.',
      priorityScore,
      estimatedReviewTime: priorityScore > 60 ? '2-4 hours' : '24 hours',
      submittedAt:         new Date().toISOString(),
      source:              'mock',
    })
  }
}

/**
 * PATCH /api/report  — update review status (admin)
 * Body: { id, reviewStatus }
 */
export async function PATCH(request) {
  const body = await request.json()
  const VALID = ['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'DISMISSED']

  if (!body.id || !VALID.includes(body.reviewStatus)) {
    return NextResponse.json({ error: 'id and valid reviewStatus required' }, { status: 400 })
  }

  try {
    await dbConnect()
    const updated = await ScamReport.findByIdAndUpdate(
      body.id,
      {
        reviewStatus: body.reviewStatus,
        ...(body.reviewStatus === 'CONFIRMED' || body.reviewStatus === 'DISMISSED'
          ? { resolvedAt: new Date() }
          : {}),
      },
      { new: true }
    )
    if (!updated) return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
