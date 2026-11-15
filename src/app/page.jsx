'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import LandingPage from '@/components/landing/LandingPage'
import RegistryHero from '@/components/registry/RegistryHero'
import StatsBar from '@/components/registry/StatsBar'
import SearchToolbar from '@/components/registry/SearchToolbar'
import ScholarshipList from '@/components/registry/ScholarshipList'
import ForensicSidebar from '@/components/registry/ForensicSidebar'
import RecentActivity from '@/components/registry/RecentActivity'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [filters, setFilters] = useState({
    q: '',
    status: 'all',
    risk: 'all',
    vectors: [],
  })

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
        <p className="text-base text-gray-500 font-medium">Loading ScholarGuard…</p>
      </div>
    )
  }

  // If user is not logged in, display the public Landing Page
  if (status === 'unauthenticated' || !session) {
    return <LandingPage />
  }

  // If user is authenticated with Google, display the full Clearinghouse Portal
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <RegistryHero />
      <StatsBar />
      <SearchToolbar filters={filters} setFilters={setFilters} />
      <div className="mt-6 flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <ScholarshipList filters={filters} />
        </div>
        <div className="hidden lg:block w-80 xl:w-96 shrink-0">
          <ForensicSidebar />
        </div>
      </div>
      <RecentActivity />
    </div>
  )
}
