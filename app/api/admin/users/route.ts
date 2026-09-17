import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString().slice(0, 10) })));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!name || !email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid name and email are required.' }, { status: 400 });
  }

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'CUSTOMER',
      status: 'PENDING',
    },
  });

  return NextResponse.json({ ...user, createdAt: user.createdAt.toISOString().slice(0, 10) }, { status: 201 });
}
