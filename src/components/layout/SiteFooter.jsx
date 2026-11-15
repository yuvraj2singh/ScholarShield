import Link from 'next/link'
import { Shield, ExternalLink } from 'lucide-react'

const FOOTER_LINKS = {
  registry: [
    { label: 'Public Directory', href: '/' },
    { label: 'URL & Domain Scanner', href: '/scanner' },
    { label: 'Threat Patterns Taxonomy', href: '/threats' },
    { label: 'Report a Suspicious Scam', href: '/report' },
    { label: 'Full Database Registry', href: '/registry' },
    { label: 'Quick Verify Tool', href: '/verify' },
  ],
  standards: [
    { label: 'Federal Zero-Fee Rule (HESPP-2025)', href: '#' },
    { label: 'IRS Form 990-PF Cross-Validation', href: '#' },
    { label: 'Domain Age Probationary Protocol', href: '#' },
    { label: 'Anti-Homoglyph Domain Screening', href: '#' },
    { label: 'FTC Sentinel Network Integration', href: '#' },
  ],
  trusted: [
    { label: 'StudentAid.gov (U.S. Dept. of Ed)', href: 'https://studentaid.gov', ext: true },
    { label: 'National Science Foundation (NSF)', href: 'https://nsfgrfp.org', ext: true },
    { label: 'Gates Millennium Scholars', href: 'https://gatesfoundation.org', ext: true },
    { label: 'Coca-Cola Scholars Foundation', href: 'https://coca-colascholarsfoundation.org', ext: true },
    { label: 'Rhodes Trust Oxford', href: 'https://rhodeshouse.ox.ac.uk', ext: true },
  ],
}

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-base font-bold text-white tracking-tight">ScholarGuard</div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Scholarship Verification Network</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
              An autonomous verification clearinghouse protecting students, families, and academic advisors from advance-fee scholarship fraud, predatory data harvesting, and synthetic grant listings.
            </p>
            <div className="text-xs text-gray-500 font-mono space-y-1">
              <div>Network Node: us-east-clearhouse-01</div>
              <div>Registry Sync: FTC Sentinel Network + IRS 990 Data</div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Clearinghouse</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.registry.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Verification Standards</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.standards.map(s => (
                <li key={s.label}>
                  <a href={s.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trusted programs & status */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Network Connectivity</h4>
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div>FTC &amp; Dept. of Ed Sync Active</div>
              <div>Network Status: Nominal</div>
            </div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Benchmark Programs</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.trusted.map(t => (
                <li key={t.label}>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>{t.label}</span>
                    <ExternalLink size={11} className="text-gray-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; 2025 ScholarGuard Verification Network. Open scholastic infrastructure.</span>
          <div className="flex gap-6">
            {['Privacy Governance', 'Archival Disclosure', 'Vulnerability Reporting'].map(t => (
              <a key={t} href="#" className="hover:text-gray-300 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
