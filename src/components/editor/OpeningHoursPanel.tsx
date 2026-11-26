"use client";

import { LinkSimpleIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/Switch";
import { plural } from "@/lib/format";
import type { OpeningDay, SharedContent } from "@/lib/editor";
import { cn } from "@/lib/cn";
import { EditorPanel } from "./EditorPanel";

type OpeningHoursPanelProps = {
  shared: SharedContent;
  days: OpeningDay[];
  onChange: (key: string, days: OpeningDay[]) => void;
};

const timePattern = /^([01]?\d|2[0-3]):[0-5]\d$/;

/** Shared content: opening hours used by the webs of several projects. */
export function OpeningHoursPanel({
  shared,
  days,
  onChange,
}: OpeningHoursPanelProps) {
  const sites = shared.sites.length;

  const setDay = (index: number, key: string, patch: Partial<OpeningDay>) =>
    onChange(
      `hours-${index}-${key}`,
      days.map((day, other) => (other === index ? { ...day, ...patch } : day)),
    );

  return (
    <EditorPanel>
      <div className="-mb-0.5 flex flex-col gap-2.5 rounded-[14px] border border-[#A78BFA40] bg-[#A78BFA14] p-3.5">
        <p className="flex items-center gap-2 font-text text-sm leading-[1.4] font-semibold text-fg">
          <LinkSimpleIcon weight="bold" className="size-[15px] text-ai" />
          Sdílený obsah
        </p>
        <p className="font-text text-xs leading-[1.45] text-fg-2">
          Upravujete jedno místo, změna se ukáže na {sites}{" "}
          {plural(sites, ["webu", "webech", "webech"])}:
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {shared.sites.map((site) => (
            <li
              key={site}
              className="flex h-6 items-center rounded-full bg-control px-[9px] font-text text-xs leading-none font-semibold text-fg-2"
            >
              {site}
            </li>
          ))}
        </ul>
      </div>

      <h1 className="font-title text-[17px] leading-[1.25] font-medium text-fg">
        {shared.name}
      </h1>

      <ul className="-mt-0.5 flex flex-col">
        {days.map((day, index) => (
          <li
            key={day.day}
            className={cn(
              "flex h-11 items-center gap-2.5",
              index > 0 && "border-t border-line-soft",
            )}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate font-text text-[13px] leading-[1.4] font-medium",
                day.open ? "text-fg" : "text-fg-3",
              )}
            >
              {day.day}
            </span>

            {day.open ? (
              <>
                <TimeInput
                  label={`${day.day} od`}
                  value={day.from}
                  onChange={(from) => setDay(index, "from", { from })}
                />
                <span className="font-text text-sm leading-[1.4] text-fg-3">
                  –
                </span>
                <TimeInput
                  label={`${day.day} do`}
                  value={day.to}
                  onChange={(to) => setDay(index, "to", { to })}
                />
              </>
            ) : (
              <span className="font-text text-[13px] leading-[1.4] text-fg-3">
                Zavřeno
              </span>
            )}

            <Switch
              size="sm"
              label={`${day.day}: otevřeno`}
              checked={day.open}
              onChange={(open) => setDay(index, "open", { open })}
            />
          </li>
        ))}
      </ul>
    </EditorPanel>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const invalid = !timePattern.test(value);
  return (
    <input
      value={value}
      aria-label={label}
      aria-invalid={invalid || undefined}
      inputMode="numeric"
      placeholder="9:00"
      title={invalid ? "Zadejte čas jako 9:00" : undefined}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-[30px] w-[62px] shrink-0 rounded-lg border bg-[#F8F6EF08] text-center font-text text-[13px] leading-none text-fg transition-colors outline-none focus:border-beige",
        invalid ? "border-red" : "border-[#D2D5C54D] hover:border-[#D2D5C599]",
      )}
    />
  );
}
