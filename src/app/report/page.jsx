import ReportForm from '@/components/report/ReportForm'
import ReportSidebar from '@/components/report/ReportSidebar'

export const metadata = {
  title: 'Report a Suspicious Scholarship — ScholarGuard',
  description: 'Report a suspicious scholarship or scam. Every submission is reviewed by certified academic fraud analysts within 24 hours.',
}

export default function ReportPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Report a Suspicious Scholarship or Scam
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          Every submission is reviewed by certified academic fraud analysts and cross-referenced against state attorney general registries and FTC repositories within 24 hours. Your vigilance protects millions of collegiate applicants.
        </p>
      </div>

      <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap">
        <div className="flex-1 min-w-0">
          <ReportForm />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <ReportSidebar />
        </div>
      </div>
    </div>
  )
}
