export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 md:py-14" aria-label="Loading leaderboard">
      <div className="text-center mb-10">
        <div className="skeleton h-10 w-72 mx-auto mb-3" />
        <div className="skeleton h-4 w-96 max-w-full mx-auto" />
      </div>
      <div className="card overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-edge last:border-0">
            <div className="skeleton h-6 w-8" />
            <div className="skeleton !rounded-full" style={{ width: 40, height: 40 }} />
            <div className="flex-1">
              <div className="skeleton h-5 w-40 mb-1.5" />
              <div className="skeleton h-3 w-24" />
            </div>
            <div className="skeleton h-6 w-16" />
          </div>
        ))}
      </div>
    </main>
  );
}
