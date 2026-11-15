import { Clock, Shield, Flag, Phone } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    step: 'Step 1 — Immediate',
    title: 'Automated Sandbox Crawl',
    desc: 'Our distributed crawler begins WHOIS lineage, domain age, and similarity analysis within 2 hours.',
    icon: Clock,
  },
  {
    step: 'Step 2 — 24 Hours',
    title: 'Analyst Forensic Audit',
    desc: 'An analyst cross-checks IRS 990 filings, physical maildrop records, and payment processor signatures.',
    icon: Shield,
  },
  {
    step: 'Step 3 — 48 Hours',
    title: 'Registry Blacklist & FTC Alert',
    desc: 'If confirmed fraudulent, the listing is blacklisted across the clearinghouse and broadcast to financial aid offices.',
    icon: Flag,
  },
]

export default function ReportSidebar() {
  return (
    <div className="space-y-6">
      {/* Clearinghouse assurance banner */}
      <div className="bg-blue-700 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <Shield size={20} className="text-blue-200" />
          <div className="text-base font-bold">Verified Clearinghouse</div>
        </div>
        <div className="text-sm text-blue-100 leading-relaxed">
          All reports are treated as formal academic fraud disclosures and processed through our 6-pillar forensic pipeline.
        </div>
      </div>

      {/* What happens after */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="text-base font-bold text-gray-900 mb-4">What Happens After You Report?</div>
        <div className="space-y-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 font-bold">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-0.5">{s.step}</div>
                  <div className="text-sm font-bold text-gray-900 mb-1">{s.title}</div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Direct assistance */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="text-base font-bold text-gray-900 mb-2">Need Direct Counseling?</div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If you or a student has already submitted banking or identity information to a suspect website:
        </p>
        <div className="space-y-2 text-sm text-gray-700 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-bold">1.</span>
            <span>Contact your bank to freeze transactions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-bold">2.</span>
            <span>Place a fraud alert on credit bureaus</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-bold">3.</span>
            <span>File an identity theft report at IdentityTheft.gov</span>
          </div>
        </div>
      </div>
    </div>
  )
}
