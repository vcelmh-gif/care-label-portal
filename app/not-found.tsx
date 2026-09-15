import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <Link href="/" className="button-primary mt-6">Back home</Link>
      </div>
    </main>
  );
}
