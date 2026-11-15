import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Shield size={32} className="text-blue-700" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 — Not Found</h1>
      <p className="text-sm text-gray-600 mb-6 max-w-md leading-relaxed">
        This page does not exist in our registry. It may have been removed, flagged, or the URL may be incorrect.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">
          <ArrowLeft size={14} /> Back to Registry
        </Link>
        <Link href="/report" className="btn-secondary">
          Report a Scam
        </Link>
      </div>
    </div>
  )
}

