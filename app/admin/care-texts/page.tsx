import { careTexts } from '@/lib/mock-data';

export default function CareTextsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Master Data</p>
        <h1 className="mt-2 text-3xl font-semibold">Care Texts</h1>
      </div>
      <div className="mt-8 card p-6">
        <ul className="space-y-3">
          {careTexts.map((careText) => (
            <li key={careText} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>{careText}</span>
              <button className="button-secondary">Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
