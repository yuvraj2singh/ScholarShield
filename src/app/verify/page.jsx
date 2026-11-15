import VerifyClient from '@/components/verify/VerifyClient'

export const metadata = {
  title: 'Verify a Link — ScholarGuard',
  description: 'Instantly verify any scholarship URL against 1.4 million indexed threat signatures.',
}

export default function VerifyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded uppercase tracking-wide">Quick Verify</span>
          <span className="text-[10px] text-gray-500">· 1.4M signatures indexed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Verify a Scholarship Link</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
          Paste a scholarship URL below for an instant safety check against our database of 54,820 indexed scholarships and 1.4 million threat signatures.
        </p>
      </div>
      <VerifyClient />
    </div>
  )
}
