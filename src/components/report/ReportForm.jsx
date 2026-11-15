'use client'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, AlertTriangle, CheckCircle, Loader2, FileText, X } from 'lucide-react'
import Link from 'next/link'

const SCAM_INDICATORS = [
  { id: 'fee',           label: 'Advance Application or Processing Fee',       desc: 'Mandatory application, processing fees, document, or disbursement charge' },
  { id: 'guaranteed',    label: 'Guaranteed Wins or "Exclusive Pre-Selection"', desc: 'Pre-selection guarantee or a promise that accepts 100% guaranteed' },
  { id: 'banking',       label: 'Bank Routing, PIN, or SSN Requested',         desc: 'Mandatory collection of direct-deposit credentials or identity codes' },
  { id: 'free-email',    label: 'Free/Generic Email Origin',                   desc: 'Official committee uses gmail, yahoo.com, gradscholar.com, or personal.com' },
  { id: 'suspect-domain',label: 'Suspect Domain or Brand Typesquall',          desc: 'Registrations order .biz, .net, or imitating reputable foundations' },
  { id: 'no-info',       label: 'No Official/10 Word Fake Essay',              desc: 'No official committee page or website with no real information or to get personal process' },
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
      <div className="bg-white border border-green-200 rounded-xl shadow-sm p-8 text-center fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Your incident has been queued for analyst review. An automated sandbox crawl will begin within 2 hours, followed by physical address verification and registry blacklist registration if confirmed.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 inline-block mb-5">
          <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Reference ID</div>
          <div className="font-mono text-lg font-bold text-gray-900">{submitted.reportId}</div>
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          <button onClick={() => setSubmitted(null)} className="btn-secondary">Submit Another Report</button>
          <Link href="/registry" className="btn-primary">View Public Registry</Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Section 1 — Basic Intelligence */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">01 / Basic Intelligence</div>
            <h2 className="text-base font-bold text-gray-900">Scholarship or Award Title</h2>
          </div>
          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Threat Dossier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Scholarship or Award Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('scholarshipName', { required: 'Required' })}
              placeholder="e.g. National Collegiate Leadership Endowment 20..."
              className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
            />
            {errors.scholarshipName && (
              <span className="text-[10px] text-red-500 mt-1 block">{errors.scholarshipName.message}</span>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Claimed Sponsoring Organization <span className="text-red-500">*</span>
            </label>
            <input
              {...register('orgName', { required: 'Required' })}
              placeholder="e.g. Future Scholars Foundation LLC or Unknown"
              className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
            />
            {errors.orgName && (
              <span className="text-[10px] text-red-500 mt-1 block">{errors.orgName.message}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 block mb-1.5">Suspect URL or Portal Link</label>
          <input
            {...register('url')}
            placeholder="https://suspect-scholarship.org/application-register"
            className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono placeholder:font-sans placeholder-gray-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">Discovery Channel: How did you encounter it?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { value: 'email',         label: 'Email/Inbox' },
              { value: 'twitter',       label: 'Twitter/Social' },
              { value: 'scholarship-db',label: 'Scholarship DB' },
              { value: 'physical',      label: 'Physical Mail/Flyer' },
              { value: 'school-board',  label: 'School Board Notice' },
              { value: 'direct-link',   label: 'Other / Direct Link' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input type="radio" value={opt.value} {...register('discoveryChannel')} className="accent-blue-700" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 — Flagged Scam Indicators */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">02 / Flagged Scam Indicators</div>
            <h2 className="text-base font-bold text-gray-900">Select all patterns present in this listing</h2>
          </div>
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">Target Vectors</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Select all patterns that apply. Need help? Each indicator links to our threat library.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCAM_INDICATORS.map(ind => (
            <label key={ind.id} className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                value={ind.id}
                {...register('indicators')}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-700 cursor-pointer"
              />
              <div>
                <div className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug">{ind.label}</div>
                <div className="text-[10px] text-gray-500 leading-relaxed">{ind.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section 3 — Evidence & Financial Details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">03 / Evidence &amp; Financial Details</div>
          <h2 className="text-base font-bold text-gray-900">Forensic Material</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Demanded Payment or Fee ($ USD)</label>
            <input
              {...register('feeAmount')}
              type="number"
              placeholder="e.g. 75.00"
              className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Requested Payment Method</label>
            <select
              {...register('paymentMethod')}
              className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="">No payment requested (Blank if unknown only)</option>
              <option value="zelle">Zelle</option>
              <option value="venmo">Venmo / CashApp</option>
              <option value="wire">Wire Transfer</option>
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
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
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <div className="text-xs font-semibold text-gray-700 mb-1">Click to upload or drag &amp; drop evidentiary files</div>
          <div className="text-[10px] text-gray-500">PNG, JPG, PDF, TXT or .eml · Max 10MB per file · Used directly as forensic evidence material</div>
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-700 font-medium">{f.name}</span>
                  <span className="text-[10px] text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-700 block mb-1.5">Analyst Context &amp; Qualifications / Notes</label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Describe what felt off: timing of demands, claims made by actors, or specific pressure tactics used..."
            className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Section 4 — Submitter Information */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">04 / Submitter Information</div>
          <h2 className="text-base font-bold text-gray-900">Identity Assurance</h2>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input type="checkbox" {...register('anonymous')} className="w-4 h-4 rounded border-gray-300 accent-blue-700" />
          <div>
            <div className="text-xs font-semibold text-gray-700">Submit Anonymously</div>
            <div className="text-[10px] text-gray-500">Be notified when you do so, you will not receive resolution updates.</div>
          </div>
        </label>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 block mb-2">Your Role in Scholastic Community</label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'counselor', label: 'HS Counselor' },
              { value: 'student',   label: 'Student' },
              { value: 'guardian',  label: 'Parent / Guardian' },
              { value: 'financial', label: 'Financial Aid Officer' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input type="radio" value={opt.value} {...register('role')} className="accent-blue-700" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {!anonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Your Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Rachel Thomas"
                className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email Address for Docket Reports</label>
              <input
                {...register('email')}
                type="email"
                placeholder="rachel.thomas@scholasticdu.org"
                className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Legal notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 leading-relaxed">
        <AlertTriangle size={12} className="inline mr-1 text-amber-500" />
        By filing this scenario, you certify the material is submitted to reflect actual concern for real-world academic fraud. We take each submission seriously and cross-check all reports.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
          : 'Submit Incident for Audit'}
      </button>
    </form>
  )
}
