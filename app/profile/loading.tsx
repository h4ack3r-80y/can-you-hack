export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 md:py-14" aria-label="Loading profile">
      <div className="card p-6 md:p-8 mb-8 flex flex-wrap items-center gap-6">
        <div className="skeleton !rounded-full" style={{ width: 96, height: 96 }} />
        <div className="flex-1 min-w-[200px]">
          <div className="skeleton h-8 w-56 mb-2" />
          <div className="skeleton h-4 w-72 max-w-full" />
        </div>
        <div className="skeleton h-10 w-32" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-8 w-20 mb-2" />
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="skeleton h-7 w-48 mb-5" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-5 w-2/3 mb-3" />
            <div className="skeleton h-3 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
