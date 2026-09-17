import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPasswordResetToken } from '@/lib/password-reset';

const genericResponse = () =>
  NextResponse.json({ message: 'If an account exists for that email, a reset link has been sent.' });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  if (!appUrl || !resendApiKey || !fromEmail) {
    return NextResponse.json(
      { error: 'Password reset email is not configured. Set NEXT_PUBLIC_APP_URL, RESEND_API_KEY, and RESEND_FROM_EMAIL.' },
      { status: 503 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return genericResponse();

  const reset = createPasswordResetToken();
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, OR: [{ usedAt: { not: null } }, { expiresAt: { lte: new Date() } }] },
  });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash: reset.tokenHash, expiresAt: reset.expiresAt },
  });

  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(reset.token)}`;
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: fromEmail,
      to: [user.email],
      subject: 'Reset your Care Label Portal password',
      html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in one hour and can only be used once. If you did not request this, you can ignore this email.</p>`,
    }),
  }).catch(() => null);

  if (!emailResponse?.ok) {
    await prisma.passwordResetToken.deleteMany({ where: { tokenHash: reset.tokenHash } });
    return NextResponse.json({ error: 'Unable to send the password reset email. Please try again later.' }, { status: 502 });
  }

  return genericResponse();
}
