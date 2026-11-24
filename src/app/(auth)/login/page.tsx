import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginNotice } from "@/components/auth/LoginNotice";

export const metadata: Metadata = {
  title: "Přihlášení",
};

export default function LoginPage() {
  return (
    <LoginForm
      notice={
        <Suspense fallback={null}>
          <LoginNotice />
        </Suspense>
      }
    />
  );
}
