import { Clock, Shield, Flag, Phone } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    step: 'Step 1 — Immediate',
    title: 'Automated Sandbox Crawl',
    desc: 'Our distributed crawler begins the final hard-coded WHOIS and similarity analysis within 2 hours. The system automatically references all existing evidence.',
    icon: Clock,
  },
  {
    step: 'Step 2 — 24 Hours',
    title: 'Analyst Forensic Audit',
    desc: 'An analyst cross-checks preliminary claims, compares filings, and verifies physical address claims with state registrars.',
    icon: Shield,
  },
  {
    step: 'Step 3 — 48 Hours',
    title: 'Registry Blacklist & FTC Alert',
    desc: 'If confirmed, we add to the cross-channel directory, update the ScholarGuard watchlist, and alert the financial aid office.',
    icon: Flag,
  },
]

const TAKEDOWNS = [
  {
    domain: 'scholarship-national.com',
    time: '2 hrs ago',
    detail: 'Takedown: Application Fee ($35)',
  },
  {
    domain: 'fafsa-grant-fastclaims.org',
    time: '4 hrs ago',
    detail: 'Juniper: including impersonation of National Scholarship Trust; 97 archived catalog...',
  },
  {
    domain: 'meritaward-certificates.net',
    time: '1 day ago',
    detail: 'Archive: Special Security number extraction from $43 filed; 19,000+ directory to multiple reports',
  },
]

export default function ReportSidebar() {
  return (
    <div className="space-y-4">
      {/* Accredited clearinghouse badge */}
      <div className="bg-blue-700 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-blue-200" />
          <div className="text-xs font-bold">Accredited Clearinghouse</div>
        </div>
        <div className="text-[11px] text-blue-200 leading-relaxed">
          AAPA Endorsed · 206,841 Enc. Nominated<br />
          All reports treated as official fraud disclosures.
        </div>
      </div>

      {/* What happens after */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="text-xs font-bold text-gray-900 mb-3">What Happens After You Report?</div>
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={11} className="text-blue-700" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">{s.step}</div>
                  <div className="text-xs font-semibold text-gray-800">{s.title}</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent takedowns */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-gray-900">Recent Takedowns</div>
          <span className="text-[10px] text-green-600 font-semibold">+1,100</span>
        </div>
        <div className="space-y-2.5">
          {TAKEDOWNS.map((t, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0 pb-2.5 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="font-mono text-[10px] text-blue-700 break-all">{t.domain}</div>
                <div className="text-[10px] text-gray-400 shrink-0">{t.time}</div>
              </div>
              <div className="text-[10px] text-gray-500 leading-snug mt-0.5">{t.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate assistance */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
          <Phone size={12} className="text-amber-700" />
          Immediate Assistance
        </div>
        <p className="text-[10px] text-amber-800 leading-relaxed mb-2">
          If you or a student is currently facing a live fraud attempt, contact law enforcement directly:
        </p>
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-amber-900">Federal Student Aid — 1-800-4-FED-AID</div>
          <Link
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-700 hover:underline block font-medium"
          >
            FTC Fraud Reporting Portal: reportfraud.ftc.gov →
          </Link>
        </div>
      </div>
    </div>
  )
}
