export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 md:py-14" aria-label="Loading learning paths">
      <div className="text-center mb-12">
        <div className="skeleton h-10 w-80 max-w-full mx-auto mb-4" />
        <div className="skeleton h-4 w-[28rem] max-w-full mx-auto" />
      </div>
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 md:p-8">
            <div className="skeleton h-7 w-64 mb-4" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-5/6 mb-6" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="skeleton h-24" />
              <div className="skeleton h-24" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
