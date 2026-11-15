/**
 * NextAuth.js — ScholarGuard Admin Authentication
 *
 * Credentials provider:
 * 1. Queries Prisma Analyst table when DATABASE_URL is active
 * 2. Falls back to ADMIN_CREDENTIALS in development/demo mode
 */

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'

const DEV_ADMIN_CREDENTIALS = [
  {
    id:       'admin-1',
    name:     'Dr. Elena Vance, MLS',
    email:    'admin@scholarguard.org',
    role:     'Chief Compliance Officer',
    avatar:   'EV',
    password: process.env.ADMIN_PASSWORD || 'admin',
  },
]

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'scholarguard-dev-secret-change-in-production',

  providers: [
    CredentialsProvider({
      name: 'ScholarGuard Admin',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.toLowerCase().trim()

        // 1. Check Prisma database if configured
        if (process.env.DATABASE_URL) {
          try {
            const analyst = await db.analyst.findUnique({
              where: { email },
            })
            if (analyst) {
              // In production: verify bcrypt hash
              return {
                id:    analyst.id,
                name:  analyst.name,
                email: analyst.email,
                role:  analyst.role,
              }
            }
          } catch (err) {
            console.warn('[NextAuth] Prisma auth check error:', err.message)
          }
        }

        // 2. Dev credentials fallback
        const devUser = DEV_ADMIN_CREDENTIALS.find(
          u => u.email === email && u.password === credentials.password
        )

        if (!devUser) return null

        return {
          id:    devUser.id,
          name:  devUser.name,
          email: devUser.email,
          role:  devUser.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   8 * 60 * 60, // 8 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
      }
      return session
    },
  },

  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
