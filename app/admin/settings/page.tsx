'use client';

import { useEffect, useState } from 'react';

type Setting = {
  id: string;
  name: string;
  value: string;
  description: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error ?? 'Unable to load settings.');
        return response.json() as Promise<Setting[]>;
      })
      .then((data) => {
        setSettings(data);
        setValues(Object.fromEntries(data.map((setting) => [setting.id, setting.value])));
        setStatus('ready');
      })
      .catch((error: Error) => {
        setMessage(error.message);
        setStatus('error');
      });
  }, []);

  async function saveSettings() {
    setStatus('saving');
    setMessage('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settings.map(({ id }) => ({ id, value: values[id] ?? '' })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to save settings.');
      setSettings(data);
      setValues(Object.fromEntries(data.map((setting: Setting) => [setting.id, setting.value])));
      setStatus('success');
      setMessage('Settings saved successfully.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to save settings.');
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">System settings</h1>
          <p className="mt-2 text-sm text-muted">Manage the values used by the portal.</p>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          disabled={status === 'loading' || status === 'saving' || settings.length === 0}
          className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {message && (
        <p className={`mt-6 rounded-md border px-4 py-3 text-sm ${status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`} role="status">
          {message}
        </p>
      )}

      <div className="mt-8 card overflow-hidden">
        {status === 'loading' ? (
          <p className="px-6 py-8 text-sm text-muted">Loading settings…</p>
        ) : settings.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted">No settings have been configured.</p>
        ) : (
          <div className="divide-y divide-border">
            {settings.map((setting) => (
              <div key={setting.id} className="grid gap-2 px-6 py-5 md:grid-cols-[minmax(10rem,1fr)_minmax(14rem,2fr)_minmax(12rem,1.5fr)] md:items-center md:gap-6">
                <label htmlFor={`setting-${setting.id}`} className="font-medium">{setting.name}</label>
                <input
                  id={`setting-${setting.id}`}
                  value={values[setting.id] ?? ''}
                  onChange={(event) => setValues((current) => ({ ...current, [setting.id]: event.target.value }))}
                  className="input"
                  disabled={status === 'saving'}
                />
                <p className="text-sm text-muted">{setting.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
