import { AlertTriangle, Send, Copy } from 'lucide-react'
import Link from 'next/link'

const SIGNALS = [
  {
    label: 'WHOIS Registration 8 Days',
    detail: 'Domain registered through anonymous privacy shield, hammers ties to 23 decor-recovered gift card and phishing operations.',
    type: 'critical',
  },
  {
    label: 'NLP Proxy Similarity: 99% Duplicate',
    detail: 'Application premium is verbatim lifted from the "Rotary Youth Leadership Award 2017" archived catalog, remapped with false branding.',
    type: 'warning',
  },
  {
    label: 'Mandatory Upfront Fee Detected',
    detail: 'Pre-activation payment requirement of $43 filed through a US payment processor prior to review.',
    type: 'caution',
  },
]

const CHECKLIST = [
  'Zero-fee standard: Never pay to apply — no processing, courier, or admin fees',
  'Direct disbursement to institution — not to personal cash apps or gift cards',
  'Verifiable IRS 990 filing or .gov/.edu sponsor domain',
]

export default function ForensicSidebar() {
  return (
    <div className="space-y-5">
      {/* Active case */}
      <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-red-700 px-5 py-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Confirmed Phishing / Fraud</span>
        </div>
        <div className="p-5">
          <div className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-snug">
            National Merit Excellence Grant 2025
          </div>
          <div className="text-xs text-gray-500 mb-4">Calculated Threat Probability</div>

          <div className="flex items-center gap-4 mb-5">
            <div className="text-4xl sm:text-5xl font-extrabold text-red-600 tabular-nums leading-none">94%</div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1.5">Threat Index: 94/100</div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '94%' }} />
              </div>
              <div className="text-xs text-red-600 font-semibold mt-1.5">Critical Attack Signature</div>
            </div>
          </div>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
            Multi-Point Crawl Signals
          </div>
          <div className="space-y-3 mb-5">
            {SIGNALS.map((sig, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 ${
                  sig.type === 'critical' ? 'bg-red-50 border border-red-100' :
                  sig.type === 'warning'  ? 'bg-orange-50 border border-orange-100' :
                                            'bg-amber-50 border border-amber-100'
                }`}
              >
                <div className="text-xs font-bold text-gray-900 mb-1">{sig.label}</div>
                <div className="text-xs text-gray-700 leading-relaxed">{sig.detail}</div>
              </div>
            ))}
          </div>

          <Link
            href="/scanner?url=national-meritscholars-portal.org"
            className="w-full inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            <span>View Complete Case File</span>
          </Link>
        </div>
      </div>

      {/* Safety checklist card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Student Protection Standards</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          The 3 golden rules every college applicant should verify before sharing identity or financial information:
        </p>
        <ul className="space-y-3">
          {CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <span className="font-bold text-blue-700">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
