import './globals.css'
import NavbarClient from '@/components/layout/NavbarClient'
import SiteFooter from '@/components/layout/SiteFooter'
import AuthProvider from '@/components/auth/AuthProvider'

export const metadata = {
  title: 'ScholarShield — Scholarship Verification Network',
  description: 'Autonomous scholarship verification, scam detection, and fraud intelligence platform protecting students from predatory scholarship schemes.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ScholarShield — Scholarship Verification Network',
    description: 'Autonomous scholarship verification, scam detection, and fraud intelligence platform protecting students from predatory scholarship schemes.',
    type: 'website',
  },
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
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans text-base">
        <AuthProvider>
          <NavbarClient />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  )
}
