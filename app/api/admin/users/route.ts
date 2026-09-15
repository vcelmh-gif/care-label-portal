import { NextResponse } from 'next/server';
import { users } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!name || !email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid name and email are required.' }, { status: 400 });
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const user = {
    id: `u${Date.now()}`,
    name,
    email,
    role: 'CUSTOMER' as const,
    status: 'PENDING' as const,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  users.push(user);

  return NextResponse.json(user, { status: 201 });
}
