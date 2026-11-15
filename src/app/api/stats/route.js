import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SCHOLARSHIPS, STATS } from '@/lib/data'

export const dynamic = 'force-dynamic'

/**
 * GET /api/stats
 * Telemetry pulse: indexed, verified, flagged, and report stats.
 * Computes from Prisma database when connected; falls back to data.js.
 */
export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
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
        db.scholarship.count(),
        db.scholarship.count({ where: { status: 'VERIFIED' } }),
        db.scholarship.count({ where: { status: { in: ['SUSPICIOUS', 'HIGH_RISK', 'FRAUD', 'CAUTION'] } } }),
        db.scholarship.count({ where: { status: 'FRAUD' } }),
        db.scholarship.count({ where: { status: 'HIGH_RISK' } }),
        db.scamReport.count(),
        db.scamReport.count({ where: { reviewStatus: 'PENDING' } }),
        db.scanReport.count(),
        db.scamReport.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            scholarshipName: true,
            priorityScore: true,
            reviewStatus: true,
            createdAt: true,
          },
        }),
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
        source: 'prisma',
        generatedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('[GET /api/stats] Prisma error, using mock:', err.message)
    }
  }

  // Fallback
  const verified = SCHOLARSHIPS.filter(s => s.status === 'VERIFIED').length
  const flagged  = SCHOLARSHIPS.filter(s => ['SUSPICIOUS', 'HIGH_RISK', 'FRAUD', 'CAUTION'].includes(s.status)).length
  const fraud    = SCHOLARSHIPS.filter(s => s.status === 'FRAUD').length
  const highRisk = SCHOLARSHIPS.filter(s => s.status === 'HIGH_RISK').length
  const reportsSubmitted = STATS.counselorTips || 84

  return NextResponse.json({
    totalScholarships: SCHOLARSHIPS.length,
    verifiedCount:     verified,
    flaggedCount:      flagged,
    fraudCount:        fraud,
    highRiskCount:     highRisk,
    totalReports:      reportsSubmitted,
    pendingReports:    Math.floor(reportsSubmitted * 0.3),
    totalScans:        14,
    recentReports:     [],
    source:            'mock',
    generatedAt:       new Date().toISOString(),
  })
}
