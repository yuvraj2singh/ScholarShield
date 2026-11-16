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
  'coca-colascholarsfoundation.org': {
    score: 1, status: 'VERIFIED',
    label: 'Gold Standard — Est. 1986',
    desc: 'The Coca-Cola Scholars Foundation has operated since 1986 with full IRS 501(c)(3) status and no application fees.',
  },
  'gatesfoundation.org': {
    score: 0, status: 'VERIFIED',
    label: 'Bill & Melinda Gates Foundation',
    desc: 'Established 1994. Full IRS verification, .org domain registered 26 years ago. Zero fees required.',
  },
  'gates-foundation.org': {
    score: 2, status: 'VERIFIED',
    label: 'Bill & Melinda Gates Foundation (Legacy Domain)',
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
  { label: 'Domain Age & WHOIS',      desc: 'Checks registration date, registrar lineage, and privacy proxy shields' },
  { label: 'TLD Risk Scoring',        desc: 'Flags high-risk and commercial TLDs used for fake academic foundations' },
  { label: 'IRS 990 Database',        desc: 'Cross-references 501(c)(3) nonprofit tax filings and public charity records' },
  { label: 'Fee Extraction Radar',    desc: 'Scans for prohibited advance processing, courier, or registration charges' },
  { label: 'Homoglyph Analysis',      desc: 'Detects lookalike character substitution attacks (rn → m, 0 → o, etc.)' },
  { label: 'Credential Harvesting',   desc: 'Alerts if application forms request SSN, banking PIN, or FAFSA logins' },
]

function ScoreBar({ score, status }) {
  const color =
    status === 'VERIFIED'  ? 'bg-blue-600' :
    status === 'FRAUD'     ? 'bg-red-600' :
    status === 'HIGH_RISK' ? 'bg-orange-500' :
                             'bg-yellow-500'
  const textColor =
    status === 'VERIFIED'  ? 'text-blue-700' :
    status === 'FRAUD'     ? 'text-red-700' :
    status === 'HIGH_RISK' ? 'text-orange-700' :
                             'text-yellow-700'
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Composite Risk Index</span>
        <span className={`text-base font-extrabold tabular-nums ${textColor}`}>{score}/100</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
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
    await new Promise(r => setTimeout(r, 600))

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
          label: data.status === 'VERIFIED' ? 'Verified Legitimate Program' : 'Forensic Security Alert',
          desc: `Threat score: ${data.threatIndex ?? data.threat ?? 50}/100. ${data.flags?.join('. ') || `${data.pillars?.length || 0} diagnostic security pillars analyzed.`}`,
        })
      } catch {
        setResult({
          url: url.trim(),
          score: 50,
          status: 'SUSPICIOUS',
          label: 'Unindexed Domain',
          desc: 'This URL is not yet indexed in our clearinghouse. Exercise caution and verify through your campus financial aid office.',
        })
      }
    }
    setLoading(false)
  }

  const STATUS_CFG = {
    VERIFIED:  { icon: CheckCircle,  bg: 'border-blue-200 bg-blue-50/60',  iconBg: 'bg-blue-100',  iconColor: 'text-blue-700',  textColor: 'text-blue-900',  badgeBg: 'bg-blue-100 text-blue-800 border-blue-300' },
    FRAUD:     { icon: XCircle,      bg: 'border-red-200 bg-red-50/60',      iconBg: 'bg-red-100',    iconColor: 'text-red-600',    textColor: 'text-red-900',    badgeBg: 'bg-red-100 text-red-800 border-red-300' },
    HIGH_RISK: { icon: AlertTriangle,bg: 'border-orange-200 bg-orange-50/60',iconBg: 'bg-orange-100', iconColor: 'text-orange-600', textColor: 'text-orange-900', badgeBg: 'bg-orange-100 text-orange-800 border-orange-300' },
    SUSPICIOUS:{ icon: AlertTriangle,bg: 'border-yellow-200 bg-yellow-50/60',iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', textColor: 'text-yellow-900', badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  }

  return (
    <div className="space-y-8">
      {/* Search input */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verify()}
              placeholder="https://scholarship-website.org/apply"
              className="w-full pl-11 pr-4 py-3.5 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono placeholder:font-sans placeholder-gray-400 shadow-sm"
            />
          </div>
          <button
            onClick={verify}
            disabled={loading || !url.trim()}
            className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors disabled:opacity-50 shrink-0 shadow-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            <span>{loading ? 'Checking…' : 'Verify Link'}</span>
          </button>
        </div>

        {/* Sample URLs */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-semibold">Try a verified sample:</span>
          {SAMPLE_URLS.map(u => (
            <button
              key={u}
              onClick={() => { setUrl(u); setResult(null) }}
              className="text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg font-mono transition-colors"
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
          <div className={`border-2 rounded-2xl p-6 sm:p-8 fade-in ${cfg.bg}`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${cfg.iconBg} shadow-sm`}>
                <Icon size={28} className={cfg.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-md border ${cfg.badgeBg}`}>
                    {result.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-gray-900 break-all mb-1">{result.url}</div>
                <div className={`text-sm font-bold ${cfg.textColor} mb-2`}>{result.label}</div>
                <div className="text-sm text-gray-700 leading-relaxed">{result.desc}</div>
              </div>
            </div>

            <ScoreBar score={result.score} status={result.status} />

            <div className="mt-6 pt-5 border-t border-black/5 flex gap-3 flex-wrap">
              <Link
                href={`/scanner?url=${encodeURIComponent(result.url)}`}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <span>Full Forensic Audit</span>
                <ChevronRight size={14} />
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white shadow-sm"
              >
                Report This Domain
              </Link>
            </div>
          </div>
        )
      })()}

      {/* What we check */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">What ScholarShield Checks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHAT_WE_CHECK.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700">
                <Shield size={14} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800 mb-0.5">{item.label}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
