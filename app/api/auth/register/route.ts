import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!name || !companyName || !email.includes('@') || password.length < 8) {
    return NextResponse.json({ error: 'A valid name, company, email, and password of at least 8 characters are required.' }, { status: 400 });
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }
  const user = await prisma.user.create({
    data: { id: `u${Date.now()}`, name, companyName, email, passwordHash: await hashPassword(password), role: 'CUSTOMER', status: 'PENDING' },
  });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }, { status: 201 });
}
