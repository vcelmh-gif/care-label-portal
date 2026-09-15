'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { careSymbols, careTexts, countries, fibers } from '@/lib/mock-data';

const sizes = [
  '65B', '65C', '65D',
  '70A', '70B', '70C', '70D', '70E', '70F', '70G',
  '75A', '75B', '75C', '75D', '75E', '75F', '75G',
  '80A', '80B', '80C', '80D', '80E', '80F', '80G',
  '85B', '85C', '85D', '85E', '85F',
  '90B', '90C', '90D', '90E',
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'S/M', 'M/L', 'L/XL', 'ONE SIZE',
];
const fiberAreas = ['SHELL', 'SHELL 1', 'SHELL 2', 'LINING', 'PADDING', 'FILLING'];
const careGroups = ['Washing', 'Bleaching', 'Drying', 'Ironing', 'Dry Cleaning'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function NewOrderPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState('');
  const totalQuantity = useMemo(
    () => Object.values(quantities).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [quantities],
  );
  const roundUpQuantity = totalQuantity === 0 ? 0 : Math.max(50, totalQuantity);
  const totalAmount = (roundUpQuantity * 0.12).toFixed(2);

  const updateQuantity = (size: string, value: string) => {
    setQuantities((current) => ({ ...current, [size]: Number(value) || 0 }));
  };

  const saveDraft = () => setMessage('Draft saved. You can return to edit this order before submitting.');
  const previewLabel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('English label preview is ready. Review it before submitting the order.');
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Orders / New</p>
          <h1 className="mt-2 text-3xl font-semibold">Care label order form</h1>
          <p className="mt-2 text-sm text-muted">Complete the form using the same structure as the Marlies Dekkers order sheet.</p>
        </div>
        <Link href="/orders" className="button-secondary">Back to orders</Link>
      </div>

      <form className="mt-8 space-y-6" onSubmit={previewLabel}>
        {message && <div className="rounded-lg border border-border bg-stone-50 p-4 text-sm">{message}</div>}
        <section className="card p-8">
          <h2 className="text-lg font-semibold">Order information</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Date"><input className="input" type="date" defaultValue="2026-09-15" /></Field>
            <Field label="Ship mode">
              <select className="select"><option>Air</option><option>Sea</option><option>Courier</option></select>
            </Field>
            <Field label="Expected delivery date"><input className="input" type="date" defaultValue="2026-12-05" /></Field>
            <Field label="PO no."><input className="input" defaultValue="PO-2050" /></Field>
            <Field label="Acc. no."><input className="input" defaultValue="AC-9904" /></Field>
            <Field label="Shape #"><input className="input" defaultValue="SH-440" /></Field>
            <Field label="Shape name"><input className="input" defaultValue="Slim Fit Shirt" /></Field>
            <Field label="Style #"><input className="input" defaultValue="ST-48" /></Field>
            <Field label="Item no."><input className="input" defaultValue="IT-810" /></Field>
            <Field label="Made in">
              <select className="select">{countries.map((country) => <option key={country}>{country}</option>)}</select>
            </Field>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {(['Bill to', 'Ship to'] as const).map((addressType) => (
            <div className="card p-8" key={addressType}>
              <h2 className="text-lg font-semibold">{addressType}</h2>
              <div className="mt-5 space-y-5">
                <Field label="Company name"><input className="input" defaultValue={addressType === 'Bill to' ? 'Fashion Source Ltd.' : 'Marlies Dekkers Warehouse'} /></Field>
                <Field label="Address"><textarea className="textarea" rows={2} defaultValue="12 Fashion Avenue" /></Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Postal code"><input className="input" defaultValue="00000" /></Field>
                  <Field label="Country">
                    <select className="select">{countries.map((country) => <option key={country}>{country}</option>)}</select>
                  </Field>
                </div>
                <Field label="TEL / ATTN"><input className="input" defaultValue="+852 0000 0000" /></Field>
              </div>
            </div>
          ))}
        </section>

        <section className="card p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Size matrix</h2>
              <p className="mt-1 text-sm text-muted">Enter the requested quantity for each size.</p>
            </div>
            <span className="badge">Total: {totalQuantity} PC</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {sizes.map((size) => (
              <Field label={size} key={size}>
                <input className="input" type="number" min="0" placeholder="0" value={quantities[size] ?? ''} onChange={(event) => updateQuantity(size, event.target.value)} />
              </Field>
            ))}
          </div>
          <div className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
            <div><p className="text-sm text-muted">Total quantity (PC)</p><p className="mt-1 text-xl font-semibold">{totalQuantity || '—'}</p></div>
            <div><p className="text-sm text-muted">Total round-up qty (PC)</p><p className="mt-1 text-xl font-semibold">{roundUpQuantity || '—'}</p></div>
            <div><p className="text-sm text-muted">Total amount (USD)</p><p className="mt-1 text-xl font-semibold">{totalQuantity ? `$${totalAmount}` : '—'}</p></div>
          </div>
        </section>

        <section className="card p-8">
          <h2 className="text-lg font-semibold">Care instructions + fibre content</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted">Care instructions</h3>
              <div className="mt-4 space-y-5">
                {careGroups.map((group) => (
                  <Field label={group} key={group}>
                    <select className="select" defaultValue="">
                      <option value="">Select symbol</option>
                      {careSymbols.map((symbol) => <option key={symbol}>{symbol}</option>)}
                    </select>
                  </Field>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted">Fiber content</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border text-muted"><tr><th className="px-3 py-3">Area</th><th className="px-3 py-3">Percentage</th><th className="px-3 py-3">Fibre</th></tr></thead>
                  <tbody>
                    {fiberAreas.map((area) => (
                      <tr key={area} className="border-b border-border">
                        <td className="px-3 py-3 font-medium">{area}</td>
                        <td className="px-3 py-3"><input className="input min-w-24" type="number" min="0" max="100" placeholder="%" /></td>
                        <td className="px-3 py-3"><select className="select min-w-40" defaultValue=""><option value="">Select fibre</option>{fibers.map((fiber) => <option key={fiber}>{fiber}</option>)}</select></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="card p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Care text</h2>
              <p className="mt-1 text-sm text-muted">Choose up to four standard lines.</p>
              <div className="mt-4 space-y-3">
                {[1, 2, 3, 4].map((line) => (
                  <div className="flex items-center gap-3" key={line}>
                    <span className="w-5 text-sm text-muted">{line}</span>
                    <select className="select" defaultValue=""><option value="">Select care text</option>{careTexts.map((text) => <option key={text}>{text}</option>)}</select>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Special care text</h2>
              <p className="mt-1 text-sm text-muted">Manual input, up to five additional lines.</p>
              <div className="mt-4 space-y-3">
                {[1, 2, 3, 4, 5].map((line) => <input className="input" key={line} placeholder={`Special care text ${line}`} />)}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button type="button" className="button-secondary" onClick={saveDraft}>Save as draft</button>
          <button type="submit" className="button-primary">Preview label</button>
        </div>
      </form>
    </main>
  );
}
