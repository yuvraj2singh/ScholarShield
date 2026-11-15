'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
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
    VERIFIED:  <CheckCircle size={10} />,
    SUSPICIOUS:<Info size={10} />,
    HIGH_RISK: <AlertTriangle size={10} />,
    FRAUD:     <XCircle size={10} />,
    CAUTION:   <AlertTriangle size={10} />,
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
    n >= 10 ? 'bg-blue-500' :
              'bg-green-500'
  return (
    <div className="text-right shrink-0">
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-0.5">Threat Index</div>
      <div className={`${bg} text-white text-lg font-bold w-12 h-12 rounded-lg flex items-center justify-center ml-auto tabular-nums`}>
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
    <div className={`border rounded-xl p-4 mb-3 transition-shadow hover:shadow-md ${cardBorder(s.status)}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <StatusBadge status={s.status} />
            <span className="text-[10px] text-gray-400 font-mono">{s.date} · Award: {s.award}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{s.name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
            <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${isVerified ? 'bg-green-500' : isFraud ? 'bg-red-500' : 'bg-orange-400'}`} />
            <span className="font-medium text-gray-700">{s.org}</span>
            <span className="text-gray-300">·</span>
            <a href={`https://${s.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5 font-mono text-[11px]">
              {s.url} <ExternalLink size={9} />
            </a>
            {s.irs && (
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium border border-green-200">501(c)(3) IRS Compliant</span>
            )}
          </div>
          {s.notes && s.notes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {s.notes.map((n, i) => (
                <span key={i} className={`text-[10px] px-2 py-0.5 rounded border font-medium ${noteColor}`}>{n}</span>
              ))}
            </div>
          )}
        </div>
        <ThreatBox n={s.threat} />
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isFraud && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
              <Flag size={9} /> HOSTILE BLACKLIST
            </span>
          )}
          {isHigh && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded">
              <AlertTriangle size={9} /> ID HARVESTING
            </span>
          )}
          {s.domain && <span className="text-[10px] text-gray-400 font-mono">Domain: {s.domain}</span>}
        </div>
        <Link
          href={`/scanner?url=${encodeURIComponent(s.url)}`}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <Eye size={12} />
          {isFraud ? 'View Forensic Audit' : 'Inspect Lineage'}
          <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  )
}

function EmptyState({ filters }) {
  return (
    <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
      <div className="text-4xl mb-3">🔍</div>
      <div className="text-sm font-semibold text-gray-700 mb-1">No scholarships match your filters</div>
      <div className="text-xs text-gray-400">Try adjusting your search query, status filter, or risk score range.</div>
    </div>
  )
}

const RISK_RANGES = {
  critical: [80, 100],
  high:     [60, 79],
  medium:   [40, 59],
  low:      [0, 39],
}

export default function ScholarshipList({ filters = {} }) {
  const { q = '', status = 'all', risk = 'all' } = filters
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

  const filtered = useMemo(() => {
    return SCHOLARSHIPS.filter(s => {
      // Text search
      if (q) {
        const lq = q.toLowerCase()
        if (
          !s.name.toLowerCase().includes(lq) &&
          !s.org.toLowerCase().includes(lq) &&
          !s.url.toLowerCase().includes(lq)
        ) return false
      }
      // Status filter
      if (status !== 'all' && s.status !== status) return false
      // Risk score filter
      if (risk !== 'all') {
        const [min, max] = RISK_RANGES[risk] || [0, 100]
        if (s.threat < min || s.threat > max) return false
      }
      return true
    })
  }, [q, status, risk])

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  function goPage(p) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  // Build page number buttons (max 5 shown)
  function pageButtons() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (safePage <= 3) return [1, 2, 3, 4, '…', totalPages]
    if (safePage >= totalPages - 2) return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', safePage - 1, safePage, safePage + 1, '…', totalPages]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-900">{pageItems.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{filtered.length}</span> results
          {filtered.length !== SCHOLARSHIPS.length && (
            <span className="text-gray-400"> (filtered from {SCHOLARSHIPS.length})</span>
          )}
        </div>
        <select
          value={perPage}
          onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
          className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white focus:outline-none"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={SCHOLARSHIPS.length}>All results</option>
        </select>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState filters={filters} />
      ) : (
        pageItems.map(s => <ScholarshipCard key={s.id} s={s} />)
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Page {safePage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goPage(safePage - 1)}
              disabled={safePage === 1}
              className="text-xs px-2 h-7 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              ‹
            </button>
            {pageButtons().map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && goPage(p)}
                disabled={p === '…'}
                className={`min-w-[28px] h-7 text-xs flex items-center justify-center rounded border transition-colors ${
                  p === safePage
                    ? 'bg-blue-700 text-white border-blue-700'
                    : p === '…'
                    ? 'border-transparent text-gray-400 cursor-default'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="text-xs px-2 h-7 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
