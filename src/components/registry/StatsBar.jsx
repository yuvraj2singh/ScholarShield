import { CheckCircle, AlertTriangle, Globe, Lightbulb } from 'lucide-react'
import { STATS } from '@/lib/data'

function StatCard({ icon, value, label, sub, color }) {
  const colorMap = {
    green: 'border-l-green-500 bg-green-50',
    red: 'border-l-red-500 bg-red-50',
    orange: 'border-l-orange-500 bg-orange-50',
    blue: 'border-l-blue-500 bg-blue-50',
  }
  const textMap = {
    green: 'text-green-700',
    red: 'text-red-700',
    orange: 'text-orange-700',
    blue: 'text-blue-700',
  }
  return (
    <div className={`border border-gray-200 border-l-4 rounded-lg p-3 ${colorMap[color]}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className={`text-2xl font-bold leading-none tabular-nums ${textMap[color]}`}>{value.toLocaleString()}</div>
        <div className={`${textMap[color]} opacity-60`}>{icon}</div>
      </div>
      <div className="text-xs font-semibold text-gray-700">{label}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{sub}</div>
    </div>
  )
}

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <StatCard
        icon={<CheckCircle size={18} />}
        value={STATS.totalIndexed}
        label="Clean Lineage"
        sub="Zero application fees. Validated via direct registrar sync and IRS Form 990."
        color="green"
      />
      <StatCard
        icon={<AlertTriangle size={18} />}
        value={STATS.predatoryFees}
        label="Predatory Fees"
        sub={'Flagged for demanding 1–5% "filing or courier guarantee" prior to review.'}
        color="red"
      />
      <StatCard
        icon={<Globe size={18} />}
        value={STATS.typesquatDomains}
        label="Typosquat Domains"
        sub="Impersonating official entities via hyphenated TLDs (.org, .net, .info)."
        color="orange"
      />
      <StatCard
        icon={<Lightbulb size={18} />}
        value={STATS.counselorTips}
        label="Counselor Tips"
        sub="High school counselor submissions currently assigned to field investigation."
        color="blue"
      />
    </div>
  )
}
