"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthHeading, authLinkClass } from "@/components/auth/AuthHeading";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { isValidEmail, signIn } from "@/lib/auth";
import { cn } from "@/lib/cn";

type FieldErrors = { email?: string; password?: string };

type AuthError =
  | { kind: "invalid"; attemptsLeft: number }
  | { kind: "locked"; minutes: number };

function attemptsWarning(attemptsLeft: number) {
  if (attemptsLeft === 1) {
    return "Po dalším neúspěšném pokusu";
  }
  return `Po dalších ${attemptsLeft} neúspěšných pokusech`;
}

type LoginFormProps = {
  /** Banner driven by the URL (session expired, password changed…). */
  notice?: ReactNode;
  /** Where to go after a successful sign-in. */
  redirectTo?: string;
};

export function LoginForm({
  notice,
  redirectTo = "/overview",
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: FieldErrors = {};
    if (!isValidEmail(email)) {
      errors.email = "Zadejte platnou e-mailovou adresu.";
    }
    if (!password) {
      errors.password = "Zadejte heslo.";
    }
    setFieldErrors(errors);
    if (errors.email || errors.password) {
      return;
    }

    setAuthError(null);
    setLoading(true);
    const result = await signIn(email.trim(), password);

    if (result.ok) {
      router.push(redirectTo);
      return;
    }

    setLoading(false);
    setAuthError(
      result.reason === "locked"
        ? { kind: "locked", minutes: result.minutes }
        : { kind: "invalid", attemptsLeft: result.attemptsLeft },
    );
  }

  return (
    <>
      <AuthHeading title="Přihlášení do STOONE" />

      {authError?.kind === "invalid" && (
        <Banner tone="error">
          Nesprávný e-mail nebo heslo. {attemptsWarning(authError.attemptsLeft)}{" "}
          bude účet na 15 minut zablokován.
        </Banner>
      )}
      {authError?.kind === "locked" && (
        <Banner tone="locked">
          Účet je dočasně zablokován. Zkuste to za {authError.minutes} minut.
        </Banner>
      )}
      {!authError && notice}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-9"
      >
        <div className="flex w-full flex-col gap-5">
          <TextField
            label="E-mail"
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            placeholder="jmeno@firma.cz"
            value={email}
            disabled={loading}
            error={fieldErrors.email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
          />
          <PasswordField
            label="Heslo"
            name="password"
            autoComplete="current-password"
            placeholder="Zadejte heslo"
            value={password}
            disabled={loading}
            error={fieldErrors.password}
            invalid={authError?.kind === "invalid"}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }));
            }}
          />
          <div
            className={cn(
              "flex w-full justify-end",
              loading && "pointer-events-none opacity-40",
            )}
          >
            <Link
              href="/forgot-password"
              tabIndex={loading ? -1 : undefined}
              className={cn(authLinkClass, "font-medium")}
            >
              Zapomenuté heslo?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading} loadingLabel="Přihlašuji…">
          Přihlásit se
        </Button>
      </form>
    </>
  );
}
