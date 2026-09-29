"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900">Something went wrong</h1>
      <p className="mx-auto mb-8 max-w-md text-zinc-600">
        An unexpected error occurred. You can retry the request or go back to the homepage.
      </p>
      {process.env.NODE_ENV !== "production" && error?.message && (
        <pre className="mx-auto mb-8 max-w-xl overflow-auto rounded-xl bg-zinc-950 p-4 text-left text-xs text-zinc-100">
          {error.message}
        </pre>
      )}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
