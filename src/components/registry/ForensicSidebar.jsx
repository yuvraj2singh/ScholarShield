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
    detail: 'Pre-activation payment requirement of $43 filed through a 4441 US payment processor prior to review.',
    type: 'caution',
  },
]

const CHECKLIST = [
  'Zero-fee: Never pay to apply — no processing, courier, or admin fees',
  'Direct disbursement to institution — not to you via Zelle, Venmo, or card',
  'Verifiable IRS 990 filing or .gov/.edu sponsor domain',
]

export default function ForensicSidebar() {
  return (
    <div className="space-y-4">
      {/* Active case */}
      <div className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-red-700 px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle size={13} className="text-red-200" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">Confirmed Phishing / Fraud</span>
        </div>
        <div className="p-4">
          <div className="text-xs font-bold text-gray-900 mb-0.5">National Merit Excellence Grant 2025</div>
          <div className="text-[11px] text-gray-500 mb-3">Calculated Threat Probability</div>

          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl font-bold text-red-600 tabular-nums leading-none">94%</div>
            <div className="flex-1">
              <div className="text-[10px] text-gray-500 mb-1">0% Low Risk · 50% Caution · 100% Critical</div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '94%' }} />
              </div>
              <div className="text-[10px] text-red-600 font-semibold mt-1">Critical Attack Signature</div>
            </div>
          </div>

          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Multi-Point Crawl Signals</div>
          <div className="space-y-2.5 mb-4">
            {SIGNALS.map((sig, i) => (
              <div key={i} className={`rounded-lg p-2.5 ${
                sig.type === 'critical' ? 'bg-red-50 border border-red-100' :
                sig.type === 'warning'  ? 'bg-orange-50 border border-orange-100' :
                                          'bg-amber-50 border border-amber-100'
              }`}>
                <div className={`text-[10px] font-bold mb-0.5 ${
                  sig.type === 'critical' ? 'text-red-700' :
                  sig.type === 'warning'  ? 'text-orange-700' :
                                            'text-amber-700'
                }`}>{sig.label}</div>
                <div className="text-[10px] text-gray-600 leading-relaxed">{sig.detail}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
            <div className="text-[10px] font-bold text-gray-700 mb-1">Compliance Officer Remark</div>
            <p className="text-[10px] text-gray-600 leading-relaxed italic">
              &ldquo;This listing exhibits all behavioral markers of an advance-fee scholarship scam targeting high school seniors in the STEM score window. Thirteen MO blacklists across all 400 participating ScholarGuard university-party domains.&rdquo;
            </p>
            <div className="text-[10px] text-gray-500 mt-1.5">Dr. Ellen Vance, MLS · Issued 14:22 EST</div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link href="/report" className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-colors">
              <Send size={10} /> Transmit FTC / IC3 Abuse Notice
            </Link>
            <button className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 text-[10px] font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Copy size={10} /> Copy Incident Audit Hash
            </button>
          </div>
        </div>
      </div>

      {/* 3-step checklist */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="text-xs font-bold text-gray-700 mb-3">3-Step Red Flag Checklist</div>
        <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
          Instruct your student to remember the <strong>Zero-Fee Cardinal Rule</strong>: Legitimate scholarships disburse money to you; they never solicit administrative fees, application insurance, or upfront taxes.
        </p>
        <div className="space-y-2">
          {CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
              <div className="text-[11px] text-gray-700 leading-relaxed">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
