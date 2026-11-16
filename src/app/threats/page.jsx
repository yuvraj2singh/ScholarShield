import ThreatsClient from '@/components/threats/ThreatsClient'

export const metadata = {
  title: 'Deceptive Scholarship Taxonomy & Pattern Intelligence — ScholarShield',
  description: 'A deep-dive into 5 core classification of predatory scholarship schemes, pattern data, and the analytical tools ScholarShield uses to flag and prosecute them.',
}

export default function ThreatsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Deceptive Scholarship Taxonomy &amp; Pattern Intelligence
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          A deep-dive into 5 core classifications of predatory scholarship schemes, pattern data, and the analytical tools ScholarShield uses to flag and report them. Use this library to train students, counsel families, and equip financial aid offices.
        </p>
      </div>
      <ThreatsClient />
    </div>
  )
}
