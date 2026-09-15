import { countries } from '@/lib/mock-data';

export default function CountriesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Master Data</p>
        <h1 className="mt-2 text-3xl font-semibold">Countries</h1>
      </div>

      <div className="mt-8 card p-6">
        <div className="flex justify-end">
          <button className="button-primary">Add country</button>
        </div>
        <ul className="mt-6 space-y-3">
          {countries.map((country) => (
            <li key={country} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>{country}</span>
              <button className="button-secondary">Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
