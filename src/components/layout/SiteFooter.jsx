import Link from 'next/link'
import { Shield } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Public Directory', href: '/' },
  { label: 'URL & Domain Scanner', href: '/scanner' },
  { label: 'Threat Patterns', href: '/threats' },
  { label: 'Report a Scam', href: '/report' },
  { label: 'Database Registry', href: '/registry' },
  { label: 'Verify a Link', href: '/verify' },
  { label: 'Admin Dashboard', href: '/admin' },
]

const ACCREDITATION = [
  'Higher Education Scam Prevention Protocol (HESPP)',
  'FSA Compliance & Title IV Verification Matrix',
  'Cross-Institutional Fraud Working Group',
  'Identity Shield & Data Stewardship Charter',
]

const REGULATORY = [
  { label: 'FTC Consumer Alert: Scholarship Scams', href: 'https://consumer.ftc.gov/articles/scholarship-and-financial-aid-scams' },
  { label: '16 CFR Part 255 — Endorsement Guides', href: 'https://www.ftc.gov/legal-library/browse/rules/16-cfr-part-255' },
  { label: 'U.S. Dept. of Education Inspector General', href: 'https://www2.ed.gov/about/offices/list/oig/index.html' },
  { label: 'Consumer Financial Protection Bureau (CFPB)', href: 'https://www.consumerfinance.gov' },
  { label: 'Submit Tips to Federal Authorities', href: 'https://reportfraud.ftc.gov' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Shield size={12} className="text-white" />
              </div>
              <span className="text-white text-sm font-semibold">Scholastic Integrity</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500 mb-4">
              ScholarGuard is a distributed threat intelligence clearinghouse dedicated to safeguarding students, institutional endowments, and university registrars against predatory advance-fee fraud and deceptive scholarship campaigns.
            </p>
            {/* Internal nav links */}
            <div className="space-y-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Accreditation &amp; Standards</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              {ACCREDITATION.map(t => (
                <li key={t}>
                  <a href="#" className="hover:text-gray-300 transition-colors leading-snug block">{t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Regulatory */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Regulatory Reference</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              {REGULATORY.map(t => (
                <li key={t.label}>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors leading-snug block"
                  >
                    {t.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Developer &amp; Open Access</h4>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Integrate real-time scholarship verification directly into campus financial aid portals and student management SIS platforms.
            </p>
            <div className="flex gap-2 mb-4">
              <a href="#" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors">Open API Docs</a>
              <a href="#" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors">Feeds</a>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                FTC &amp; Dept. of Ed Sync Active
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Network Status: Nominal
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© 2025 ScholarGuard Verification Network. Open scholastic infrastructure.</span>
          <div className="flex gap-4">
            {['Privacy Governance', 'Archival Disclosure', 'Vulnerability Reporting'].map(t => (
              <a key={t} href="#" className="hover:text-gray-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
