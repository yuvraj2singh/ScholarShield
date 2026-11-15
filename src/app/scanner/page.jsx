import { Suspense } from 'react'
import ScannerForm from '@/components/scanner/ScannerForm'
import DiagnosticBenchmark from '@/components/scanner/DiagnosticBenchmark'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Automated Forensic Scanner — ScholarGuard',
  description: 'Paste any scholarship URL, email solicitation, or application portal to instantly analyze domain pedigree, illicit payment demands, and mirrored content.',
}

export default function ScannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase tracking-wide">HESPP-26 Protocol</span>
          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded uppercase tracking-wide">Diagnostic Threat: Active</span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wide">Live Threat Matrix: Active</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
          Automated Forensic Scanner for<br className="hidden sm:block" /> Scholarships
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Paste any scholarship URL, email solicitation, or application portal to instantly analyze domain pedigree, illicit payment demands, and mirrored content against our federal repository.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="font-mono font-semibold text-gray-800">1,409,218 Hashes Indexed</span>
          <span className="text-gray-300">·</span>
          <span>DATABASE SIGNATURES</span>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 text-center">
          <Loader2 size={28} className="animate-spin text-blue-600 mx-auto mb-3" />
          <div className="text-sm text-gray-500">Loading scanner…</div>
        </div>
      }>
        <ScannerForm />
      </Suspense>

      <div className="mt-8">
        <DiagnosticBenchmark />
      </div>
    </div>
  )
}
