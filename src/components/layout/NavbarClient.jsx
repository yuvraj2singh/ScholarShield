'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, User, ChevronDown, Menu, X, LogOut, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

const NAV = [
  { label: 'Public Directory', href: '/' },
  { label: 'URL & Domain Scanner', href: '/scanner' },
  { label: 'Threat Patterns', href: '/threats' },
  { label: 'Report a Scam', href: '/report' },
  { label: 'Database Registry', href: '/registry' },
]

export default function NavbarClient() {
  const path = usePathname()
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  const isAuthenticated = status === 'authenticated' && session?.user

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-9 h-9 bg-blue-700 group-hover:bg-blue-800 rounded-xl flex items-center justify-center transition-colors shadow-sm">
              <Shield size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold text-gray-900 tracking-tight">ScholarShield</div>
              
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(item => {
              const active = path === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium px-2 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    active
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm ${
                path === '/verify'
                  ? 'bg-blue-800 text-white ring-2 ring-blue-400'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              <Shield size={15} strokeWidth={2.5} />
              <span>Verify a Link</span>
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(d => !d)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User avatar'}
                      className="w-7 h-7 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User size={14} />}
                    </div>
                  )}
                  <span className="font-semibold max-w-[120px] truncate hidden sm:inline">
                    {session.user.name || session.user.email}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Dropdown */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-bold text-gray-900 truncate">{session.user.name || 'Analyst'}</div>
                      <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-gray-100"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <GoogleSignInButton
                size="sm"
                text="Sign in"
                callbackUrl="/"
                className="hidden sm:inline-flex"
              />
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-base font-medium px-3.5 py-2.5 rounded-xl transition-colors ${
                path === item.href ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/verify"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 px-4 py-3 rounded-xl mt-3 text-center"
          >
            Verify a Link
          </Link>
          <div className="pt-3 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-center text-sm font-semibold text-red-600 py-2.5 hover:bg-red-50 rounded-xl"
              >
                Sign Out ({session.user.name || session.user.email})
              </button>
            ) : (
              <GoogleSignInButton
                size="md"
                text="Sign in"
                callbackUrl="/"
                className="w-full justify-center"
              />
            )}
          </div>
        </div>
      )}
    </header>
  )
}
