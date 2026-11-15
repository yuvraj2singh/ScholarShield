'use client'
import { Search, X, SlidersHorizontal } from 'lucide-react'

const VECTORS = [
  'Demands Application Fee',
  'Lookalike Domain / Proxy',
  'Copied Essay Prompt',
  'Artificial Scarcity / Timers',
]

export default function SearchToolbar({ filters, setFilters }) {
  const { q, status, risk, vectors } = filters

  function update(key, val) {
    setFilters(prev => ({ ...prev, [key]: val }))
  }

  function toggleVector(v) {
    setFilters(prev => ({
      ...prev,
      vectors: prev.vectors.includes(v)
        ? prev.vectors.filter(x => x !== v)
        : [...prev.vectors, v],
    }))
  }

  function reset() {
    setFilters({ q: '', status: 'all', risk: 'all', vectors: [] })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">
      {/* Main search row */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={e => update('q', e.target.value)}
            placeholder="Search by title, foundation entity, or domain (e.g. 'gatesfoundation.org')"
            className="w-full pl-11 pr-10 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
          />
          {q && (
            <button onClick={() => update('q', '')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={status}
          onChange={e => update('status', e.target.value)}
          className="text-sm font-medium border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
        >
          <option value="all">Verification Status: All</option>
          <option value="VERIFIED">Verified Authentic</option>
          <option value="FRAUD">Confirmed Fraud</option>
          <option value="HIGH_RISK">High Risk</option>
          <option value="SUSPICIOUS">Suspicious</option>
        </select>

        <select
          value={risk}
          onChange={e => update('risk', e.target.value)}
          className="text-sm font-medium border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
        >
          <option value="all">ScholarGuard Risk Score: All</option>
          <option value="critical">Critical (80–100)</option>
          <option value="high">High (60–79)</option>
          <option value="medium">Medium (40–59)</option>
          <option value="low">Low / Verified (0–39)</option>
        </select>

        {(q || status !== 'all' || risk !== 'all' || vectors.length > 0) && (
          <button
            onClick={reset}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-3 border border-gray-200 hover:border-gray-300 rounded-xl transition-colors bg-gray-50 hover:bg-gray-100"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Vector filters */}
      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mr-1">
          <SlidersHorizontal size={13} />
          <span>Vector Triage:</span>
        </span>
        {VECTORS.map(v => {
          const active = vectors.includes(v)
          return (
            <button
              key={v}
              onClick={() => toggleVector(v)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                active
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              {active ? '✓ ' : '+ '}{v}
            </button>
          )
        })}
      </div>
    </div>
  )
}
