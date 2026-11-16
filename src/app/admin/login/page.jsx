/**
 * Admin Login Page — ScholarShield Google Authorization Only
 * Route: /admin/login
 */
'use client'

import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10 text-center">
        <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShieldCheck size={28} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">ScholarShield Admin</h1>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          Google authorization is required to access the compliance console and analyst tools.
        </p>

        <div className="space-y-4">
          <GoogleSignInButton
            size="lg"
            className="w-full justify-center"
            text="Continue with Google"
            callbackUrl="/admin"
          />

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            Sign-in is authenticated exclusively through Google OAuth. No username or password required.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
