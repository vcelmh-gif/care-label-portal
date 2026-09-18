'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error ?? 'Unable to load users.');
        setUsers(data as User[]);
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(user: User, status: 'ACTIVE' | 'INACTIVE') {
    await updateUser(user, { status }, 'Unable to update user status.');
  }

  async function updateRole(user: User, role: User['role']) {
    if (role === user.role) return;
    await updateUser(user, { role }, 'Unable to update user role.');
  }

  async function updateUser(user: User, change: { status?: User['status']; role?: User['role'] }, fallback: string) {
    setError('');
    setUpdatingUserId(user.id);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...change }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? fallback);
        return;
      }
      setUsers((current) => current.map((item) => item.id === user.id ? data : item));
    } catch {
      setError(fallback);
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Administration</p>
        <h1 className="mt-2 text-3xl font-semibold">Users</h1>
      </div>
      {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left">
          <thead className="bg-stone-50 text-sm text-muted">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {loading && <tr><td className="px-6 py-8 text-center text-muted" colSpan={6}>Loading users…</td></tr>}
            {!loading && users.length === 0 && <tr><td className="px-6 py-8 text-center text-muted" colSpan={6}>No users found.</td></tr>}
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{user.companyName || '—'}</td>
                <td className="px-6 py-4">
                  <select
                    aria-label={`Role for ${user.name}`}
                    className="rounded-md border border-border bg-white px-2 py-1 text-sm"
                    value={user.role}
                    disabled={updatingUserId === user.id}
                    onChange={(event) => updateRole(user, event.target.value as User['role'])}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                  </select>
                </td>
                <td className="px-6 py-4"><span className="badge">{user.status}</span></td>
                <td className="px-6 py-4">{user.createdAt}</td>
                <td className="px-6 py-4">
                  {updatingUserId === user.id && <span className="mr-3 text-muted">Saving…</span>}
                  {user.status === 'PENDING' && (
                    <button className="button-secondary" disabled={updatingUserId === user.id} onClick={() => updateStatus(user, 'ACTIVE')}>Approve</button>
                  )}
                  {user.status === 'ACTIVE' && (
                    <button className="button-secondary" disabled={updatingUserId === user.id} onClick={() => updateStatus(user, 'INACTIVE')}>Deactivate</button>
                  )}
                  {user.status === 'INACTIVE' && (
                    <button className="button-secondary" disabled={updatingUserId === user.id} onClick={() => updateStatus(user, 'ACTIVE')}>Activate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
