import ReportForm from '@/components/report/ReportForm'
import ReportSidebar from '@/components/report/ReportSidebar'

export const metadata = {
  title: 'Report a Suspicious Scholarship — ScholarGuard',
  description: 'Report a suspicious scholarship or scam. Every submission is reviewed by certified academic fraud analysts within 24 hours.',
}

export default function ReportPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded uppercase tracking-wide">Intake Protocol</span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wide">HESPP-26</span>
          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase tracking-wide">Priority Forensic: Brief</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
          Report a Suspicious Scholarship or Scam
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Every submission is reviewed by certified academic fraud analysts and cross-referenced against state attorney general registries and FTC repositories within 24 hours. Your vigilance protects millions of collegiate applicants.
        </p>
      </div>

      <div className="flex gap-6 items-start flex-wrap lg:flex-nowrap">
        <div className="flex-1 min-w-0">
          <ReportForm />
        </div>
        <div className="w-full lg:w-72 shrink-0">
          <ReportSidebar />
        </div>
      </div>
    </div>
  )
}
