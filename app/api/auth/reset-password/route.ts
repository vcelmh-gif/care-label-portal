import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { hashPasswordResetToken } from '@/lib/password-reset';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!token || password.length < 8) {
    return NextResponse.json({ error: 'A valid reset token and password of at least 8 characters are required.' }, { status: 400 });
  }

  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();
  const passwordHash = await hashPassword(password);

  try {
    await prisma.$transaction(async (transaction) => {
      const resetToken = await transaction.passwordResetToken.findUnique({ where: { tokenHash } });
      if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) throw new Error('INVALID_RESET_TOKEN');

      const claimed = await transaction.passwordResetToken.updateMany({
        where: { id: resetToken.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (claimed.count !== 1) throw new Error('INVALID_RESET_TOKEN');

      await transaction.user.update({ where: { id: resetToken.userId }, data: { passwordHash } });
      await transaction.passwordResetToken.updateMany({
        where: { userId: resetToken.userId, id: { not: resetToken.id }, usedAt: null },
        data: { usedAt: now },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_RESET_TOKEN') {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unable to reset your password. Please try again later.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Your password has been reset. You can now sign in.' });
}
