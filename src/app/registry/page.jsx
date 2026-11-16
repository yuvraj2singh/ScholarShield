import RegistryClient from '@/components/registry/RegistryClient'

export const metadata = {
  title: 'Database Registry — ScholarShield',
  description: 'Full tabbed registry of verified, blacklisted, watchlist, and cleared scholarships.',
}

export default function RegistryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Database Registry
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          Complete tabbed registry of all scholarships indexed by ScholarShield, organized by verification status. Use this to audit specific scholarships before advising students.
        </p>
      </div>
      <RegistryClient />
    </div>
  )
}
