import { Suspense } from 'react'
import ScannerForm from '@/components/scanner/ScannerForm'
import DiagnosticBenchmark from '@/components/scanner/DiagnosticBenchmark'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Automated Forensic Scanner — ScholarShield',
  description: 'Paste any scholarship URL, email solicitation, or application portal to instantly analyze domain pedigree, illicit payment demands, and mirrored content.',
}

export default function ScannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Automated Forensic Scanner for Scholarships
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          Paste any scholarship URL, email solicitation, or application portal to instantly analyze domain pedigree, illicit payment demands, and mirrored content against our federal repository.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="font-mono font-semibold text-gray-800">1,409,218 Hashes Indexed</span>
          <span className="text-gray-300">·</span>
          <span>DATABASE SIGNATURES</span>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
          <div className="text-base text-gray-500">Loading scanner…</div>
        </div>
      }>
        <ScannerForm />
      </Suspense>

      <div className="mt-10">
        <DiagnosticBenchmark />
      </div>
    </div>
  )
}
