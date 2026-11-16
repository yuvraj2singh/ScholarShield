/**
 * Login Page — ScholarShield Google Authorization Only
 * Route: /login
 */
'use client'

import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10 text-center">
        {/* Brand logo */}
        <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShieldCheck size={28} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ScholarShield</h1>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          Sign in to access the verified scholarship registry, automated forensic scanner, and fraud intelligence tools.
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-left">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              Authentication failed. Please verify that your Google account is allowed or try again.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <GoogleSignInButton
            size="lg"
            className="w-full justify-center"
            text="Sign in"
            callbackUrl="/"
          />

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            Google authorization is the exclusive authentication standard across the ScholarShield academic network.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft size={14} /> Back to Public Landing
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-gray-500">Loading…</div>}>
      <LoginContent />
    </Suspense>
  )
}

