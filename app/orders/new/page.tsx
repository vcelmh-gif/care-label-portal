'use client';

import Link from 'next/link';
import { FormEvent, MouseEvent, Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { careTexts, countries, fibers } from '@/lib/mock-data';

type EditableOrder = {
  id: string;
  poNumber: string;
  accountNumber: string;
  shapeNo: string;
  shapeName: string;
  styleNo: string;
  itemNo: string;
  expectedDeliveryDate: string;
  madeInCountry: string;
  fibers: { name: string; percentage: number }[];
  sizes: { size: string; quantity: number }[];
  careSymbols: { group: string; code: string }[];
  careTexts: { text: string }[];
};

const sizes = [
  '65B', '65C', '65D',
  '70A', '70B', '70C', '70D', '70E', '70F', '70G',
  '75A', '75B', '75C', '75D', '75E', '75F', '75G',
  '80A', '80B', '80C', '80D', '80E', '80F', '80G',
  '85B', '85C', '85D', '85E', '85F',
  '90B', '90C', '90D', '90E',
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'S/M', 'M/L', 'L/XL', 'ONE SIZE',
];
const fiberRows = [1, 2, 3, 4, 5, 6];
const careGroups = [
  {
    name: 'Washing',
    symbols: [
      { code: 'W1', image: 'image18.png', description: 'Hand wash at 30 degrees' },
      { code: 'W2', image: 'image19.png', description: 'Machine wash at 30 degrees or less on reduced cycle' },
    ],
  },
  { name: 'Bleaching', symbols: [{ code: 'B1', image: 'image13.png', description: 'Do not bleach' }] },
  { name: 'Dry Cleaning', symbols: [{ code: 'DC1', image: 'image14.png', description: 'Do not dry-clean' }] },
  { name: 'Ironing', symbols: [{ code: 'I1', image: 'image15.png', description: 'Do not iron' }] },
  { name: 'Drying', symbols: [{ code: 'D1', image: 'image17.png', description: 'Do not tumble dry' }] },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function NewOrderForm() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [existingOrder, setExistingOrder] = useState<EditableOrder | undefined>();
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editId));
  const [quantities, setQuantities] = useState<Record<string, number>>(
    {},
  );
  const [selectedCare, setSelectedCare] = useState<Record<string, string>>({});
  const [fiberContent, setFiberContent] = useState(
    fiberRows.map((_, index) => ({
      percentage: '',
      name: '',
    })),
  );
  const [message, setMessage] = useState('');
  const [texTracerUrl, setTexTracerUrl] = useState('');
  const [texTracerError, setTexTracerError] = useState('');
  useEffect(() => {
    if (!editId) {
      setIsLoadingEdit(false);
      return;
    }
    fetch(`/api/orders/${editId}`)
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error ?? 'Unable to load draft.');
        }
        return response.json() as Promise<EditableOrder>;
      })
      .then((order) => {
        setExistingOrder(order);
        setQuantities(Object.fromEntries(order.sizes.map(({ size, quantity }) => [size, quantity])));
        setSelectedCare(Object.fromEntries(order.careSymbols.map(({ group, code }) => [group, code])));
        setFiberContent(fiberRows.map((_, index) => ({
          percentage: order.fibers[index]?.percentage.toString() ?? '',
          name: order.fibers[index]?.name ?? '',
        })));
      })
      .catch((error: Error) => setMessage(error.message))
      .finally(() => setIsLoadingEdit(false));
  }, [editId]);
  const totalQuantity = useMemo(
    () => Object.values(quantities).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [quantities],
  );
  const roundUpQuantity = totalQuantity === 0 ? 0 : Math.max(50, totalQuantity);
  const totalAmount = (roundUpQuantity * 0.12).toFixed(2);

  if (isLoadingEdit) {
    return <main className="mx-auto max-w-6xl px-6 py-10"><p className="text-sm text-muted">Loading draft...</p></main>;
  }
  if (editId && !existingOrder) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-red-700">{message || 'Unable to load this draft.'}</p>
        <Link href="/orders" className="button-secondary mt-6">Back to orders</Link>
      </main>
    );
  }

  const updateQuantity = (size: string, value: string) => {
    setQuantities((current) => ({ ...current, [size]: Number(value) || 0 }));
  };

  const updateFiber = (index: number, field: 'percentage' | 'name', value: string) => {
    setFiberContent((current) => current.map((fiber, fiberIndex) => (
      fiberIndex === index ? { ...fiber, [field]: value } : fiber
    )));
  };

  const persistDraft = async (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const payload = {
      poNumber: String(formData.get('poNumber') ?? ''),
      accountNumber: String(formData.get('accountNumber') ?? ''),
      shapeNo: String(formData.get('shapeNo') ?? ''),
      shapeName: String(formData.get('shapeName') ?? ''),
      styleNo: String(formData.get('styleNo') ?? ''),
      itemNo: String(formData.get('itemNo') ?? ''),
      expectedDeliveryDate: String(formData.get('expectedDeliveryDate') ?? ''),
      madeInCountry: String(formData.get('madeInCountry') ?? ''),
      sizes: Object.entries(quantities).map(([size, quantity]) => ({ size, quantity })).filter((entry) => entry.quantity > 0),
      fibers: fiberContent.filter((fiber) => fiber.name && fiber.percentage).map((fiber) => ({ name: fiber.name, percentage: Number(fiber.percentage) })),
      careSymbols: Object.entries(selectedCare).map(([group, code]) => ({ group, code })),
      careTexts: [1, 2, 3, 4].map((line) => String(formData.get(`careText${line}`) ?? '')).filter(Boolean),
    };
    const response = await fetch(editId ? `/api/orders/${editId}` : '/api/orders', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Unable to save draft.');
    setMessage('Draft saved. You can return to edit this order before submitting.');
  };
  const saveDraft = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      await persistDraft(event.currentTarget.form!);
    } catch {
      setMessage('Unable to save this draft. Please try again.');
    }
  };
  const previewLabel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (texTracerUrl) {
      try {
        const parsedUrl = new URL(texTracerUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
          throw new Error('Invalid URL');
        }

      } catch {
        setTexTracerError('Enter a valid URL starting with https:// or http://.');
        setMessage('');
        return;
      }
    }
    try {
      await persistDraft(event.currentTarget);
    } catch {
      setMessage('Unable to save this draft. Please try again.');
      return;
    }
    setTexTracerError('');
    setMessage('English label preview is ready. Review it before submitting the order.');
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Orders / New</p>
          <h1 className="mt-2 text-3xl font-semibold">{existingOrder ? `Edit draft ${existingOrder.id}` : 'Marlies Dekkers Care label order form'}</h1>
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
            <Field label="Expected delivery date"><input className="input" name="expectedDeliveryDate" type="date" defaultValue={existingOrder?.expectedDeliveryDate.slice(0, 10) ?? '2026-12-05'} /></Field>
            <Field label="PO no."><input className="input" name="poNumber" defaultValue={existingOrder?.poNumber ?? 'PO-2050'} /></Field>
            <Field label="Acc. no."><input className="input" name="accountNumber" defaultValue={existingOrder?.accountNumber ?? 'AC-9904'} /></Field>
            <Field label="Shape #"><input className="input" name="shapeNo" defaultValue={existingOrder?.shapeNo ?? 'SH-440'} /></Field>
            <Field label="Shape name"><input className="input" name="shapeName" defaultValue={existingOrder?.shapeName ?? 'Slim Fit Shirt'} /></Field>
            <Field label="Style #"><input className="input" name="styleNo" defaultValue={existingOrder?.styleNo ?? 'ST-48'} /></Field>
            <Field label="Item no."><input className="input" name="itemNo" defaultValue={existingOrder?.itemNo ?? 'IT-810'} /></Field>
            <Field label="Made in">
              <select className="select" name="madeInCountry" defaultValue={existingOrder?.madeInCountry ?? countries[0]}>{countries.map((country) => <option key={country}>{country}</option>)}</select>
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
              <p className="mt-2 text-sm text-muted">A symbol with an outline is selected. Click it again to clear the selection.</p>
              <div className="mt-4 space-y-5">
                {careGroups.map((group) => (
                  <div key={group.name}>
                    <p className="mb-2 text-sm font-medium">{group.name}</p>
                    <div className="flex flex-wrap gap-3">
                      {group.symbols.map((symbol) => (
                        <button
                          type="button"
                          key={symbol.code}
                          onClick={() => setSelectedCare((current) => {
                            const next = { ...current };
                            if (next[group.name] === symbol.code) {
                              delete next[group.name];
                            } else {
                              next[group.name] = symbol.code;
                            }
                            return next;
                          })}
                          className={`flex min-w-20 flex-col items-center rounded-lg border px-3 py-2 transition ${selectedCare[group.name] === symbol.code ? 'border-ink bg-white text-ink ring-2 ring-ink ring-offset-2' : 'border-border bg-white hover:bg-stone-50'}`}
                          aria-label={`${group.name}: ${symbol.description} ${symbol.code}`}
                        >
                          <img
                            src={`/symbols/${symbol.image}`}
                            alt={symbol.description}
                            className="h-12 w-12 object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted">Fiber content</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border text-muted"><tr><th className="px-3 py-3">Percentage</th><th className="px-3 py-3">Fibre</th></tr></thead>
                  <tbody>
                    {fiberContent.map((fiberContentRow, index) => (
                      <tr key={fiberRows[index]} className="border-b border-border">
                        <td className="px-3 py-3">
                          <input
                            className="input min-w-24"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="%"
                            value={fiberContentRow.percentage}
                            onChange={(event) => updateFiber(index, 'percentage', event.target.value)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <select
                            className="select min-w-40"
                            value={fiberContentRow.name}
                            onChange={(event) => updateFiber(index, 'name', event.target.value)}
                          >
                            <option value="">Select fibre</option>
                            {fibers.map((fiber) => <option key={fiber}>{fiber}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Tex Tracer URL</span>
                  <input
                    className={`input ${texTracerError ? 'border-red-600 focus:border-red-600' : ''}`}
                    type="url"
                    value={texTracerUrl}
                    onChange={(event) => {
                      setTexTracerUrl(event.target.value);
                      if (texTracerError) setTexTracerError('');
                    }}
                    placeholder="https://example.com/tex-tracer/..."
                    aria-invalid={Boolean(texTracerError)}
                    aria-describedby={texTracerError ? 'tex-tracer-error' : undefined}
                  />
                  {texTracerError && <p id="tex-tracer-error" className="mt-2 text-sm text-red-600">{texTracerError}</p>}
                </label>
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
                    <select className="select" name={`careText${line}`} defaultValue={existingOrder?.careTexts[line - 1]?.text ?? ''}><option value="">Select care text</option>{careTexts.map((text) => <option key={text}>{text}</option>)}</select>
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

export default function NewOrderPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-6 py-10"><p className="text-sm text-muted">Loading order form...</p></main>}>
      <NewOrderForm />
    </Suspense>
  );
}
