export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 md:py-14" aria-label="Loading dashboard">
      <div className="flex items-center gap-5 mb-8">
        <div className="skeleton !rounded-full" style={{ width: 64, height: 64 }} />
        <div className="flex-1">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-96 max-w-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-10 w-10 !rounded-xl mb-3" />
            <div className="skeleton h-8 w-24 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="skeleton h-28 !rounded-2xl mb-10" />
      <div className="skeleton h-7 w-48 mb-5" />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-6 w-3/4 mb-4" />
            <div className="skeleton h-3 w-full mb-3" />
            <div className="skeleton h-4 w-1/3" />
          </div>
        ))}
      </div>
    </main>
  );
}
