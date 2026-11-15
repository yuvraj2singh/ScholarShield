'use client'
import { useState, useMemo, useEffect } from 'react'
import { Download, ExternalLink, Flag, Search, ChevronDown, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react'
import Link from 'next/link'
import { SCHOLARSHIPS, threatIndexColor, threatColor } from '@/lib/data'

const TABS = ['All Records', 'Blacklisted', 'Watchlist', 'Cleared']

function exportCSV(data) {
  const headers = ['ID', 'Name', 'Organization', 'URL', 'Award', 'Status', 'Threat Index', 'IRS 990', 'Domain Age', 'Date']
  const rows = data.map(s => [
    s.id, `"${s.name}"`, `"${s.org}"`, s.url, s.award, s.status, s.threat, s.irs ? 'Yes' : 'No', `"${s.domain}"`, s.date
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `scholarguard-registry-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function RegistryClient() {
  const [tab, setTab]         = useState('All Records')
  const [q, setQ]             = useState('')
  const [toast, setToast]     = useState(null)
  const [records, setRecords] = useState(SCHOLARSHIPS)

  useEffect(() => {
    fetch('/api/scholarships?limit=50')
      .then(res => res.ok ? res.json() : null)
      .then(res => {
        if (res?.data?.length > 0) {
          setRecords(res.data.map(s => ({
            id: s.id,
            name: s.name,
            org: s.org,
            url: s.url,
            award: s.award,
            status: s.status,
            threat: s.threatIndex ?? s.threat ?? 0,
            irs: s.irsCompliant ?? s.irs ?? false,
            domain: s.domain || 'Verified',
            date: s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : (s.date || '2025-02-20'),
            notes: s.notes || [],
          })))
        }
      })
      .catch(() => {})
  }, [])

  function tabCount(t) {
    if (t === 'Blacklisted') return records.filter(s => s.status === 'FRAUD').length
    if (t === 'Watchlist')   return records.filter(s => s.status === 'HIGH_RISK' || s.status === 'SUSPICIOUS').length
    if (t === 'Cleared')     return records.filter(s => s.status === 'VERIFIED').length
    return records.length
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = useMemo(() => {
    let data = records
    if (tab === 'Blacklisted') data = data.filter(s => s.status === 'FRAUD')
    if (tab === 'Watchlist')   data = data.filter(s => s.status === 'HIGH_RISK' || s.status === 'SUSPICIOUS')
    if (tab === 'Cleared')     data = data.filter(s => s.status === 'VERIFIED')
    if (q) {
      const lq = q.toLowerCase()
      data = data.filter(s =>
        s.name.toLowerCase().includes(lq) ||
        s.org.toLowerCase().includes(lq) ||
        s.url.toLowerCase().includes(lq)
      )
    }
    return data
  }, [tab, q, records])

  function handleExport() {
    exportCSV(filtered)
    showToast(`Exported ${filtered.length} records as CSV`)
  }

  async function handleFlag(s) {
    showToast(`Flagged "${s.name}" for analyst review`, 'warning')
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
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium fade-in ${
          toast.type === 'warning' ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.type === 'warning' ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Tabs + actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg flex-wrap">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setQ('') }}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t}
              <span className="ml-1.5 text-[10px] font-normal text-gray-400">{tabCount(t)}</span>
            </button>
          ))}
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors bg-white">
          <Download size={13} /> Export CSV ({filtered.length})
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name, organization, or domain…"
          className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* Results count */}
      {q && (
        <div className="text-xs text-gray-500 mb-3">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> results for <span className="font-semibold text-blue-700">&ldquo;{q}&rdquo;</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Scholarship / Organization', 'Domain', 'Award', 'Threat Index', 'Status', 'IRS 990', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No records match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 leading-snug max-w-[200px]">{s.name}</div>
                      <div className="text-gray-400 text-[10px] mt-0.5 truncate max-w-[200px]">{s.org}</div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://${s.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono flex items-center gap-1 whitespace-nowrap text-[11px]"
                      >
                        {s.url.length > 28 ? s.url.slice(0, 28) + '…' : s.url}
                        <ExternalLink size={9} />
                      </a>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{s.award}</td>
                    <td className="px-4 py-3">
                      <div className={`${threatIndexColor(s.threat)} text-white text-[11px] font-bold w-9 h-9 rounded-lg flex items-center justify-center tabular-nums`}>
                        {s.threat}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${threatColor(s.status)} whitespace-nowrap`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.irs ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle size={11} /> Filed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500">
                          <XCircle size={11} /> None
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/scanner?url=${encodeURIComponent(s.url)}`}
                          className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                        >
                          <Eye size={11} /> Inspect
                        </Link>
                        {s.status !== 'VERIFIED' && (
                          <>
                            <span className="text-gray-200">|</span>
                            <button
                              onClick={() => handleFlag(s)}
                              className="inline-flex items-center gap-1 text-[10px] text-red-600 hover:text-red-800 font-semibold transition-colors"
                            >
                              <Flag size={9} /> Flag
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
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-500 flex items-center justify-between">
            <span>{filtered.length} record{filtered.length !== 1 ? 's' : ''} in view</span>
            <span>ScholarGuard Registry v14 · Last sync: 8 mins ago</span>
          </div>
        )}
      </div>
    </div>
  )
}
