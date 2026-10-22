import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-site flex min-h-dvh flex-col justify-center py-24">
      <h1 className="type-h2">Page not found</h1>
      <p className="type-body measure-body mt-4 text-graphite">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      <Link
        href="/"
        className="type-meta mt-8 inline-flex min-h-11 w-fit items-center rounded-control bg-ink px-5 text-paper t-fast transition-opacity hover:opacity-85"
      >
        Back to the home page
      </Link>
    </main>
  );
}
