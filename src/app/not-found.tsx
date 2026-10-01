import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F8F9FA] px-4">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold text-[#0F2C59]">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600">
          The page you requested could not be found. Explore our available
          properties and make your next move.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#0F2C59] px-6 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
