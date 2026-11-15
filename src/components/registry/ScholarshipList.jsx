'use client'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, ExternalLink, ChevronRight, Flag, Eye } from 'lucide-react'
import { SCHOLARSHIPS, threatColor, cardBorder } from '@/lib/data'

function StatusBadge({ status }) {
  const labels = {
    VERIFIED:  'VERIFIED AUTHENTIC',
    SUSPICIOUS:'SUSPICIOUS / UNDER REVIEW',
    HIGH_RISK: 'HIGH RISK WARNING',
    FRAUD:     'CONFIRMED PHISHING / FRAUD',
    CAUTION:   'CAUTION ADVISED',
  }
  const icons = {
    VERIFIED:  <CheckCircle size={12} />,
    SUSPICIOUS:<Info size={12} />,
    HIGH_RISK: <AlertTriangle size={12} />,
    FRAUD:     <XCircle size={12} />,
    CAUTION:   <AlertTriangle size={12} />,
  }
  return (
    <span className={threatColor(status)}>
      {icons[status]} {labels[status]}
    </span>
  )
}

function ThreatBox({ n }) {
  const bg =
    n >= 80 ? 'bg-red-600' :
    n >= 60 ? 'bg-orange-500' :
    n >= 40 ? 'bg-yellow-500' :
    n >= 10 ? 'bg-blue-600' :
              'bg-blue-700'
  return (
    <div className="text-right shrink-0">
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Threat Index</div>
      <div className={`${bg} text-white text-xl font-extrabold w-12 h-12 rounded-xl flex items-center justify-center ml-auto tabular-nums shadow-sm`}>
        {n}
      </div>
    </div>
  )
}

function ScholarshipCard({ s }) {
  const isFraud     = s.status === 'FRAUD'
  const isHigh      = s.status === 'HIGH_RISK'
  const isVerified  = s.status === 'VERIFIED'
  const isSuspicious= s.status === 'SUSPICIOUS'

  const noteColor = isFraud      ? 'bg-red-100 text-red-700 border-red-200'
    : isHigh                     ? 'bg-orange-100 text-orange-700 border-orange-200'
    : isSuspicious               ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                 : 'bg-blue-50 text-blue-700 border-blue-100'

  return (
    <div className={`border rounded-2xl p-5 mb-4 transition-shadow hover:shadow-md ${cardBorder(s.status)}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <StatusBadge status={s.status} />
            <span className="text-xs text-gray-500 font-mono font-medium">{s.date} · Award: {s.award}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 leading-snug">{s.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 flex-wrap">
            <span className="font-semibold text-gray-800">{s.org}</span>
            <span className="text-gray-300">·</span>
            <a href={`https://${s.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-xs">
              {s.url} <ExternalLink size={11} />
            </a>
            {s.irs && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold border border-green-200">501(c)(3) IRS Compliant</span>
            )}
          </div>
          {s.notes && s.notes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {s.notes.map((n, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-md border font-medium ${noteColor}`}>{n}</span>
              ))}
            </div>
          )}
        </div>
        <ThreatBox n={s.threat} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          {isFraud && (
            <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-md">
              <Flag size={11} /> HOSTILE BLACKLIST
            </span>
          )}
          {isHigh && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md">
              <AlertTriangle size={11} /> ID HARVESTING
            </span>
          )}
          {s.domain && <span className="text-xs text-gray-500 font-mono">Domain: {s.domain}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/scanner?url=${encodeURIComponent(s.url)}`}
            className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span>Run Forensic Audit</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ScholarshipList({ filters }) {
  const [dbData, setDbData] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch live scholarships from Prisma MongoDB API
  useEffect(() => {
    let mounted = true
    async function fetchLive() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filters.q) params.set('q', filters.q)
        if (filters.status && filters.status !== 'all') params.set('status', filters.status)
        if (filters.risk && filters.risk !== 'all') params.set('risk', filters.risk)

        const res = await fetch(`/api/scholarships?${params.toString()}`)
        if (res.ok) {
          const json = await res.json()
          if (mounted && json.data && json.data.length > 0) {
            setDbData(json.data)
          }
        }
      } catch (err) {
        console.warn('Live scholarship fetch error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchLive()
    return () => { mounted = false }
  }, [filters.q, filters.status, filters.risk])

  const filtered = useMemo(() => {
    // If DB returned results, use them, otherwise filter mock
    const source = dbData.length > 0 ? dbData : SCHOLARSHIPS
    return source.filter(s => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        const m = s.name.toLowerCase().includes(q) ||
                  s.org.toLowerCase().includes(q) ||
                  s.url.toLowerCase().includes(q)
        if (!m) return false
      }
      if (filters.status && filters.status !== 'all') {
        if (s.status !== filters.status) return false
      }
      if (filters.risk && filters.risk !== 'all') {
        if (filters.risk === 'critical' && s.threat < 80) return false
        if (filters.risk === 'high'     && (s.threat < 60 || s.threat >= 80)) return false
        if (filters.risk === 'medium'   && (s.threat < 40 || s.threat >= 60)) return false
        if (filters.risk === 'low'      && s.threat >= 40) return false
      }
      if (filters.vectors && filters.vectors.length > 0) {
        // vector filtering
        const notesStr = (s.notes || []).join(' ').toLowerCase()
        const matchAny = filters.vectors.some(v => {
          if (v === 'Demands Application Fee' && (notesStr.includes('fee') || notesStr.includes('$'))) return true
          if (v === 'Lookalike Domain / Proxy' && (notesStr.includes('domain') || notesStr.includes('proxy') || notesStr.includes('vps'))) return true
          if (v === 'Copied Essay Prompt' && notesStr.includes('copied')) return true
          if (v === 'Artificial Scarcity / Timers' && (notesStr.includes('timer') || notesStr.includes('remaining') || notesStr.includes('allocations'))) return true
          return false
        })
        if (!matchAny) return false
      }
      return true
    })
  }, [dbData, filters])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">
          Showing <span className="text-blue-700">{filtered.length}</span> scholarship listings
        </h2>
        {loading && <span className="text-xs text-gray-400">Syncing with database…</span>}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 shadow-sm">
          <p className="text-base font-medium">No scholarships found matching your filters.</p>
          <p className="text-sm text-gray-400 mt-1">Try resetting the search terms or risk filters.</p>
        </div>
      ) : (
        filtered.map(s => <ScholarshipCard key={s.id} s={s} />)
      )}
    </div>
  )
}
