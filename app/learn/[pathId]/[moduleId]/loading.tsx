export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8" aria-label="Loading module">
      <div className="skeleton h-5 w-72 mb-6" />
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div className="hidden lg:block space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-11" />
          ))}
        </div>
        <div>
          <div className="skeleton h-9 w-2/3 mb-4" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-4/5 mb-8" />
          <div className="skeleton h-64 !rounded-xl" />
        </div>
      </div>
    </main>
  );
}
