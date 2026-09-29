import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mb-4 text-6xl font-black tracking-tight text-zinc-900">404</div>
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900">Page not found</h1>
      <p className="mx-auto mb-8 max-w-md text-zinc-600">
        The page you are looking for does not exist or has been moved. Check the URL or return home.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Go to homepage
        </Link>
        <Link
          href="/reels"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          Reels downloader
        </Link>
      </div>
    </div>
  );
}
