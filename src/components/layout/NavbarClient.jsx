'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Bell, User, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { label: 'Public Directory', href: '/' },
  { label: 'URL & Domain Scanner', href: '/scanner' },
  { label: 'Threat Patterns', href: '/threats' },
  { label: 'Report a Scam', href: '/report' },
  { label: 'Database Registry', href: '/registry' },
]

export default function NavbarClient() {
  const path = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-[36px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-blue-700 group-hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors">
              <Shield size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold text-gray-900 tracking-tight">ScholarGuard</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-medium hidden sm:block">Verification Network</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={path === item.href ? 'nav-link-active' : 'nav-link'}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <Link
              href="/verify"
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${path === '/verify' ? 'bg-blue-800 text-white ring-2 ring-blue-400' : 'bg-blue-700 hover:bg-blue-800 text-white'}`}
            >
              <Shield size={13} strokeWidth={2.5} />
              Verify a Link
            </Link>

            <button className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={12} className="text-blue-700" />
              </div>
              <span className="font-medium">E. Vance, MLS</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${path === item.href ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/verify"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-2.5 rounded-lg mt-2"
          >
            🔍 Verify a Link
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="block text-xs text-gray-400 px-3 py-2 hover:text-gray-600 transition-colors"
          >
            Admin Dashboard →
          </Link>
        </div>
      )}
    </header>
  )
}
