import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Scholarship from '@/models/Scholarship'
import ScamReport from '@/models/ScamReport'
import ScanReport from '@/models/ScanReport'
import { SCHOLARSHIPS, STATS } from '@/lib/data'

/**
 * GET /api/stats
 * Live telemetry: totals, flagged counts, recent reports.
 * Falls back to mock data when MongoDB is unavailable.
 */
export async function GET() {
  try {
    await dbConnect()

    const [
      totalScholarships,
      verifiedCount,
      flaggedCount,
      fraudCount,
      highRiskCount,
      totalReports,
      pendingReports,
      totalScans,
      recentReports,
    ] = await Promise.all([
      Scholarship.countDocuments(),
      Scholarship.countDocuments({ status: 'VERIFIED' }),
      Scholarship.countDocuments({ status: { $in: ['SUSPICIOUS','HIGH_RISK','FRAUD','CAUTION'] } }),
      Scholarship.countDocuments({ status: 'FRAUD' }),
      Scholarship.countDocuments({ status: 'HIGH_RISK' }),
      ScamReport.countDocuments(),
      ScamReport.countDocuments({ reviewStatus: 'PENDING' }),
      ScanReport.countDocuments(),
      ScamReport.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('scholarshipName priorityScore reviewStatus createdAt')
        .lean(),
    ])

    return NextResponse.json({
      totalScholarships,
      verifiedCount,
      flaggedCount,
      fraudCount,
      highRiskCount,
      totalReports,
      pendingReports,
      totalScans,
      recentReports,
      source:      'mongodb',
      generatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('[GET /api/stats] MongoDB unavailable:', err.message)
  }

  // ── Fallback ─────────────────────────────────────────────────────────────────
  const verified = SCHOLARSHIPS.filter(s => s.status === 'VERIFIED').length
  const flagged  = SCHOLARSHIPS.filter(s => ['SUSPICIOUS','HIGH_RISK','FRAUD','CAUTION'].includes(s.status)).length
  const fraud    = SCHOLARSHIPS.filter(s => s.status === 'FRAUD').length
  const highRisk = SCHOLARSHIPS.filter(s => s.status === 'HIGH_RISK').length

  return NextResponse.json({
    totalScholarships: SCHOLARSHIPS.length,
    verifiedCount:     verified,
    flaggedCount:      flagged,
    fraudCount:        fraud,
    highRiskCount:     highRisk,
    totalReports:      STATS.reportsSubmitted,
    pendingReports:    Math.floor(STATS.reportsSubmitted * 0.3),
    totalScans:        0,
    recentReports:     [],
    source:            'mock',
    generatedAt:       new Date().toISOString(),
  })
}
