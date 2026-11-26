"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BuildingsIcon,
  CheckCircleIcon,
  CircleHalfIcon,
  DesktopIcon,
  LockIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { SaveButton } from "@/components/detail/SaveButton";
import { RoleChip } from "@/components/team/RoleChip";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { FieldShell, SelectInput, TextInput } from "@/components/ui/form/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import { formatDate, plural } from "@/lib/format";
import {
  languageOptions,
  saveAccount,
  signOutOtherSessions,
  type Account,
  type AccountValues,
  type Theme,
} from "@/lib/user";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { SettingRow } from "./SettingRow";

const smallButton =
  "flex h-8 shrink-0 items-center rounded-full border border-line px-3.5 font-text text-[13px] leading-none font-semibold text-fg transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige";

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "auto",
    label: "Automatický",
    icon: <CircleHalfIcon weight="fill" className="size-3.5 shrink-0" />,
  },
  {
    value: "light",
    label: "Světlý",
    icon: <SunIcon weight="fill" className="size-3.5 shrink-0" />,
  },
  {
    value: "dark",
    label: "Tmavý",
    icon: <MoonIcon weight="fill" className="size-3.5 shrink-0" />,
  },
];

type AccountPageProps = {
  account: Account;
  /** Projects the user can open. */
  projects: { slug: string; name: string }[];
};

/** "Můj účet": personal details, password and sessions, look and access. */
export function AccountPage({ account, projects }: AccountPageProps) {
  const [values, setValues] = useState<AccountValues>({
    firstName: account.firstName,
    email: account.email,
    language: account.language,
    theme: account.theme,
  });
  const [otherSessions, setOtherSessions] = useState(account.otherSessions);
  const [signingOut, setSigningOut] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(
    account.passwordChanged,
  );
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveAccount(values),
  );

  function update<K extends keyof AccountValues>(
    key: K,
    value: AccountValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  async function handleSignOutOthers() {
    setSigningOut(true);
    await signOutOtherSessions();
    setOtherSessions(0);
    setSigningOut(false);
  }

  const projectCount = projects.length;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 px-8 pt-7 pb-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 items-center gap-[18px]">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-line bg-control font-text text-2xl leading-none font-medium text-fg">
              {(values.firstName || account.firstName).charAt(0).toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-col gap-1.5">
              <h1 className="font-title text-3xl leading-[1.2] font-medium text-fg">
                Můj účet
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <RoleChip role={account.role} />
                <p className="font-text text-[13px] leading-[1.4] text-fg-3">
                  Přístup {projectCount >= 2 && projectCount <= 4 ? "ke" : "k"}{" "}
                  {projectCount}{" "}
                  {plural(projectCount, ["projektu", "projektům", "projektům"])}{" "}
                  · účet od {formatDate(account.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <SaveButton saving={saving} saved={saved} />
          </div>
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <Card className="flex flex-col gap-[18px] p-6">
              <CardHeader title="Osobní údaje" />
              <div className="flex flex-col gap-4 sm:flex-row">
                <TextInput
                  label="Jméno"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  value={values.firstName}
                  disabled={saving}
                  onChange={(event) => update("firstName", event.target.value)}
                />
                <TextInput
                  label="E-mail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  disabled={saving}
                  onChange={(event) => update("email", event.target.value)}
                />
              </div>
            </Card>

            <Card className="flex flex-col gap-3.5 p-6">
              <CardHeader title="Heslo a přihlášení" />
              <SettingRow
                icon={LockIcon}
                title="Heslo"
                description={`Naposledy změněno ${passwordChanged}`}
                action={
                  <button
                    type="button"
                    className={smallButton}
                    onClick={() => setPasswordOpen(true)}
                  >
                    Změnit heslo
                  </button>
                }
              />
              <SettingRow
                icon={DesktopIcon}
                title="Přihlášená zařízení"
                description={
                  otherSessions === 0
                    ? "Jen tento počítač"
                    : `Tento počítač a ${otherSessions} ${plural(otherSessions, ["další zařízení", "další zařízení", "dalších zařízení"])}`
                }
                action={
                  otherSessions > 0 && (
                    <button
                      type="button"
                      disabled={signingOut}
                      onClick={handleSignOutOthers}
                      className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige disabled:opacity-60"
                    >
                      {signingOut ? "Odhlašuji…" : "Odhlásit ostatní"}
                    </button>
                  )
                }
              />
            </Card>
          </div>

          <div className="flex w-full flex-col gap-5 xl:w-[400px] xl:shrink-0">
            <Card className="flex flex-col gap-[18px] p-6">
              <CardHeader title="Vzhled a jazyk" />
              <SelectInput
                label="Jazyk administrace"
                name="language"
                options={languageOptions}
                value={values.language}
                disabled={saving}
                onChange={(value) => update("language", value)}
              />
              <FieldShell label="Motiv" htmlFor="account-theme">
                {/* Only the dark theme is designed; the choice is just stored. */}
                <SegmentedControl
                  label="Motiv"
                  shape="block"
                  options={themeOptions}
                  value={values.theme}
                  onChange={(theme) => update("theme", theme)}
                />
              </FieldShell>
            </Card>

            <Card className="flex flex-col gap-3 p-6">
              <CardHeader
                title="Přístup"
                description="Roli a projekty vám nastavuje správce."
              />
              <ul className="flex flex-col">
                {projects.map((project) => (
                  <li
                    key={project.slug}
                    className="flex items-center gap-2.5 py-1 font-text text-sm leading-[1.4] font-medium text-fg"
                  >
                    <BuildingsIcon
                      weight="fill"
                      className="size-[15px] shrink-0 text-fg-3"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {project.name}
                    </span>
                    <CheckCircleIcon
                      weight="fill"
                      className="size-3.5 shrink-0 text-fg-3"
                    />
                  </li>
                ))}
              </ul>
            </Card>

            <Link
              href="/login"
              className={cn(
                buttonBase,
                buttonSizes.action,
                buttonVariants.outline,
                "w-full font-semibold",
              )}
            >
              <SignOutIcon weight="fill" className="size-[15px] text-fg-2" />
              Odhlásit se
            </Link>
          </div>
        </div>
      </form>

      {/* Outside of the page form: a form must not contain another one. */}
      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onChanged={() => setPasswordChanged("právě teď")}
      />
    </>
  );
}
