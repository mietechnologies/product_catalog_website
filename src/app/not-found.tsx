import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
      <div className="mx-auto max-w-md">
        {/* 404 illustration */}
        <div className="text-8xl font-bold text-primary/15 select-none mb-4">
          404
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-neutral mb-8">
          The miniature you&apos;re looking for doesn&apos;t exist in our catalog. It may have
          been moved or the link might be incorrect.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-light transition-colors"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Catalog
        </Link>
      </div>
    </div>
  );
}
