import ThreatsClient from '@/components/threats/ThreatsClient'

export const metadata = {
  title: 'Deceptive Scholarship Taxonomy & Pattern Intelligence — ScholarGuard',
  description: 'A deep-dive into 5 core classification of predatory scholarship schemes, pattern data, and the analytical tools ScholarGuard uses to flag and prosecute them.',
}

export default function ThreatsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wide">Intelligence Library</span>
          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wide">Updated Daily</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
          Deceptive Scholarship Taxonomy &amp; Pattern Intelligence
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          A deep-dive into 5 core classification of predatory scholarship schemes, pattern data, and the analytical tools ScholarGuard uses to flag and report them. Use this library to train students, counsel families, and equip financial aid offices.
        </p>
      </div>
      <ThreatsClient />
    </div>
  )
}
