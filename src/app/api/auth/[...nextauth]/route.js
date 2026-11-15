/**
 * NextAuth.js — ScholarGuard Admin Authentication
 *
 * Credentials provider: email + password (hashed with bcrypt in production).
 * For this demo, hardcoded admin account. In production:
 *   1. Set NEXTAUTH_SECRET to a 32-char random string
 *   2. Set ADMIN_EMAIL / ADMIN_PASSWORD_HASH in .env.local
 *   3. Run: openssl rand -base64 32  → paste as NEXTAUTH_SECRET
 */

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const ADMIN_CREDENTIALS = [
  {
    id:       'admin-1',
    name:     'Dr. Elena Vance',
    email:    'admin@scholarguard.org',
    role:     'Super Admin',
    avatar:   null,
    password: process.env.ADMIN_PASSWORD || 'admin', // override via env
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

        const user = ADMIN_CREDENTIALS.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) return null

        // In production: use bcrypt.compare(credentials.password, user.passwordHash)
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
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

