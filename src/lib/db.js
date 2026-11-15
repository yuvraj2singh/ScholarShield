/**
 * Prisma singleton — prevents multiple PrismaClient instances in dev (hot-reload safe)
 * Usage: import { db } from '@/lib/db'
 *
 * In production: DATABASE_URL must be set in .env.local
 * Without a DB, all API routes fall back to in-memory/mock data gracefully.
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

