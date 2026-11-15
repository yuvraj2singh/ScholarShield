'use client'
import Link from 'next/link'
import { ShieldCheck, AlertTriangle, ArrowRight, Radio } from 'lucide-react'

const RECENT_FEED = [
  {
    id: 'ACT-901',
    type: 'TAKEDOWN',
    title: 'national-merit-scholarships-portal.org',
    detail: 'Domain blacklisted via IC3/FTC fraud alert after $45 processing fee extraction detected.',
    time: '4 mins ago',
    badge: 'Registry Blacklist',
    risk: 'critical',
  },
  {
    id: 'ACT-902',
    type: 'VERIFIED',
    title: 'Coca-Cola Scholars Foundation',
    detail: '501(c)(3) tax status re-validated against IRS Form 990-PF filings (Zero Fee Standard).',
    time: '18 mins ago',
    badge: 'Gold Standard',
    risk: 'clean',
  },
  {
    id: 'ACT-903',
    type: 'TAKEDOWN',
    title: 'apex-stem-awards.cc',
    detail: 'Host registrar suspended bulletproof server for harvesting applicant direct deposit PINs.',
    time: '42 mins ago',
    badge: 'Host Suspended',
    risk: 'critical',
  },
  {
    id: 'ACT-904',
    type: 'INVESTIGATION',
    title: 'Ivy League Diversity Fellowship 2025',
    detail: 'Case escalated to federal working group; artificial scarcity timer (14m) flagged.',
    time: '1 hr ago',
    badge: 'Under Review',
    risk: 'caution',
  },
]

export default function RecentActivity() {
  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Live Forensic Activity & Takedowns</h3>
        </div>
        <Link
          href="/threats"
          className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 group"
        >
          <span>Taxonomy & Trends</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {RECENT_FEED.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-xs transition-all flex items-start gap-3"
          >
            <div className="mt-0.5 shrink-0">
              {item.risk === 'critical' ? (
                <div className="w-6 h-6 rounded-md bg-red-100 text-red-700 flex items-center justify-center">
                  <AlertTriangle size={13} />
                </div>
              ) : item.risk === 'clean' ? (
                <div className="w-6 h-6 rounded-md bg-green-100 text-green-700 flex items-center justify-center">
                  <ShieldCheck size={13} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Radio size={13} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-gray-900 truncate font-mono">
                  {item.title}
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed mb-2 line-clamp-2">
                {item.detail}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.risk === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : item.risk === 'clean'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.badge}
                </span>
                {item.risk === 'critical' && (
                  <Link
                    href={`/scanner?url=${encodeURIComponent('https://' + item.title)}`}
                    className="text-[10px] text-blue-600 hover:underline font-medium"
                  >
                    Inspect Scan →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

