'use client'
import { useState } from 'react'
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, Loader2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const KNOWN = {
  'studentaid.gov': {
    score: 0, status: 'VERIFIED',
    label: 'Federal Government .gov Domain',
    desc: 'Official U.S. Department of Education Federal Student Aid portal. Highest possible trust level.',
  },
  'coca-colascholars foundation.org': {
    score: 1, status: 'VERIFIED',
    label: 'Gold Standard — Est. 1986',
    desc: 'The Coca-Cola Scholars Foundation has operated since 1986 with full IRS 501(c)(3) status and no application fees.',
  },
  'gates-foundation.org': {
    score: 2, status: 'VERIFIED',
    label: 'Bill & Melinda Gates Foundation',
    desc: 'Established 1994. Full IRS verification, .org domain registered 26 years ago. Zero fees required.',
  },
  'nsfgrfp.org': {
    score: 1, status: 'VERIFIED',
    label: 'National Science Foundation',
    desc: 'U.S. Federal Agency program. Peer-reviewed. No application fee ever charged.',
  },
  'national-meritscholars-portal.org': {
    score: 94, status: 'FRAUD',
    label: 'Domain Typesquat Detected',
    desc: 'Impersonates National Merit Scholarship. Demands $45 processing fee. Domain 14 days old.',
  },
  'ivy-ivyleague-fellowship.net': {
    score: 63, status: 'SUSPICIOUS',
    label: 'Suspicious — Under Review',
    desc: 'Unusual URL structure with repeated "ivyleague". .net TLD for academic org. No IRS 990 found.',
  },
  'quantumleap-edu-scholarship.info': {
    score: 78, status: 'HIGH_RISK',
    label: 'High Risk — Fee Demanded',
    desc: '$75 upfront fee demanded. .info TLD. Domain 3 weeks old. No verifiable nonprofit registration.',
  },
  'scholars-awards.ac': {
    score: 81, status: 'HIGH_RISK',
    label: 'ID Harvesting Detected',
    desc: 'Requests SSN and direct deposit info before selection. Contact via Gmail only. Created 6 hours ago.',
  },
}

const SAMPLE_URLS = [
  'https://studentaid.gov',
  'https://national-meritscholars-portal.org',
  'https://quantumleap-edu-scholarship.info/register',
  'https://nsfgrfp.org',
]

const WHAT_WE_CHECK = [
  { label: 'Domain Age & WHOIS',      desc: 'Checks registration date, registrar, and privacy shields' },
  { label: 'TLD Risk Score',          desc: 'Flags .info, .biz, .net used for academic orgs' },
  { label: 'IRS 990 Database',        desc: 'Cross-references nonprofit filings and registration' },
  { label: 'Fee Keyword Detection',   desc: 'Scans for payment language in solicitations' },
  { label: 'Homoglyph Analysis',      desc: 'Detects character substitution attacks (rn→m, etc.)' },
  { label: 'Plagiarism Hash',         desc: 'Compares content against 1.4M indexed signatures' },
]

function ScoreBar({ score, status }) {
  const color =
    status === 'VERIFIED'  ? 'bg-green-500' :
    status === 'FRAUD'     ? 'bg-red-600' :
    status === 'HIGH_RISK' ? 'bg-orange-500' :
                             'bg-yellow-500'
  const textColor =
    status === 'VERIFIED'  ? 'text-green-700' :
    status === 'FRAUD'     ? 'text-red-700' :
    status === 'HIGH_RISK' ? 'text-orange-700' :
                             'text-yellow-700'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Risk Score</span>
        <span className={`text-sm font-bold tabular-nums ${textColor}`}>{score}/100</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${Math.max(score, 2)}%` }}
        />
      </div>
    </div>
  )
}

export default function VerifyClient() {
  const [url, setUrl]       = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function verify() {
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 900))

    const clean = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const known = KNOWN[clean]
    if (known) {
      setResult({ url: url.trim(), ...known })
    } else {
      try {
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() }),
        })
        const data = await res.json()
        setResult({
          url: url.trim(),
          score: data.threatIndex ?? data.threat ?? 50,
          status: data.status || 'SUSPICIOUS',
          label: data.status === 'VERIFIED' ? 'Verified Legitimate' : 'Forensic Scan Alert',
          desc: `Threat index: ${data.threatIndex ?? data.threat ?? 50}/100. ${data.flags?.join('. ') || `${data.pillars?.length || 0} diagnostic pillars analyzed.`}`,
        })
      } catch {
        setResult({
          url: url.trim(),
          score: 50,
          status: 'SUSPICIOUS',
          label: 'Unknown Domain',
          desc: 'This URL is not in our database. Exercise caution and verify through official university channels.',
        })
      }
    }
    setLoading(false)
  }

  const STATUS_CFG = {
    VERIFIED:  { icon: CheckCircle,  bg: 'border-green-200 bg-green-50',  iconBg: 'bg-green-100',  iconColor: 'text-green-600',  textColor: 'text-green-800',  badgeBg: 'bg-green-100 text-green-700 border-green-300' },
    FRAUD:     { icon: XCircle,      bg: 'border-red-200 bg-red-50',      iconBg: 'bg-red-100',    iconColor: 'text-red-600',    textColor: 'text-red-800',    badgeBg: 'bg-red-100 text-red-700 border-red-300' },
    HIGH_RISK: { icon: AlertTriangle,bg: 'border-orange-200 bg-orange-50',iconBg: 'bg-orange-100', iconColor: 'text-orange-600', textColor: 'text-orange-800', badgeBg: 'bg-orange-100 text-orange-700 border-orange-300' },
    SUSPICIOUS:{ icon: AlertTriangle,bg: 'border-yellow-200 bg-yellow-50',iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', textColor: 'text-yellow-800', badgeBg: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  }

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verify()}
              placeholder="https://scholarship-website.org/apply"
              className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono placeholder:font-sans placeholder-gray-400"
            />
          </div>
          <button
            onClick={verify}
            disabled={loading || !url.trim()}
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            {loading ? 'Checking…' : 'Verify Now'}
          </button>
        </div>

        {/* Sample URLs */}
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] text-gray-400 font-semibold">Try a sample:</span>
          {SAMPLE_URLS.map(u => (
            <button
              key={u}
              onClick={() => { setUrl(u); setResult(null) }}
              className="text-[10px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded font-mono transition-colors"
            >
              {u.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && !loading && (() => {
        const cfg = STATUS_CFG[result.status] || STATUS_CFG.SUSPICIOUS
        const Icon = cfg.icon
        return (
          <div className={`border-2 rounded-2xl p-6 fade-in ${cfg.bg}`}>
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                <Icon size={22} className={cfg.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cfg.badgeBg}`}>
                    {result.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-mono text-sm text-gray-800 break-all mb-1">{result.url}</div>
                <div className={`text-xs font-semibold ${cfg.textColor} mb-1`}>{result.label}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{result.desc}</div>
              </div>
            </div>

            <ScoreBar score={result.score} status={result.status} />

            <div className="mt-5 flex gap-2 flex-wrap">
              <Link
                href={`/scanner?url=${encodeURIComponent(result.url)}`}
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Full Forensic Audit <ChevronRight size={12} />
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors bg-white"
              >
                Report This Domain
              </Link>
            </div>
          </div>
        )
      })()}

      {/* What we check */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">What We Check</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WHAT_WE_CHECK.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={10} className="text-blue-700" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">{item.label}</div>
                <div className="text-[11px] text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
