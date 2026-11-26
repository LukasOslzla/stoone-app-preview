"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EnvelopeSimpleOpenIcon } from "@phosphor-icons/react";
import { AuthHeading, authLinkClass } from "@/components/auth/AuthHeading";
import {
  Button,
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { isValidEmail, requestPasswordReset } from "@/lib/auth";
import { cn } from "@/lib/cn";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function send(address: string) {
    setLoading(true);
    await requestPasswordReset(address);
    setLoading(false);
    setSentTo(address);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Zadejte platnou e-mailovou adresu.");
      return;
    }
    await send(email.trim());
  }

  if (sentTo) {
    return (
      <>
        <AuthHeading
          icon={
            <div className="flex size-16 items-center justify-center rounded-full border border-[#6FD13C59] bg-[#6FD13C1A]">
              <EnvelopeSimpleOpenIcon
                weight="fill"
                className="size-7 text-green"
              />
            </div>
          }
          title="Zkontrolujte e-mail"
          subtitle={
            <>
              Poslali jsme odkaz na <span className="break-all">{sentTo}</span>.
              Odkaz je platný 30 minut.
            </>
          }
        />

        <a
          href="mailto:"
          className={cn(buttonBase, buttonSizes.lg, buttonVariants.outline)}
        >
          Otevřít e-mailovou schránku
        </a>

        <p className="flex gap-1.5 font-text text-[13px] leading-[1.4] text-fg-3">
          Nepřišel e-mail?
          <button
            type="button"
            disabled={loading}
            onClick={() => send(sentTo)}
            className="rounded-md font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige disabled:opacity-50"
          >
            {loading ? "Odesílám…" : "Odeslat znovu"}
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        title="Obnovení hesla"
        subtitle="Zadejte e-mail k účtu a pošleme vám odkaz pro nastavení nového hesla."
      />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-9"
      >
        <TextField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="jmeno@firma.cz"
          value={email}
          disabled={loading}
          error={error}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(undefined);
          }}
        />

        <Button type="submit" loading={loading} loadingLabel="Odesílám…">
          Odeslat odkaz
        </Button>
      </form>

      <Link
        href="/login"
        className={cn(authLinkClass, "flex items-center gap-1.5 font-semibold")}
      >
        <ArrowLeftIcon weight="fill" className="size-4" />
        Zpět na přihlášení
      </Link>
    </>
  );
}
