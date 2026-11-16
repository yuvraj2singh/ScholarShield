'use client'

import Link from 'next/link'
import { Shield, Search, CheckCircle, AlertTriangle, FileSearch, Lock, ArrowRight, Award, Building, Sparkles } from 'lucide-react'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
          Autonomous Protection Against <br className="hidden sm:inline" />
          <span className="text-blue-700">Predatory Scholarship Schemes</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
          ScholarShield parses grant announcements, endowment solicitations, and sponsored stipends across 18,000+ domains. Every record is triaged against IRS tax filings, registrar WHOIS lineage, and federal consumer fraud databases.
        </p>

        {/* Primary CTA with Google Authorization */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <GoogleSignInButton
            size="lg"
            className="w-full sm:w-auto shadow-md"
            text="Sign in"
            callbackUrl="/"
          />
          <Link
            href="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3.5 text-base rounded-xl transition-colors shadow-sm"
          >
            <Search size={18} />
            <span>Verify a Link Now</span>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Google authorization only · Free and open scholastic infrastructure for students, families, and counselors
        </p>
      </section>

      {/* ─── Impact Metrics Bar ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 tabular-nums">54,820</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">Scholarships Triaged</div>
              <div className="text-xs text-gray-500 mt-0.5">Indexed in live registry</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-4xl font-extrabold text-red-600 tabular-nums">1.4M+</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">Threat Signatures</div>
              <div className="text-xs text-gray-500 mt-0.5">Advance-fee &amp; phishing hashes</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-900 tabular-nums">$0.00</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">Federal Zero-Fee Rule</div>
              <div className="text-xs text-gray-500 mt-0.5">Never pay to apply</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700 tabular-nums">18,000+</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">Domains Monitored</div>
              <div className="text-xs text-gray-500 mt-0.5">Continuous WHOIS surveillance</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Features / Diagnostic Engines ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How ScholarShield Protects Applicants
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Multi-layered automated inspection designed specifically for academic grant fraud, fake endowments, and predatory fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 mb-5">
              <FileSearch size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Live WHOIS &amp; Domain Pedigree</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Instantly interrogates domain registration age, identifying freshly minted lookalike domains (&lt; 180 days) and hidden offshore privacy shields before students interact.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Advance-Fee Extraction Guard</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Detects coercive language demanding &ldquo;handling fees&rdquo;, &ldquo;courier verification&rdquo;, or payments through Zelle, CashApp, and wire rails that violate federal standards.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 mb-5">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Credential Harvesting Radar</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Scrapes application forms in real time to catch unauthorized requests for Social Security numbers, bank routing codes, or FAFSA credentials.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 mb-5">
              <Building size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">IRS 990 Cross-Validation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cross-references foundation names with official IRS 501(c)(3) filings and university endowments to distinguish genuine donors from fictitious shell entities.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 mb-5">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Scholarship Directory</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Search a vetted registry of established collegiate programs like Gates Millennium, Coca-Cola Scholars, Rhodes, and NSF fellowships.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 mb-5">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Community Incident Reporting</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Empowers students and financial aid advisors to report fraudulent solicitations, escalating confirmed scams to public watchlists within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How ScholarShield Audits a Scholarship</h2>
            <p className="text-sm sm:text-base text-blue-200 max-w-xl mx-auto">
              Our automated system processes solicitations through a three-stage verification pipeline:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-lg text-white">
                1
              </div>
              <h4 className="text-lg font-bold text-white">Submit URL or Text</h4>
              <p className="text-sm text-blue-200 leading-relaxed">
                Paste any scholarship application link, award email, or letter directly into the scanner.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-lg text-white">
                2
              </div>
              <h4 className="text-lg font-bold text-white">Six-Pillar Analysis</h4>
              <p className="text-sm text-blue-200 leading-relaxed">
                The engine runs live WHOIS queries, crawls page inputs, examines linguistic patterns, and cross-checks tax filings.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-lg text-white">
                3
              </div>
              <h4 className="text-lg font-bold text-white">Instant Threat Verdict</h4>
              <p className="text-sm text-blue-200 leading-relaxed">
                Receive an authoritative safety score (0–100) with detailed flags so students know whether to proceed or avoid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Card with Google Sign In ──────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={32} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Ready to Protect Your Educational Journey?
          </h2>

          <p className="text-base text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Sign in with your Google account to unlock full access to the scholarship registry, forensic scanner, and community reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GoogleSignInButton
              size="lg"
              className="w-full sm:w-auto shadow-md"
              text="Sign in"
              callbackUrl="/"
            />
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold px-6 py-3.5 text-base rounded-xl transition-colors bg-white"
            >
              <span>Test Verify a Link</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

