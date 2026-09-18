import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  }

  const settings = await prisma.systemSetting.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const updates = Array.isArray(body?.settings)
    ? body.settings
    : typeof body?.id === 'string' && typeof body?.value === 'string'
      ? [{ id: body.id, value: body.value }]
      : null;
  if (!updates || updates.length === 0 || updates.some((setting: unknown) => {
    if (!setting || typeof setting !== 'object') return true;
    const candidate = setting as { id?: unknown; value?: unknown };
    return typeof candidate.id !== 'string' || !candidate.id || typeof candidate.value !== 'string';
  })) {
    return NextResponse.json({ error: 'Settings must include an ID and string value.' }, { status: 400 });
  }

  const ids = updates.map((setting: { id: string }) => setting.id);
  const existing = await prisma.systemSetting.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (existing.length !== ids.length || new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: 'One or more settings could not be found.' }, { status: 400 });
  }

  const updated = await prisma.$transaction(
    updates.map((setting: { id: string; value: string }) =>
      prisma.systemSetting.update({ where: { id: setting.id }, data: { value: setting.value } }),
    ),
  );
  return NextResponse.json(Array.isArray(body?.settings)
    ? await prisma.systemSetting.findMany({ orderBy: { id: 'asc' } })
    : updated[0]);
}
