import { Shield, Download, AlertCircle } from 'lucide-react'

export default function RegistryHero() {
  return (
    <div className="mb-8">
      {/* Verification standard banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6">
        <AlertCircle size={20} className="text-blue-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold text-blue-900">Verification Standard HESPP-2025</span>
            <span className="text-sm text-blue-700">· IRS 990-PF Cross-Validated</span>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            Legitimate providers never demand upfront processing fees, ACH routing numbers, or SSNs prior to formal committee adjudication. Listings flagged with a composite risk index over <strong>87/100</strong> are automatically broadcast to partnering university financial aid offices.
          </p>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <div className="text-xs text-blue-600 font-medium">Clearinghouse Sign-off</div>
          <div className="text-sm font-bold text-blue-900">Dr. Ellen Vance, MLS</div>
        </div>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            Public Scholarship Verification Registry
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            ScholarGuard autonomously parses educational grant awards, endowment announcements, and sponsored stipends across 18,000+ public domains. Every record is triaged against IRS 501(c)(3) tax filings, official university registrar domains (edu WHOIS lineage), and federal consumer fraud indices to preempt predatory fee extraction and identity harvesting.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <button className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm">
            <Shield size={16} strokeWidth={2.5} />
            <span>Request Expedited Audit</span>
          </button>
          <button className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-800 text-sm font-semibold px-4 py-3 rounded-xl transition-colors bg-white shadow-sm">
            <Download size={15} />
            <span>Export Registry CSV</span>
          </button>
        </div>
      </div>
    </div>
  )
}
