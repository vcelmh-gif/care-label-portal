import { systemSettings } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">System settings</h1>
      </div>

      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left">
          <thead className="bg-stone-50 text-sm text-muted">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {systemSettings.map((setting) => (
              <tr key={setting.id}>
                <td className="px-6 py-4 font-medium">{setting.name}</td>
                <td className="px-6 py-4">{setting.value}</td>
                <td className="px-6 py-4 text-muted">{setting.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
