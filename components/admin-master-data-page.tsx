'use client';

import { FormEvent, useEffect, useState } from 'react';

type Resource = 'countries' | 'fibers' | 'care-texts' | 'care-symbols';
type RecordItem = { id: string; isActive: boolean; name?: string; text?: string; code?: string; description?: string; imagePath?: string };

export default function AdminMasterDataPage({ resource, title }: { resource: Resource; title: string }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const endpoint = `/api/admin/${resource}`;

  const load = () => fetch(endpoint).then(async (response) => {
    if (!response.ok) throw new Error('Unable to load master data.');
    setItems(await response.json());
  }).catch((reason: Error) => setError(reason.message));
  useEffect(() => { load(); }, [endpoint]);

  const openForm = (item?: RecordItem) => {
    setEditing(item ?? null);
    setValue(item ? item.name ?? item.text ?? item.code ?? '' : '');
    setDescription(item?.description ?? '');
    setImagePath(item?.imagePath ?? '');
    setError('');
    setShowForm(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const body = resource === 'care-symbols'
      ? { id: editing?.id, value, description, imagePath }
      : { id: editing?.id, value };
    const response = await fetch(endpoint, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => null);
    if (!response.ok) { setError(data?.error ?? 'Unable to save record.'); return; }
    setShowForm(false);
    await load();
  };

  const toggle = async (item: RecordItem) => {
    const response = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, isActive: !item.isActive }) });
    if (!response.ok) { const data = await response.json().catch(() => null); setError(data?.error ?? 'Unable to update status.'); return; }
    await load();
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">Master Data</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <div className="mt-8 card p-6">
        <div className="flex justify-end">
          <button className="button-primary" onClick={() => openForm()}>Add {title.slice(0, -1).toLowerCase()}</button>
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {showForm && (
          <form onSubmit={submit} className="mt-6 rounded-lg border border-border bg-stone-50 p-4">
            <h2 className="font-semibold">{editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</h2>
            <label className="mt-4 block text-sm font-medium">{resource === 'care-symbols' ? 'Code' : 'Value'}
              <input className="input mt-1" value={value} onChange={(event) => setValue(event.target.value)} required />
            </label>
            {resource === 'care-symbols' && <>
              <label className="mt-3 block text-sm font-medium">Description<input className="input mt-1" value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
              <label className="mt-3 block text-sm font-medium">Image path<input className="input mt-1" value={imagePath} onChange={(event) => setImagePath(event.target.value)} required /></label>
            </>}
            <div className="mt-4 flex gap-2"><button className="button-primary" type="submit">Save</button><button className="button-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
          </form>
        )}
        <ul className="mt-6 space-y-3">
          {items.map((item) => {
            const label = item.name ?? item.text ?? item.code ?? '';
            return <li key={item.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div><span className={item.isActive ? '' : 'text-muted line-through'}>{label}</span>{resource === 'care-symbols' && <span className="ml-3 text-sm text-muted">{item.description}</span>}<span className="ml-3 badge">{item.isActive ? 'Active' : 'Inactive'}</span></div>
              <div className="flex gap-2"><button className="button-secondary" onClick={() => openForm(item)}>Edit</button><button className="button-secondary" onClick={() => toggle(item)}>{item.isActive ? 'Deactivate' : 'Activate'}</button></div>
            </li>;
          })}
          {!items.length && <li className="py-4 text-sm text-muted">No records found.</li>}
        </ul>
      </div>
    </main>
  );
}
