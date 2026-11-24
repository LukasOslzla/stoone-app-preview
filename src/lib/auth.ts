/**
 * Auth client.
 *
 * MOCK IMPLEMENTATION — replace the bodies of `signIn` and
 * `requestPasswordReset` with real API calls. The UI only depends on the
 * result types below.
 *
 * Mock behaviour: any password with at least 8 characters signs in;
 * a shorter one counts as wrong credentials, and the third failure
 * locks the account (until the page is reloaded).
 */

export const LOCK_MINUTES = 15;
const MAX_ATTEMPTS = 3;

export type SignInResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; attemptsLeft: number }
  | { ok: false; reason: "locked"; minutes: number };

let failedAttempts = 0;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  void email;
  await wait(900);

  if (failedAttempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "locked", minutes: LOCK_MINUTES };
  }

  if (password.length >= 8) {
    failedAttempts = 0;
    return { ok: true };
  }

  failedAttempts += 1;
  if (failedAttempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "locked", minutes: LOCK_MINUTES };
  }
  return {
    ok: false,
    reason: "invalid",
    attemptsLeft: MAX_ATTEMPTS - failedAttempts,
  };
}

export async function requestPasswordReset(email: string): Promise<void> {
  void email;
  await wait(900);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}
