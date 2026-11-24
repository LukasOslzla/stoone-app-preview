"use client";

import { useSearchParams } from "next/navigation";
import { Banner } from "@/components/ui/Banner";

/**
 * Banner shown on the login screen based on `?reason=`:
 * - `expired` — the session timed out
 * - `password-changed` — the password was just reset
 */
export function LoginNotice() {
  const reason = useSearchParams().get("reason");

  if (reason === "expired") {
    return (
      <Banner tone="warning">
        Z bezpečnostních důvodů jste byli odhlášeni po 30 minutách nečinnosti.
        Přihlaste se prosím znovu.
      </Banner>
    );
  }

  if (reason === "password-changed") {
    return (
      <Banner tone="success">
        Heslo bylo změněno. Přihlaste se novým heslem.
      </Banner>
    );
  }

  return null;
}
