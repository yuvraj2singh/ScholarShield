/**
 * NextAuth SessionProvider wrapper for the entire app.
 * Required for useSession() to work in client components.
 */
'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

