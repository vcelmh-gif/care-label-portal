'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Administration</p>
        <h1 className="mt-2 text-3xl font-semibold">Users</h1>
      </div>

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
                <td className="px-6 py-4"><button className="button-secondary">Approve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
