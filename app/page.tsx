import Link from 'next/link';

const features = [
  ['01', 'Order management', 'Create, edit, submit, duplicate, and download production-ready care label orders.'],
  ['02', 'Clear communication', 'Keep customers and operations teams aligned with automatic order notifications.'],
  ['03', 'Built for fashion', 'Manage fibers, countries, care text, and symbols from one focused workspace.'],
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
        <div className="grid items-end gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              CASESTUDY / PORTAL
            </div>
            <h1 className="mt-10 max-w-4xl text-6xl font-bold leading-[0.92] tracking-[-0.06em] text-ink sm:text-7xl lg:text-[7.4rem]">
              Designed
              <br />
              to deliver.
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-8 text-muted">
              A considered workspace for creating accurate care labels, from the first order detail to the final production PDF.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/login" className="button-primary px-6 py-3">Login</Link>
              <Link href="/register" className="button-secondary px-6 py-3">Create account</Link>
            </div>
          </div>

          <div className="relative min-h-[390px]">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#f2eee8] sm:h-80 sm:w-80" />
            <div className="absolute right-10 top-10 h-56 w-56 rotate-[-8deg] border border-ink bg-white p-6 shadow-[14px_14px_0_#111] sm:h-72 sm:w-72">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.22em] text-muted">
                <span>Care label</span>
                <span>01</span>
              </div>
              <div className="mt-12 border-y border-ink py-6">
                <p className="text-2xl font-semibold tracking-tight">Marlies Dekkers</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">Made in China</p>
              </div>
              <div className="mt-8 flex gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink text-xl">W</span>
                <span className="flex h-12 w-12 items-center justify-center border border-ink text-xl">I</span>
                <span className="flex h-12 w-12 items-center justify-center border border-ink text-xl">D</span>
              </div>
              <p className="mt-8 text-xs text-muted">95% Cotton / 5% Elastane</p>
            </div>
            <p className="absolute bottom-1 left-0 max-w-[180px] text-xs uppercase leading-5 tracking-[0.18em] text-muted">Precision in every detail</p>
          </div>
        </div>
      </section>

      <section className="border-y border-ink bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3 lg:px-10">
          <div><p className="text-xs uppercase tracking-[0.22em] text-stone-400">Submitted orders</p><p className="mt-3 text-5xl font-semibold tracking-tight">24</p></div>
          <div><p className="text-xs uppercase tracking-[0.22em] text-stone-400">Pending approvals</p><p className="mt-3 text-5xl font-semibold tracking-tight">03</p></div>
          <div><p className="text-xs uppercase tracking-[0.22em] text-stone-400">PDFs generated</p><p className="mt-3 text-5xl font-semibold tracking-tight">186</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">The workspace</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Everything needed to move from brief to label.</h2>
          </div>
          <Link href="/orders" className="text-sm font-medium underline underline-offset-4">Explore orders</Link>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {features.map(([number, title, description]) => (
            <div key={number} className="border-t border-ink pt-5">
              <p className="text-xs text-muted">{number}</p>
              <h3 className="mt-10 text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-4 leading-7 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-border px-6 py-8 text-xs uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>CASESTUDY</span>
        <span>Care Label Portal</span>
        <span>Designed to deliver</span>
      </footer>
    </main>
  );
}
