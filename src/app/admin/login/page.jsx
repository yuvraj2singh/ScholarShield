/**
 * Admin Login Page — NextAuth sign-in page
 * Route: /admin/login
 * Redirects to /admin on successful auth
 */
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok) {
      router.push('/admin')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mb-4 shadow">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">ScholarGuard Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Secure analyst portal access</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <span className="text-xs text-red-700">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@scholarguard.org"
                className="input-base pl-9 text-sm"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="input-base pl-9 pr-10 text-sm"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Authenticating…
              </span>
            ) : (
              'Sign In to Admin Portal'
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-[11px] text-blue-700 font-medium mb-1">Demo credentials</p>
          <p className="text-[10px] text-blue-600 font-mono">admin@scholarguard.org</p>
          <p className="text-[10px] text-blue-600 font-mono">admin</p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11px] text-gray-400 mt-6">
        Access restricted to authorized ScholarGuard analysts.
      </p>
    </div>
  )
}

