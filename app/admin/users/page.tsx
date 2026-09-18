'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch(() => setError('Unable to load users.'));
  }, []);

  async function updateStatus(user: User, status: 'ACTIVE' | 'INACTIVE') {
    setError('');
    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Unable to update user status.');
      return;
    }
    setUsers((current) => current.map((item) => item.id === user.id ? data : item));
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
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4"><span className="badge">{user.status}</span></td>
                <td className="px-6 py-4">{user.createdAt}</td>
                <td className="px-6 py-4">
                  {user.status === 'PENDING' && (
                    <button className="button-secondary" onClick={() => updateStatus(user, 'ACTIVE')}>Approve</button>
                  )}
                  {user.status === 'ACTIVE' && (
                    <button className="button-secondary" onClick={() => updateStatus(user, 'INACTIVE')}>Deactivate</button>
                  )}
                  {user.status === 'INACTIVE' && (
                    <button className="button-secondary" onClick={() => updateStatus(user, 'ACTIVE')}>Activate</button>
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
