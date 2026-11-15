import { CheckCircle, XCircle } from 'lucide-react'

const LEGIT = [
  'Funds are disbursed directly to institutional bursary, not personal bank apps',
  'Rewards are disbursed directly to institutional bursary, not personal apps',
  'Featured donor identified with verifiable IRS 990 or US Form 990-PF filing',
  'Explicit eligibility criterion, evaluation metrics, and independent selection panels',
]

const PREDATORY = [
  'Claims "Guaranteed academic scholarship reserves"',
  'Requires credit card, banking, or bank routing numbers under the guise of "verification"',
  'Generic domain extensions (.biz, .info, .net) with new sites opened before applications',
  'Direct contact conducted via purely automated Telegram, SMS or disposable webforms',
]

export default function DiagnosticBenchmark() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wide">Federal Standard HESPP-24</span>
      </div>
      <h2 className="text-base font-bold text-gray-900 mb-1">Diagnostic Benchmark: Legitimacy Markers</h2>
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        How ScholarGuard agents use predatory heuristics and institutional endowments to flag an advance-fee syndicate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-bold text-green-700 mb-3 flex items-center gap-1.5">
            <CheckCircle size={13} /> Legitimate Academic Endowments
          </div>
          <div className="space-y-2.5">
            {LEGIT.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-red-700 mb-3 flex items-center gap-1.5">
            <XCircle size={13} /> Predatory Scam Characteristics
          </div>
          <div className="space-y-2.5">
            {PREDATORY.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <XCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
