import RegistryClient from '@/components/registry/RegistryClient'

export const metadata = {
  title: 'Database Registry — ScholarGuard',
  description: 'Full tabbed registry of verified, blacklisted, watchlist, and cleared scholarships.',
}

export default function RegistryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wide">Full Registry</span>
          <span className="text-[10px] text-gray-400 font-mono">54,820 total indexed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">Database Registry</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Complete tabbed registry of all scholarships indexed by ScholarGuard, organized by verification status. Use this to audit specific scholarships before advising students.
        </p>
      </div>
      <RegistryClient />
    </div>
  )
}
