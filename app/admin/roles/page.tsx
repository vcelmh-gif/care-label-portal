import Link from 'next/link';

const permissions = ['Orders', 'Users', 'Countries', 'Fibers', 'Care Texts', 'Care Symbols', 'Email Settings', 'Audit Logs'];

export default function RolesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Administration</p>
          <h1 className="mt-2 text-3xl font-semibold">Role management</h1>
        </div>
        <Link href="/admin/users" className="button-secondary">Users</Link>
      </div>
      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-stone-50 text-muted"><tr><th className="px-6 py-3">Role</th><th className="px-6 py-3">Permissions</th><th className="px-6 py-3">Action</th></tr></thead>
          <tbody className="divide-y divide-border">
            <tr><td className="px-6 py-4 font-medium">ADMIN</td><td className="px-6 py-4">{permissions.join(', ')}</td><td className="px-6 py-4"><button className="button-secondary">Edit</button></td></tr>
            <tr><td className="px-6 py-4 font-medium">CUSTOMER</td><td className="px-6 py-4">My Orders, Create Order, Edit Draft, Submit Order, Download PDF</td><td className="px-6 py-4"><button className="button-secondary">Edit</button></td></tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
