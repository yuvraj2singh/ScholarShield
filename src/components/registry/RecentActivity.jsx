'use client'
import Link from 'next/link'
import { ShieldCheck, AlertTriangle, ArrowRight, Activity } from 'lucide-react'

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
    <div className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Activity size={18} className="text-blue-700" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Live Forensic Activity &amp; Takedowns</h3>
        </div>
        <Link
          href="/threats"
          className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 group"
        >
          <span>Taxonomy &amp; Trends</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {RECENT_FEED.map(item => {
          const isCritical = item.risk === 'critical'
          const isClean    = item.risk === 'clean'
          const badgeClass = isCritical
            ? 'bg-red-50 text-red-700 border-red-200'
            : isClean
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-yellow-50 text-yellow-800 border-yellow-200'

          return (
            <div
              key={item.id}
              className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-4 flex flex-col justify-between hover:border-gray-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <div className="font-bold text-sm text-gray-900 mb-1.5 leading-snug break-words">
                  {item.title}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                  {item.detail}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>{item.id}</span>
                {isCritical ? (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <AlertTriangle size={12} /> Blacklisted
                  </span>
                ) : (
                  <span className="text-blue-700 font-semibold flex items-center gap-1">
                    <ShieldCheck size={12} /> Passed
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
