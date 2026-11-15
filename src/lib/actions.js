/**
 * Server Actions — ScholarGuard
 * Reusable async functions for server-side data fetching.
 * Import in Server Components or API routes as needed.
 */

import { SCHOLARSHIPS, STATS } from '@/lib/data'

/**
 * Fetch scholarships with optional filters.
 * Returns DB results when DATABASE_URL is set; falls back to mock data.
 */
export async function getScholarships({ page = 1, limit = 10, status = 'ALL', q = '' } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db')
      const where = {
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
      return { data, total, source: 'database' }
    } catch (err) {
      console.warn('[getScholarships] DB error:', err.message)
    }
  }
  // Fallback
  const filtered = SCHOLARSHIPS
    .filter(s => status === 'ALL' || s.status === status)
    .filter(s => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.org.toLowerCase().includes(q.toLowerCase()))
  return {
    data:   filtered.slice((page - 1) * limit, page * limit),
    total:  filtered.length,
    source: 'mock',
  }
}

/**
 * Fetch site-wide stats for telemetry bar and admin dashboard.
 */
export async function getSiteStats() {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db')
      const [total, flagged, reports] = await Promise.all([
        db.scholarship.count(),
        db.scholarship.count({ where: { status: { in: ['SUSPICIOUS','HIGH_RISK','FRAUD'] } } }),
        db.scamReport.count(),
      ])
      return { totalScholarships: total, flaggedCount: flagged, totalReports: reports, source: 'database' }
    } catch (err) {
      console.warn('[getSiteStats] DB error:', err.message)
    }
  }
  return {
    totalScholarships: SCHOLARSHIPS.length,
    flaggedCount:      SCHOLARSHIPS.filter(s => ['SUSPICIOUS','HIGH_RISK','FRAUD'].includes(s.status)).length,
    totalReports:      STATS.reportsSubmitted,
    source:            'mock',
  }
}

/**
 * Fetch recent scam reports for admin dashboard.
 */
export async function getRecentReports(limit = 10) {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db')
      return db.scamReport.findMany({
        take:    limit,
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      console.warn('[getRecentReports] DB error:', err.message)
    }
  }
  return [] // Mock: return empty; AdminClient uses INITIAL_REPORTS constant
}

/**
 * Fetch a single scholarship by ID.
 */
export async function getScholarshipById(id) {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db')
      return db.scholarship.findUnique({ where: { id } })
    } catch (err) {
      console.warn('[getScholarshipById] DB error:', err.message)
    }
  }
  return SCHOLARSHIPS.find(s => s.id === id) ?? null
}

