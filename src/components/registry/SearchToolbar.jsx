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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-5">
      {/* Main search row */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={e => update('q', e.target.value)}
            placeholder="Search by scholarship title, foundation entity, or suspect domain (e.g. 'gates-edu.org')"
            className="w-full pl-9 pr-8 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
          />
          {q && (
            <button onClick={() => update('q', '')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          )}
        </div>

        <select
          value={status}
          onChange={e => update('status', e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
          className="text-xs border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">ScholarGuard Risk Score: All</option>
          <option value="critical">Critical (80–100)</option>
          <option value="high">High (60–79)</option>
          <option value="medium">Medium (40–59)</option>
          <option value="low">Low (0–39)</option>
        </select>

        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-600 text-xs font-medium px-3 py-2.5 rounded-lg transition-colors bg-white whitespace-nowrap"
        >
          <SlidersHorizontal size={12} />
          Reset Filters
        </button>
      </div>

      {/* Vector filter chips */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Vector Filter:</span>
        {VECTORS.map(v => (
          <button
            key={v}
            onClick={() => toggleVector(v)}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
              vectors.includes(v)
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
