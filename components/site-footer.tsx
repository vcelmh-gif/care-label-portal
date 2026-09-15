import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-t border-border px-6 py-8 text-xs uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
      <Link href="https://www.casestudy.global" target="_blank" rel="noreferrer" className="transition hover:text-ink">CASESTUDY</Link>
      <span>Care Label Portal</span>
      <span>Designed to deliver</span>
    </footer>
  );
}
