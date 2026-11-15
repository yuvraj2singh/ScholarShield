import './globals.css'
import NavbarClient from '@/components/layout/NavbarClient'
import SiteFooter from '@/components/layout/SiteFooter'
import AuthProvider from '@/components/auth/AuthProvider'

export const metadata = {
  title: 'ScholarGuard — Scholarship Verification Network',
  description: 'Autonomous scholarship verification, scam detection, and fraud intelligence platform protecting students from predatory scholarship schemes.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ScholarGuard — Scholarship Verification Network',
    description: 'Autonomous scholarship verification, scam detection, and fraud intelligence platform protecting students from predatory scholarship schemes.',
    type: 'website',
  },
}

function TelemetryBar() {
  return (
    <div className="bg-gray-900 text-gray-300 text-[11px] font-mono py-1.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            <span className="text-gray-400">LIVE TELEMETRY:</span>
            <span className="text-white font-semibold">54,820</span>
            <span className="text-gray-400">indexed scholarships</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-red-400 font-semibold">
            362 <span className="text-red-300 font-normal ml-1">Flagged High-Risk</span>
          </span>
          <span className="hidden md:block text-gray-500">Updated 8 mins ago</span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-gray-500 shrink-0">
          <span className="flex items-center gap-1"><span className="text-green-400">●</span> FTC &amp; Dept. of Ed Sync Active</span>
          <span className="flex items-center gap-1"><span className="text-green-400">●</span> Network Status: Nominal</span>
        </div>
      </div>
    </div>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <AuthProvider>
          <TelemetryBar />
          <NavbarClient />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  )
}
