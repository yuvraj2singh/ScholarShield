import VerifyClient from '@/components/verify/VerifyClient'

export const metadata = {
  title: 'Verify a Link — ScholarGuard',
  description: 'Instantly verify any scholarship URL against 1.4 million indexed threat signatures.',
}

export default function VerifyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Verify a Scholarship Link
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          Paste a scholarship URL below for an instant safety check against our database of 54,820 indexed scholarships and 1.4 million threat signatures.
        </p>
      </div>
      <VerifyClient />
    </div>
  )
}
