import { CheckCircle, XCircle } from 'lucide-react'

const LEGIT = [
  'Funds are disbursed directly to institutional bursary, not personal bank apps',
  'Rewards are disbursed directly to institutional bursary, not personal cash apps',
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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Diagnostic Benchmark: Legitimacy Markers</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
        How ScholarShield agents use predatory heuristics and institutional endowments to flag an advance-fee syndicate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-sm font-bold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle size={16} /> Legitimate Academic Endowments
          </div>
          <div className="space-y-3">
            {LEGIT.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle size={15} className="text-green-600 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-red-700 mb-4 flex items-center gap-2">
            <XCircle size={16} /> Predatory Scam Characteristics
          </div>
          <div className="space-y-3">
            {PREDATORY.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <XCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
