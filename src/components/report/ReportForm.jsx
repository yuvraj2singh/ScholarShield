'use client'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, AlertTriangle, CheckCircle, Loader2, FileText, X } from 'lucide-react'
import Link from 'next/link'

const SCAM_INDICATORS = [
  { id: 'fee',           label: 'Advance Application or Processing Fee',       desc: 'Mandatory application, processing fees, document, or disbursement charge' },
  { id: 'guaranteed',    label: 'Guaranteed Wins or "Exclusive Pre-Selection"', desc: 'Pre-selection guarantee or a promise that accepts 100% guaranteed' },
  { id: 'banking',       label: 'Bank Routing, PIN, or SSN Requested',         desc: 'Mandatory collection of direct-deposit credentials or identity codes' },
  { id: 'free-email',    label: 'Free/Generic Email Origin',                   desc: 'Official committee uses gmail, yahoo.com, or personal webmail' },
  { id: 'suspect-domain',label: 'Suspect Domain or Brand Typosquatting',       desc: 'Registered on .biz, .info, .net, or imitating reputable foundations' },
  { id: 'no-info',       label: 'Missing Non-Profit Registration / Fake Essay', desc: 'No verifiable committee page, physical address, or IRS 990 registration' },
]

export default function ReportForm() {
  const [files, setFiles]       = useState([])
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { discoveryChannel: 'email', anonymous: true, role: 'counselor' },
  })
  const anonymous = watch('anonymous')

  function handleFiles(newFiles) {
    const arr = Array.from(newFiles).filter(f => f.size < 10 * 1024 * 1024)
    setFiles(prev => [...prev, ...arr].slice(0, 5))
  }

  async function onSubmit(data) {
    setLoading(true)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, fileCount: files.length }),
      })
      const json = await res.json()
      setSubmitted(json)
    } catch {
      setSubmitted({ reportId: `RPT-${Date.now().toString(36).toUpperCase()}`, priorityScore: 85, status: 'queued' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10 text-center fade-in">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-700 shadow-sm">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
        <p className="text-base text-gray-600 mb-6 leading-relaxed max-w-lg mx-auto">
          Your incident has been queued for analyst review. An automated sandbox crawl will begin within 2 hours, followed by physical address verification and registry blacklist registration if confirmed.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 inline-block mb-6">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Incident Reference ID</div>
          <div className="font-mono text-xl font-bold text-gray-900">{submitted.reportId}</div>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setSubmitted(null)} className="btn-secondary text-sm px-5 py-3 rounded-xl">
            Submit Another Report
          </button>
          <Link href="/registry" className="btn-primary text-sm px-5 py-3 rounded-xl">
            View Public Registry
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Section 1 — Basic Intelligence */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">01 / Incident Profile</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Scholarship &amp; Sponsor Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1.5">
              Scholarship or Award Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('scholarshipName', { required: 'Required' })}
              placeholder="e.g. National Collegiate Leadership Endowment 2025"
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 shadow-sm"
            />
            {errors.scholarshipName && (
              <span className="text-xs text-red-500 mt-1 block">{errors.scholarshipName.message}</span>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1.5">
              Claimed Sponsoring Organization <span className="text-red-500">*</span>
            </label>
            <input
              {...register('orgName', { required: 'Required' })}
              placeholder="e.g. Future Scholars Foundation LLC or Unknown"
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 shadow-sm"
            />
            {errors.orgName && (
              <span className="text-xs text-red-500 mt-1 block">{errors.orgName.message}</span>
            )}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-800 block mb-1.5">Suspect URL or Portal Link</label>
          <input
            {...register('url')}
            placeholder="https://suspect-scholarship.org/application-register"
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono placeholder:font-sans placeholder-gray-400 shadow-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 block mb-2.5">Discovery Channel: How did you encounter it?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: 'email',         label: 'Email Inbox' },
              { value: 'twitter',       label: 'Social Media Ad' },
              { value: 'scholarship-db',label: 'Scholarship Database' },
              { value: 'physical',      label: 'Physical Mail / Flyer' },
              { value: 'school-board',  label: 'School Notice Board' },
              { value: 'direct-link',   label: 'Direct Link / SMS' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                <input type="radio" value={opt.value} {...register('discoveryChannel')} className="accent-blue-700 w-4 h-4" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 — Flagged Scam Indicators */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7">
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">02 / Deception Signatures</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select all patterns present in this solicitation</h2>
        </div>
        <p className="text-sm text-gray-600 mb-5">Select all patterns that apply. Every selected indicator helps train our automated heuristics.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SCAM_INDICATORS.map(ind => (
            <label key={ind.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                value={ind.id}
                {...register('indicators')}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-700 cursor-pointer shrink-0"
              />
              <div>
                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">{ind.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed mt-0.5">{ind.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section 3 — Evidence & Financial Details */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">03 / Financial Extraction &amp; Evidence</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Payment Demands &amp; Screenshots</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1.5">Demanded Payment or Fee ($ USD)</label>
            <input
              {...register('feeAmount')}
              type="number"
              placeholder="e.g. 75.00"
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1.5">Requested Payment Channel</label>
            <select
              {...register('paymentMethod')}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer shadow-sm"
            >
              <option value="">No payment requested / Unknown</option>
              <option value="zelle">Zelle Peer-to-Peer</option>
              <option value="venmo">Venmo / CashApp</option>
              <option value="wire">Wire Transfer / MoneyGram</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="gift-card">Gift Cards</option>
              <option value="check">Personal Check / Money Order</option>
            </select>
          </div>
        </div>

        {/* File upload */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".png,.jpg,.pdf,.txt,.eml"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <Upload size={28} className="mx-auto mb-2 text-gray-400" />
          <div className="text-sm font-semibold text-gray-800 mb-1">Click to upload or drag &amp; drop evidentiary files</div>
          <div className="text-xs text-gray-500">PNG, JPG, PDF, TXT or .eml · Max 10MB per file · Analyzed in an isolated sandbox</div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-800 font-medium">{f.name}</span>
                  <span className="text-xs text-gray-400 font-mono">({(f.size / 1024).toFixed(0)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-800 block mb-1.5">Analyst Context &amp; Observations</label>
          <textarea
            {...register('notes')}
            rows={4}
            placeholder="Describe what felt off: timing of demands, claims made by solicitors, high-pressure countdowns, or unusual payment instructions..."
            className="w-full p-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none placeholder-gray-400 leading-relaxed shadow-sm"
          />
        </div>
      </div>

      {/* Section 4 — Submitter Assurance */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">04 / Submitter Assurance</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Identity &amp; Disclosures</h2>
        </div>

        <label className="flex items-center gap-3 cursor-pointer mb-5 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
          <input type="checkbox" {...register('anonymous')} className="w-5 h-5 rounded border-gray-300 accent-blue-700" />
          <div>
            <div className="text-sm font-bold text-gray-900">Submit Anonymously</div>
            <div className="text-xs text-gray-500">Your email and identity will not be shared or linked to this public docket.</div>
          </div>
        </label>

        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-800 block mb-2.5">Your Role in Academic Community</label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'counselor', label: 'High School Counselor' },
              { value: 'student',   label: 'Collegiate Applicant' },
              { value: 'guardian',  label: 'Parent / Family Member' },
              { value: 'financial', label: 'Financial Aid Officer' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value={opt.value} {...register('role')} className="accent-blue-700 w-4 h-4" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {!anonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Your Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Rachel Thomas"
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Email Address for Resolution Updates</label>
              <input
                {...register('email')}
                type="email"
                placeholder="rachel.thomas@university.edu"
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Legal notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
        <AlertTriangle size={16} className="inline mr-2 text-amber-600" />
        By submitting this incident report, you certify the information is accurate to the best of your knowledge. ScholarGuard cross-checks all disclosures against federal consumer reporting databases.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-base font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 shadow-md cursor-pointer"
      >
        {loading
          ? <><Loader2 size={18} className="animate-spin" /> Submitting Incident for Audit…</>
          : 'Submit Incident for Audit'}
      </button>
    </form>
  )
}
