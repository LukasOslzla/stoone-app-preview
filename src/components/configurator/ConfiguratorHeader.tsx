"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CaretDownIcon,
  CheckCircleIcon,
  GlobeIcon,
  QuestionIcon,
  SignOutIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { StooneLogo } from "@/components/StooneLogo";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Modal } from "@/components/ui/Modal";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { languageOptions } from "@/lib/user";

type ConfiguratorHeaderProps = {
  /** Text next to the logo: the app name or the unit being configured. */
  subtitle: string;
  /** Dims the subtitle (app name) or shows it as the page's subject. */
  subtitleTone?: "muted" | "strong";
  /** Save indicator; omit on pages that save nothing. */
  saveState?: "saved" | "saving";
  userName: string;
};

const quietButton =
  "flex items-center gap-1.5 rounded-md font-text text-[13px] leading-[1.4] font-medium text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige";

/** Top bar of the buyers' configurator: brand, save state, language, help, user. */
export function ConfiguratorHeader({
  subtitle,
  subtitleTone = "muted",
  saveState,
  userName,
}: ConfiguratorHeaderProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line-soft px-10 max-md:px-5">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/configurator"
          aria-label="STOONE – vaše jednotky"
          className="shrink-0 rounded-md focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          <StooneLogo className="h-[18px] w-[107.7px] text-beige" />
        </Link>
        <span aria-hidden className="h-[22px] w-px shrink-0 bg-line" />
        <p
          className={`truncate font-text text-sm leading-[1.4] font-medium ${subtitleTone === "strong" ? "text-fg" : "text-fg-2"}`}
        >
          {subtitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[18px]">
        {saveState && (
          <p
            role="status"
            className="flex items-center gap-1.5 font-text text-xs leading-[1.4] text-fg-3 max-md:hidden"
          >
            {saveState === "saving" ? (
              <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
            ) : (
              // "Saved" is one of the few places that use green.
              <CheckCircleIcon weight="fill" className="size-3.5 text-green" />
            )}
            {saveState === "saving" ? "Ukládám…" : "Uloženo"}
          </p>
        )}

        <DropdownMenu
          label="Jazyk"
          align="end"
          width="w-[200px]"
          className="max-md:hidden"
          groups={[
            {
              items: languageOptions.map((language) => ({
                id: language.value,
                label: language.label,
                selected: language.value === "cs",
                disabled: language.value !== "cs",
                note: language.value !== "cs" ? "připravujeme" : undefined,
              })),
            },
          ]}
          trigger={(props) => (
            <button type="button" {...props} className={quietButton}>
              <GlobeIcon weight="fill" className="size-[17px]" />
              Čeština
            </button>
          )}
        />

        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className={`${quietButton} max-md:hidden`}
        >
          <QuestionIcon weight="fill" className="size-[17px]" />
          Nápověda
        </button>

        <DropdownMenu
          label="Uživatel"
          align="end"
          width="w-[200px]"
          groups={[
            {
              items: [
                {
                  id: "sign-out",
                  label: "Odhlásit se",
                  icon: <SignOutIcon weight="fill" />,
                  href: "/login",
                },
              ],
            },
          ]}
          trigger={(props) => (
            <button
              type="button"
              {...props}
              className="flex h-10 items-center gap-2.5 rounded-full border border-line-soft bg-card pr-3 pl-1 transition-colors hover:border-line focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-control font-text text-[13px] leading-none font-bold text-fg">
                {userName.charAt(0)}
              </span>
              <span className="font-text text-[13px] leading-[1.4] font-semibold text-fg">
                {userName}
              </span>
              <CaretDownIcon weight="fill" className="size-[11px] text-fg-3" />
            </button>
          )}
        />
      </div>

      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Jak konfigurace funguje"
        description="Vše se ukládá průběžně, můžete kdykoli odejít a vrátit se."
      >
        <NumberedSteps
          steps={[
            {
              title: "Projděte kroky jeden po druhém",
              text: "V každém vyberete jednu variantu. Standard je v ceně bytu, u nadstandardu vidíte příplatek.",
            },
            {
              title: "Sledujte součet dole",
              text: "Příplatky za nadstandardy se sčítají průběžně.",
            },
            {
              title: "Konfiguraci uzavřete do termínu",
              text: "Termín je u každé jednotky zvlášť. Po uzavření už změny řeší vaše prodejkyně.",
            },
          ]}
        />
        <div className="flex justify-end">
          <Button size="md" onClick={() => setHelpOpen(false)}>
            Rozumím
          </Button>
        </div>
      </Modal>
    </header>
  );
}
