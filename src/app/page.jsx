'use client'
import { useState } from 'react'
import RegistryHero from '@/components/registry/RegistryHero'
import StatsBar from '@/components/registry/StatsBar'
import SearchToolbar from '@/components/registry/SearchToolbar'
import ScholarshipList from '@/components/registry/ScholarshipList'
import ForensicSidebar from '@/components/registry/ForensicSidebar'
import RecentActivity from '@/components/registry/RecentActivity'

export default function HomePage() {
  const [filters, setFilters] = useState({
    q: '',
    status: 'all',
    risk: 'all',
    vectors: [],
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <RegistryHero />
      <StatsBar />
      <SearchToolbar filters={filters} setFilters={setFilters} />
      <div className="mt-5 flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <ScholarshipList filters={filters} />
        </div>
        <div className="hidden lg:block w-72 xl:w-80 shrink-0">
          <ForensicSidebar />
        </div>
      </div>
      <RecentActivity />
    </div>
  )
}
