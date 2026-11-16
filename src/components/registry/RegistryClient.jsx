'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, ExternalLink, CheckCircle, XCircle, AlertTriangle, Download, Eye, Flag } from 'lucide-react'
import { SCHOLARSHIPS, threatIndexColor, threatColor } from '@/lib/data'

const TABS = ['All Active', 'Verified Legitimate', 'Under Review', 'Confirmed Fraud', 'Watchlist']

export default function RegistryClient() {
  const [tab, setTab]       = useState('All Active')
  const [q, setQ]           = useState('')
  const [toast, setToast]   = useState(null)
  const [items, setItems]   = useState(SCHOLARSHIPS)

  // Fetch live scholarships from Prisma MongoDB API
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/scholarships?limit=50')
        if (res.ok) {
          const json = await res.json()
          if (mounted && json.data && json.data.length > 0) {
            setItems(json.data)
          }
        }
      } catch (err) {
        console.warn('Live registry sync skipped:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = useMemo(() => {
    return items.filter(s => {
      // Tab filter
      if (tab === 'Verified Legitimate' && s.status !== 'VERIFIED') return false
      if (tab === 'Under Review'        && s.status !== 'SUSPICIOUS' && s.status !== 'CAUTION') return false
      if (tab === 'Confirmed Fraud'     && s.status !== 'FRAUD') return false
      if (tab === 'Watchlist'           && s.status !== 'HIGH_RISK') return false

      // Search filter
      if (q.trim()) {
        const term = q.toLowerCase()
        return (
          s.name.toLowerCase().includes(term) ||
          s.org.toLowerCase().includes(term) ||
          s.url.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [tab, q, items])

  function tabCount(t) {
    if (t === 'All Active') return items.length
    if (t === 'Verified Legitimate') return items.filter(s => s.status === 'VERIFIED').length
    if (t === 'Under Review')        return items.filter(s => s.status === 'SUSPICIOUS' || s.status === 'CAUTION').length
    if (t === 'Confirmed Fraud')     return items.filter(s => s.status === 'FRAUD').length
    if (t === 'Watchlist')           return items.filter(s => s.status === 'HIGH_RISK').length
    return 0
  }

  function handleExport() {
    const headers = ['ID', 'Scholarship Name', 'Organization', 'URL', 'Award', 'Status', 'Threat Index', 'IRS 990', 'Date']
    const rows = filtered.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.org.replace(/"/g, '""')}"`,
      s.url,
      `"${s.award}"`,
      s.status,
      s.threat,
      s.irs ? 'Yes' : 'No',
      s.date,
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `scholarshield-registry-${tab.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`
    link.click()
    showToast(`Exported ${filtered.length} records to CSV`)
  }

  async function handleFlag(s) {
    showToast(`Flag submitted for "${s.name}". Incident queued.`, 'warning')
    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipName: s.name,
          orgName: s.org,
          url: s.url,
          channel: 'Public Registry User Flag',
          indicators: ['Community Flagged via Registry'],
          submitterRole: 'Student / User',
          anonymous: true,
        }),
      })
    } catch (e) {
      console.warn('Flag API error:', e)
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold fade-in ${
          toast.type === 'warning' ? 'bg-orange-600 text-white' : 'bg-blue-700 text-white'
        }`}>
          {toast.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Tabs + actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-xl flex-wrap">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setQ('') }}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t}
              <span className="ml-2 text-xs font-normal text-gray-400">({tabCount(t)})</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors bg-white shadow-sm"
        >
          <Download size={15} />
          <span>Export CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search registry by scholarship title, foundation entity, or domain…"
          className="w-full pl-11 pr-10 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 shadow-sm"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      {q && (
        <div className="text-sm text-gray-600 mb-4">
          Showing <span className="font-bold text-gray-900">{filtered.length}</span> results for <span className="font-semibold text-blue-700">&ldquo;{q}&rdquo;</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Scholarship / Organization', 'Domain', 'Award', 'Threat Index', 'Status', 'IRS 990', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-400 text-base">
                    No records match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-gray-50/80 transition-colors ${i % 2 !== 0 ? 'bg-gray-50/40' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 leading-snug max-w-[240px]">{s.name}</div>
                      <div className="text-gray-500 text-xs mt-1 truncate max-w-[240px]">{s.org}</div>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`https://${s.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono flex items-center gap-1 whitespace-nowrap text-xs"
                      >
                        {s.url.length > 28 ? s.url.slice(0, 28) + '…' : s.url}
                        <ExternalLink size={11} />
                      </a>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{s.award}</td>
                    <td className="px-5 py-4">
                      <div className={`${threatIndexColor(s.threat)} text-white text-xs font-bold w-10 h-10 rounded-xl flex items-center justify-center tabular-nums shadow-sm`}>
                        {s.threat}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`${threatColor(s.status)} whitespace-nowrap`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {s.irs ? (
                        <span className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs">
                          <CheckCircle size={14} /> Filed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-500 font-semibold text-xs">
                          <XCircle size={14} /> None
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">{s.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/scanner?url=${encodeURIComponent(s.url)}`}
                          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold transition-colors"
                        >
                          <Eye size={13} /> Inspect
                        </Link>
                        {s.status !== 'VERIFIED' && (
                          <>
                            <span className="text-gray-200">|</span>
                            <button
                              onClick={() => handleFlag(s)}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-bold transition-colors"
                            >
                              <Flag size={12} /> Flag
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <span>{filtered.length} record{filtered.length !== 1 ? 's' : ''} in view</span>
            <span>ScholarShield Registry · Continuous Sync</span>
          </div>
        )}
      </div>
    </div>
  )
}
