import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Care Label Portal</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Order care labels with confidence</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="button-secondary">Login</Link>
          <Link href="/register" className="button-primary">Register</Link>
        </div>
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-muted">Submitted Orders</p>
          <p className="mt-3 text-3xl font-semibold">24</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-muted">Pending Approvals</p>
          <p className="mt-3 text-3xl font-semibold">3</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-muted">PDFs Generated</p>
          <p className="mt-3 text-3xl font-semibold">186</p>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Features</p>
          <h2 className="mt-4 text-2xl font-semibold">Built for label buyers and operations teams</h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-muted">
            <li>User registration with admin approval workflow</li>
            <li>Order creation, duplication, preview, and PDF download</li>
            <li>Master data management for countries, fibers, and care symbols</li>
            <li>Notification workflow with admin and customer email communications</li>
            <li>English, Traditional Chinese, and Simplified Chinese interface support</li>
          </ul>
        </div>

        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Quick links</p>
          <div className="mt-6 space-y-3">
            <Link href="/orders" className="block rounded-lg border border-border px-4 py-3 hover:bg-stone-50">Orders dashboard</Link>
            <Link href="/admin/users" className="block rounded-lg border border-border px-4 py-3 hover:bg-stone-50">Admin users</Link>
            <Link href="/admin/roles" className="block rounded-lg border border-border px-4 py-3 hover:bg-stone-50">Role management</Link>
            <Link href="/admin/settings" className="block rounded-lg border border-border px-4 py-3 hover:bg-stone-50">System settings</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
