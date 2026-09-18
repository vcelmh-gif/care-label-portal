import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(users.map(({ passwordHash: _passwordHash, ...user }) => ({
    ...user,
    createdAt: user.createdAt.toISOString().slice(0, 10),
  })));
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!name || !companyName || !email || !email.includes('@') || password.length < 8) {
    return NextResponse.json({ error: 'A valid name, company, email, and password of at least 8 characters are required.' }, { status: 400 });
  }

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      id: `u${Date.now()}`,
      name,
      companyName,
      email,
      passwordHash: await hashPassword(password),
      role: 'CUSTOMER',
      status: 'PENDING',
    },
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return NextResponse.json({ ...safeUser, createdAt: user.createdAt.toISOString().slice(0, 10) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userId = typeof body?.userId === 'string' ? body.userId : '';
  const hasStatus = body?.status !== undefined;
  const hasRole = body?.role !== undefined;
  const status = body?.status as 'ACTIVE' | 'INACTIVE' | undefined;
  const role = body?.role as 'ADMIN' | 'CUSTOMER' | undefined;
  if (!userId || (!hasStatus && !hasRole)) {
    return NextResponse.json({ error: 'A valid user ID and status or role are required.' }, { status: 400 });
  }
  if ((hasStatus && !['ACTIVE', 'INACTIVE'].includes(status ?? '')) || (hasRole && !['ADMIN', 'CUSTOMER'].includes(role ?? ''))) {
    return NextResponse.json({ error: 'A valid user ID and status or role are required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  if (userId === currentUser.id && status === 'INACTIVE') {
    return NextResponse.json({ error: 'You cannot deactivate your own administrator account.' }, { status: 400 });
  }

  const resultingRole = role ?? user.role;
  const resultingStatus = status ?? user.status;
  const removesActiveAdmin = user.role === 'ADMIN' && user.status === 'ACTIVE'
    && (resultingRole !== 'ADMIN' || resultingStatus !== 'ACTIVE');
  if (removesActiveAdmin) {
    const activeAdminCount = await prisma.user.count({ where: { role: 'ADMIN', status: 'ACTIVE' } });
    if (activeAdminCount <= 1) {
      return NextResponse.json({ error: 'At least one active administrator must remain.' }, { status: 400 });
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(hasStatus ? { status } : {}),
      ...(hasRole ? { role } : {}),
    },
  });
  const { passwordHash: _passwordHash, ...safeUser } = updatedUser;
  return NextResponse.json({ ...safeUser, createdAt: updatedUser.createdAt.toISOString().slice(0, 10) });
}
