import { createHash, randomBytes } from 'crypto';

export const PASSWORD_RESET_TOKEN_LIFETIME_MS = 60 * 60 * 1000;

export function createPasswordResetToken() {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_LIFETIME_MS);

  return { token, tokenHash, expiresAt };
}

export function hashPasswordResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
