export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-white border-b border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-6 mb-6">
        <div className="h-4 w-48 bg-gray-200 rounded mb-3" />
        <div className="h-9 w-96 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full max-w-lg bg-gray-100 rounded" />
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {/* List skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-72 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-100 rounded" />
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

