export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-3/4 rounded-xl bg-zinc-200" />
        <div className="h-6 w-1/2 rounded-lg bg-zinc-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-zinc-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
