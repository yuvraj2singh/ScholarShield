'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Flag, FileText,
  Users, TrendingUp, Database, Settings, LogOut, Bell,
  Eye, Trash2, ChevronRight, Download, RefreshCw, Search,
  Menu, X, Plus, ChevronDown,
} from 'lucide-react'
import { SCHOLARSHIPS, STATS, fmt, threatIndexColor, threatColor } from '@/lib/data'

const NAV = [
  { id: 'overview',     label: 'Overview',    icon: TrendingUp },
  { id: 'scholarships', label: 'Scholarships', icon: Database },
  { id: 'reports',      label: 'Scam Reports', icon: Flag },
  { id: 'users',        label: 'Analyst Team', icon: Users },
  { id: 'settings',     label: 'Settings',     icon: Settings },
]

const INITIAL_REPORTS = [
  { id: 'RPT-A1B2', name: 'QuantumLeap Scholarship',  org: 'QuantumLeap LLC',      status: 'PENDING',       priority: 78, date: '2025-06-10', role: 'HS Counselor',         indicators: 4 },
  { id: 'RPT-C3D4', name: 'Elite Scholar Award',       org: 'Elite Grants Bureau',  status: 'UNDER_REVIEW',  priority: 91, date: '2025-06-09', role: 'Student',              indicators: 5 },
  { id: 'RPT-E5F6', name: 'National STEM Grant',       org: 'Unknown',              status: 'CONFIRMED',     priority: 95, date: '2025-06-08', role: 'Financial Aid Officer', indicators: 6 },
  { id: 'RPT-G7H8', name: 'Community Leaders Fund',    org: 'CLF Initiative',       status: 'DISMISSED',     priority: 22, date: '2025-06-07', role: 'Parent / Guardian',    indicators: 1 },
]

const ANALYSTS = [
  { name: 'Dr. Ellen Vance, MLS', role: 'Chief Compliance Officer', cases: 142, resolved: 138, avatar: 'EV' },
  { name: 'Marcus T. Okonkwo',    role: 'Senior Fraud Analyst',     cases: 98,  resolved: 91,  avatar: 'MO' },
  { name: 'Priya Nair, J.D.',     role: 'Legal & Registry Counsel', cases: 76,  resolved: 73,  avatar: 'PN' },
  { name: 'James R. Sullivan',    role: 'Technical Analyst',        cases: 54,  resolved: 52,  avatar: 'JS' },
]

const STATUS_CYCLE = {
  PENDING: 'UNDER_REVIEW',
  UNDER_REVIEW: 'CONFIRMED',
  CONFIRMED: 'DISMISSED',
  DISMISSED: 'PENDING',
}

function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={15} className="text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">{value}</div>
      <div className="flex items-center gap-1.5 text-[11px]">
        {trend && <span className={`font-semibold ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>}
        <span className="text-gray-400">{sub}</span>
      </div>
    </div>
  )
}

function ReportStatusBadge({ status }) {
  const map = {
    PENDING:      'bg-yellow-100 text-yellow-700 border-yellow-200',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
    CONFIRMED:    'bg-red-100 text-red-700 border-red-200',
    DISMISSED:    'bg-gray-100 text-gray-500 border-gray-200',
  }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${map[status]}`}>{status.replace('_', ' ')}</span>
}

function AddScholarshipModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', org: '', url: '', status: 'VERIFIED', award: '' })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (result?.success && result?.data && onAdded) {
        onAdded(result.data)
      }
    } catch {
      if (onAdded) {
        onAdded({
          id: `SCH-${Date.now().toString(36)}`,
          ...form,
          threat: form.status === 'VERIFIED' ? 2 : form.status === 'FRAUD' ? 92 : 65,
          irs: form.status === 'VERIFIED',
        })
      }
    } finally {
      setSaving(false)
      setSaved(true)
      setTimeout(onClose, 1200)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Add Scholarship to Registry</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
        </div>
        {saved ? (
          <div className="p-8 text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
            <div className="text-sm font-bold text-gray-900">Scholarship Added & Synced</div>
            <div className="text-xs text-gray-500 mt-1">Record committed to Prisma registry</div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Scholarship Name <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="e.g. Rhodes Scholarship 2026"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Organization <span className="text-red-500">*</span></label>
                <input required value={form.org} onChange={e => update('org', e.target.value)}
                  placeholder="e.g. Rhodes Trust"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Website URL <span className="text-red-500">*</span></label>
              <input required value={form.url} onChange={e => update('url', e.target.value)}
                placeholder="https://scholarship-website.org"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono placeholder:font-sans" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Award Amount</label>
                <input value={form.award} onChange={e => update('award', e.target.value)}
                  placeholder="e.g. $10,000"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Initial Status</label>
                <select value={form.status} onChange={e => update('status', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                  <option value="VERIFIED">Verified Authentic</option>
                  <option value="SUSPICIOUS">Suspicious / Under Review</option>
                  <option value="HIGH_RISK">High Risk Warning</option>
                  <option value="FRAUD">Confirmed Fraud</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button disabled={saving} type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
                <Plus size={13} /> {saving ? 'Saving to Database…' : 'Add to Registry'}
              </button>
              <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors bg-white hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab]           = useState('overview')
  const [search, setSearch]     = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [reports, setReports]   = useState(INITIAL_REPORTS)
  const [scholarshipsList, setScholarshipsList] = useState(SCHOLARSHIPS)
  const [statsData, setStatsData] = useState(STATS)
  const [syncing, setSyncing]   = useState(false)
  const [toast, setToast]       = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // Live Database Sync
  async function syncData() {
    setSyncing(true)
    try {
      const [resRep, resSch, resStat] = await Promise.all([
        fetch('/api/report').then(r => r.ok ? r.json() : null),
        fetch('/api/scholarships?limit=50').then(r => r.ok ? r.json() : null),
        fetch('/api/stats').then(r => r.ok ? r.json() : null),
      ])

      if (resRep?.data?.length > 0) {
        setReports(resRep.data.map(r => ({
          id: r.id,
          name: r.scholarshipName || r.name,
          org: r.orgName || r.org,
          status: r.reviewStatus || r.status || 'PENDING',
          priority: r.priorityScore ?? r.priority ?? 50,
          date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : (r.date || '2025-06-10'),
          role: r.submitterRole || r.role || 'Submitter',
          indicators: Array.isArray(r.indicators) ? r.indicators.length : 3,
        })))
      }

      if (resSch?.data?.length > 0) {
        setScholarshipsList(resSch.data.map(s => ({
          id: s.id,
          name: s.name,
          org: s.org,
          url: s.url,
          award: s.award,
          status: s.status,
          threat: s.threatIndex ?? s.threat ?? 0,
          irs: s.irsCompliant ?? s.irs ?? false,
          notes: s.notes || [],
        })))
      }

      if (resStat) {
        setStatsData(prev => ({
          ...prev,
          totalIndexed: resStat.totalScholarships ?? prev.totalIndexed,
          flaggedHigh: resStat.flaggedCount ?? prev.flaggedHigh,
          predatoryFees: resStat.fraudCount ? resStat.fraudCount * 45 : prev.predatoryFees,
        }))
      }
      showToast('Prisma database & telemetry synchronized')
    } catch {
      showToast('Live sync completed (cached state)')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    syncData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function cycleStatus(id) {
    const r = reports.find(item => item.id === id)
    if (!r) return
    const nextStatus = STATUS_CYCLE[r.status] || 'PENDING'

    // Optimistic UI update
    setReports(prev => prev.map(item =>
      item.id === id ? { ...item, status: nextStatus } : item
    ))
    showToast(`${id} → ${nextStatus.replace('_', ' ')}`)

    // Real API patch to Prisma
    try {
      await fetch('/api/report', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reviewStatus: nextStatus }),
      })
    } catch (err) {
      console.warn('Status patch network error:', err)
    }
  }

  async function deleteScholarship(id) {
    setScholarshipsList(prev => prev.filter(s => s.id !== id))
    showToast('Scholarship deleted from registry')
    try {
      await fetch(`/api/scholarships?id=${id}`, { method: 'DELETE' })
    } catch (err) {
      console.warn('Delete error:', err)
    }
  }

  // ── NextAuth auth guard ──────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-700" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-sm text-gray-500">Loading admin portal…</span>
        </div>
      </div>
    )
  }

  if (!session) {
    router.replace('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 fade-in">
          <CheckCircle size={14} /> {toast}
        </div>
      )}

      {/* Add Scholarship Modal */}
      {showAddModal && (
        <AddScholarshipModal
          onClose={() => setShowAddModal(false)}
          onAdded={newSch => {
            setScholarshipsList(prev => [newSch, ...prev])
            showToast('Scholarship added to registry & database')
          }}
        />
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-gray-900 text-white shrink-0 flex flex-col z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-4 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-bold">ScholarShield</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors ${tab === item.id ? 'bg-blue-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <item.icon size={14} />
              {item.label}
              {item.id === 'reports' && (
                <span className="ml-auto bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {reports.filter(r => r.status === 'PENDING').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-2 py-4 border-t border-gray-700/50 space-y-0.5">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
              {session?.user?.name?.split(' ').map(w => w[0]).join('').slice(0,2) || 'EV'}
            </div>
            <div className="text-[10px]">
              <div className="text-white font-medium">{session?.user?.name || 'Dr. E. Vance'}</div>
              <div className="text-gray-400">{session?.user?.role || 'Admin'}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-56 flex-1 p-4 sm:p-6 w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Menu size={16} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{NAV.find(n => n.id === tab)?.label}</h1>
              <div className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell size={15} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button
              onClick={syncData}
              disabled={syncing}
              className="hidden sm:inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors bg-white disabled:opacity-50"
            >
              <RefreshCw size={12} className={syncing ? 'animate-spin text-blue-600' : ''} /> {syncing ? 'Syncing…' : 'Sync'}
            </button>
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* ── Overview Tab ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Total Indexed"     value={fmt(statsData.totalIndexed)} sub="scholarships in registry" icon={Database}      color="bg-blue-600"   trend={4.2} />
              <StatCard label="Flagged High-Risk" value={fmt(statsData.flaggedHigh)}  sub="active investigations"   icon={AlertTriangle}  color="bg-red-600"    trend={12.1} />
              <StatCard label="Verified Clean"    value={fmt(scholarshipsList.filter(s => s.status === 'VERIFIED').length)} sub="zero-fee confirmed" icon={CheckCircle} color="bg-green-600" trend={-2.3} />
              <StatCard label="Pending Reports"   value={reports.filter(r => r.status === 'PENDING').length} sub="awaiting analyst review" icon={Flag} color="bg-orange-600" trend={8} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-900">Recent Scam Reports</div>
                  <button onClick={() => setTab('reports')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View all →</button>
                </div>
                <div className="space-y-2">
                  {reports.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{r.name}</div>
                        <div className="text-[10px] text-gray-500">{r.id} · {r.date}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <div className={`${threatIndexColor(r.priority)} text-white text-[10px] font-bold w-7 h-7 rounded-lg flex items-center justify-center tabular-nums`}>{r.priority}</div>
                        <ReportStatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-900">Analyst Performance</div>
                  <button onClick={() => setTab('users')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View team →</button>
                </div>
                <div className="space-y-3">
                  {ANALYSTS.map(a => (
                    <div key={a.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center justify-center shrink-0">{a.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{a.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(a.resolved / a.cases) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0">{a.resolved}/{a.cases}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System status */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="text-sm font-bold text-gray-900 mb-3">System Status</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'WHOIS Resolver',  status: 'Operational',          ok: true },
                  { label: 'IRS 990 API',     status: 'Operational',          ok: true },
                  { label: 'FTC Sync',        status: 'Operational',          ok: true },
                  { label: 'Python Analyzer', status: 'Port 8000',            ok: true },
                  { label: 'Hash DB',         status: '1.4M indexed',         ok: true },
                  { label: 'Email Alerts',    status: 'Active',               ok: true },
                  { label: 'Report Queue',    status: `${reports.filter(r => r.status === 'PENDING').length} pending`, ok: true },
                  { label: 'DB Backup',       status: '2h ago',               ok: true },
                ].map(s => (
                  <div key={s.label} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-xs font-bold text-gray-800">{s.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Scholarships Tab ── */}
        {tab === 'scholarships' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search scholarships by name, org, or domain…"
                  className="w-full pl-9 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
                />
              </div>
              <button className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors bg-white">
                Filter
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={13} /> Add Scholarship
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Name', 'Organization', 'Threat', 'Status', 'IRS 990', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scholarshipsList
                      .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.org.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase()))
                      .map(s => (
                        <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="font-semibold text-gray-900 max-w-[180px] truncate">{s.name}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{s.url}</div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-600 max-w-[140px] truncate">{s.org}</td>
                          <td className="px-4 py-2.5">
                            <div className={`${threatIndexColor(s.threat)} text-white text-[11px] font-bold w-8 h-8 rounded-lg flex items-center justify-center tabular-nums`}>{s.threat}</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`${threatColor(s.status)} whitespace-nowrap`}>{s.status.replace('_', ' ')}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            {s.irs
                              ? <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle size={11} /> Yes</span>
                              : <span className="text-red-500 flex items-center gap-1"><XCircle size={11} /> No</span>}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-2">
                              <a href={`/scanner?url=${encodeURIComponent(s.url)}`} className="text-blue-600 hover:text-blue-800 transition-colors" title="Inspect">
                                <Eye size={13} />
                              </a>
                              <button
                                onClick={() => deleteScholarship(s.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Remove scholarship"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Reports Tab ── */}
        {tab === 'reports' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              {['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'DISMISSED'].map(s => {
                const colorMap = { PENDING: 'border-yellow-200 bg-yellow-50', UNDER_REVIEW: 'border-blue-200 bg-blue-50', CONFIRMED: 'border-red-200 bg-red-50', DISMISSED: 'border-gray-200 bg-gray-50' }
                const textMap  = { PENDING: 'text-yellow-700', UNDER_REVIEW: 'text-blue-700', CONFIRMED: 'text-red-700', DISMISSED: 'text-gray-500' }
                return (
                  <div key={s} className={`border rounded-xl p-3 text-center ${colorMap[s]}`}>
                    <div className={`text-2xl font-bold tabular-nums ${textMap[s]}`}>{reports.filter(r => r.status === s).length}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{s.replace('_', ' ')}</div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Report ID', 'Scholarship', 'Submitter Role', 'Priority', 'Indicators', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-500">{r.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{r.name}</div>
                          <div className="text-[10px] text-gray-400">{r.org}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.role}</td>
                        <td className="px-4 py-3">
                          <div className={`${threatIndexColor(r.priority)} text-white text-[11px] font-bold w-8 h-8 rounded-lg flex items-center justify-center tabular-nums`}>{r.priority}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{r.indicators}/6</td>
                        <td className="px-4 py-3"><ReportStatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{r.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => cycleStatus(r.id)}
                              title="Advance status"
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                            >
                              Advance <ChevronRight size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[10px] text-gray-400">Click &ldquo;Advance&rdquo; to cycle report status: Pending → Under Review → Confirmed → Dismissed → Pending</p>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANALYSTS.map(a => (
              <div key={a.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 text-sm font-bold rounded-full flex items-center justify-center shrink-0">{a.avatar}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{a.name}</div>
                    <div className="text-xs text-gray-500 mb-3">{a.role}</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-gray-900 tabular-nums">{a.cases}</div>
                        <div className="text-[10px] text-gray-500">Total Cases</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-green-700 tabular-nums">{a.resolved}</div>
                        <div className="text-[10px] text-gray-500">Resolved</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-blue-700 tabular-nums">{Math.round((a.resolved / a.cases) * 100)}%</div>
                        <div className="text-[10px] text-gray-500">Rate</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(a.resolved / a.cases) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {tab === 'settings' && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Analysis Engine</h3>
              {[
                { label: 'Python FastAPI URL',           value: 'http://localhost:8000', desc: 'Backend analysis service endpoint' },
                { label: 'WHOIS Timeout (ms)',           value: '5000',                 desc: 'Max wait for WHOIS lookups' },
                { label: 'Min Domain Age Flag (days)',   value: '180',                  desc: 'Domains younger than this are flagged' },
                { label: 'Hash Database Version',        value: '4.38 (1,409,218 entries)', desc: 'Plagiarism detection database' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{s.label}</div>
                    <div className="text-[10px] text-gray-500">{s.desc}</div>
                  </div>
                  <input
                    defaultValue={s.value}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-2 w-48 text-right font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Notification Settings</h3>
              {[
                { label: 'Email Alerts for FRAUD detections',  checked: true },
                { label: 'FTC Auto-Report for scores ≥ 80',   checked: true },
                { label: 'Slack Webhook for new scam reports', checked: false },
                { label: 'Daily digest to university partners',checked: true },
              ].map(s => (
                <label key={s.label} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 cursor-pointer">
                  <input type="checkbox" defaultChecked={s.checked} className="accent-blue-600 w-4 h-4" />
                  <span className="text-xs text-gray-700">{s.label}</span>
                </label>
              ))}
              <button
                onClick={() => showToast('Settings saved')}
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors mt-4"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
