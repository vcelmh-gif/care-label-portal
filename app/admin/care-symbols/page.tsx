import { careSymbols } from '@/lib/mock-data';

export default function CareSymbolsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Master Data</p>
        <h1 className="mt-2 text-3xl font-semibold">Care Symbols</h1>
      </div>
      <div className="mt-8 card p-6">
        <ul className="space-y-3">
          {careSymbols.map((symbol) => (
            <li key={symbol} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>{symbol}</span>
              <button className="button-secondary">Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
