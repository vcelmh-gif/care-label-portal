import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export type MasterDataResource = 'countries' | 'fibers' | 'care-texts' | 'care-symbols';

function denied() {
  return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
}

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

export function masterDataHandlers(resource: MasterDataResource) {
  const GET = async () => {
    if (!(await requireAdmin())) return denied();
    const records =
      resource === 'countries' ? await prisma.country.findMany({ orderBy: { name: 'asc' } }) :
      resource === 'fibers' ? await prisma.fiber.findMany({ orderBy: { name: 'asc' } }) :
      resource === 'care-texts' ? await prisma.careText.findMany({ orderBy: { text: 'asc' } }) :
      await prisma.careSymbol.findMany({ orderBy: { code: 'asc' } });
    return NextResponse.json(records);
  };

  const POST = async (request: Request) => {
    if (!(await requireAdmin())) return denied();
    const body = await request.json().catch(() => null);
    const value = resource === 'care-symbols' ? String(body?.code ?? '').trim() : String(body?.value ?? '').trim();
    const description = String(body?.description ?? '').trim();
    const imagePath = String(body?.imagePath ?? '').trim();
    if (!value || (resource === 'care-symbols' && (!description || !imagePath))) {
      return NextResponse.json({ error: resource === 'care-symbols' ? 'Code, description, and image path are required.' : 'A value is required.' }, { status: 400 });
    }
    try {
      const record =
        resource === 'countries' ? await prisma.country.create({ data: { name: value } }) :
        resource === 'fibers' ? await prisma.fiber.create({ data: { name: value } }) :
        resource === 'care-texts' ? await prisma.careText.create({ data: { text: value } }) :
        await prisma.careSymbol.create({ data: { code: value, description, imagePath } });
      return NextResponse.json(record, { status: 201 });
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'P2002') return NextResponse.json({ error: 'That value already exists.' }, { status: 409 });
      throw error;
    }
  };

  const PATCH = async (request: Request) => {
    if (!(await requireAdmin())) return denied();
    const body = await request.json().catch(() => null);
    const id = typeof body?.id === 'string' ? body.id : '';
    if (!id) return NextResponse.json({ error: 'A valid record ID is required.' }, { status: 400 });
    const data: { name?: string; text?: string; code?: string; description?: string; imagePath?: string; isActive?: boolean } = {};
    if (typeof body?.value === 'string') {
      const value = body.value.trim();
      if (!value) return NextResponse.json({ error: 'A value is required.' }, { status: 400 });
      if (resource === 'countries' || resource === 'fibers') data.name = value;
      else if (resource === 'care-texts') data.text = value;
      else data.code = value;
    }
    if (resource === 'care-symbols') {
      if (typeof body?.description === 'string' && body.description.trim()) data.description = body.description.trim();
      if (typeof body?.imagePath === 'string' && body.imagePath.trim()) data.imagePath = body.imagePath.trim();
    }
    if (typeof body?.isActive === 'boolean') data.isActive = body.isActive;
    if (!Object.keys(data).length) return NextResponse.json({ error: 'No changes supplied.' }, { status: 400 });
    try {
      const record =
        resource === 'countries' ? await prisma.country.update({ where: { id }, data }) :
        resource === 'fibers' ? await prisma.fiber.update({ where: { id }, data }) :
        resource === 'care-texts' ? await prisma.careText.update({ where: { id }, data }) :
        await prisma.careSymbol.update({ where: { id }, data });
      return NextResponse.json(record);
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'P2002') return NextResponse.json({ error: 'That value already exists.' }, { status: 409 });
      if ((error as { code?: string }).code === 'P2025') return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
      throw error;
    }
  };

  return { GET, POST, PATCH };
}
