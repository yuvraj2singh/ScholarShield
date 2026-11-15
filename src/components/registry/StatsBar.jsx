import { CheckCircle, AlertTriangle, Globe, Lightbulb } from 'lucide-react'
import { STATS } from '@/lib/data'

function StatCard({ icon, value, label, sub, color }) {
  const colorMap = {
    green: 'border-l-blue-600 bg-blue-50/60',
    red: 'border-l-red-500 bg-red-50/60',
    orange: 'border-l-orange-500 bg-orange-50/60',
    blue: 'border-l-indigo-600 bg-indigo-50/60',
  }
  const textMap = {
    green: 'text-blue-800',
    red: 'text-red-700',
    orange: 'text-orange-700',
    blue: 'text-indigo-800',
  }
  return (
    <div className={`border border-gray-200 border-l-4 rounded-xl p-5 ${colorMap[color]} shadow-sm`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className={`text-3xl sm:text-4xl font-extrabold leading-none tabular-nums ${textMap[color]}`}>
          {value.toLocaleString()}
        </div>
        <div className={`${textMap[color]} opacity-70`}>{icon}</div>
      </div>
      <div className="text-sm sm:text-base font-bold text-gray-900 mb-1">{label}</div>
      <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">{sub}</div>
    </div>
  )
}

export default function StatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<CheckCircle size={22} />}
        value={STATS.totalIndexed}
        label="Clean Lineage"
        sub="Zero application fees. Validated via direct registrar sync and IRS Form 990."
        color="green"
      />
      <StatCard
        icon={<AlertTriangle size={22} />}
        value={STATS.predatoryFees}
        label="Predatory Fees"
        sub={'Flagged for demanding 1–5% "filing or courier guarantee" prior to review.'}
        color="red"
      />
      <StatCard
        icon={<Globe size={22} />}
        value={STATS.typesquatDomains}
        label="Typosquat Domains"
        sub="Impersonating official entities via hyphenated TLDs (.org, .net, .info)."
        color="orange"
      />
      <StatCard
        icon={<Lightbulb size={22} />}
        value={STATS.counselorTips}
        label="Counselor Tips"
        sub="High school counselor submissions currently assigned to field investigation."
        color="blue"
      />
    </div>
  )
}
