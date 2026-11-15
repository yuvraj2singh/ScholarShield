import { Shield, Download, AlertCircle } from 'lucide-react'

export default function RegistryHero() {
  return (
    <div className="mb-5">
      {/* Verification standard banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
        <AlertCircle size={15} className="text-blue-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-blue-900">Verification Standard HESPP-2025</span>
          <span className="text-xs text-blue-700 ml-2">IRS 990-PF Cross-Validated</span>
          <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
            Legitimate providers never demand upfront processing fees, ACH routing numbers, or SSNs prior to formal committee adjudication. Listings flagged with a composite risk index over <strong>87/100</strong> are automatically broadcast to partnering university financial aid offices.
          </p>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <div className="text-[10px] text-blue-600 font-medium">Clearinghouse Sign-off</div>
          <div className="text-xs font-bold text-blue-900">Dr. Ellen Vance, MLS</div>
        </div>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded uppercase tracking-wide">Registry Clearance</span>
            <span className="text-[10px] text-gray-500">· VER: 14</span>
            <span className="flex items-center gap-1 text-[10px] text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              Live Sync: node 594
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
            Public Scholarship Verification<br className="hidden sm:block" /> Registry
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            ScholarGuard autonomously parses educational grant awards, endowment announcements, and sponsored stipends across 18,000+ public domains. Every record is triaged against IRS 501(c)(3) tax filings, official university registrar domains (edu WHOIS lineage), and federal consumer fraud indices to preempt predatory fee extraction and identity harvesting.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Shield size={13} strokeWidth={2.5} />
            Request Expedited Audit
          </button>
          <button className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium px-3 py-2.5 rounded-lg transition-colors bg-white">
            <Download size={12} />
            Export Registry CSV
          </button>
        </div>
      </div>
    </div>
  )
}
