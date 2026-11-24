"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { WarningIcon } from "@phosphor-icons/react";
import { PageIntro } from "@/components/app/PageIntro";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { SelectInput } from "@/components/ui/form/Field";
import { formatDate } from "@/lib/format";
import {
  migrationParts,
  partsSummary,
  runMigration,
  undoMigration,
  type MigrationPart,
  type MigrationRecord,
} from "@/lib/migration";

function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-beige font-text text-xs leading-none font-bold text-beige">
        {number}
      </span>
      <div className="min-w-0 flex-1 pt-1">{children}</div>
    </div>
  );
}

type MigrationPageProps = {
  /** Project the page was opened in; pre-selected as the target. */
  projectSlug: string;
  projects: { slug: string; name: string }[];
  history: MigrationRecord[];
  /** Name written into new history records. */
  authorName: string;
};

/** "Migrace dat": pick source, what to move and target; history on the right. */
export function MigrationPage({
  projectSlug,
  projects,
  history: initialHistory,
  authorName,
}: MigrationPageProps) {
  const [from, setFrom] = useState(
    () => projects.find((project) => project.slug !== projectSlug)?.slug ?? "",
  );
  const [to, setTo] = useState(projectSlug);
  const [parts, setParts] = useState<MigrationPart[]>(["pages", "layout"]);
  const [history, setHistory] = useState(initialHistory);
  const [preview, setPreview] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<MigrationRecord | null>(null);
  const [undoing, setUndoing] = useState<string | null>(null);

  const options = projects.map((project) => ({
    value: project.slug,
    label: `Projekt ${project.name}`,
  }));
  const nameOf = (slug: string) =>
    projects.find((project) => project.slug === slug)?.name ?? "";
  const sameProject = from === to;
  const canRun = !sameProject && parts.length > 0;

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDone(null);
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canRun) return;
    setRunning(true);
    const record = await runMigration({
      fromName: nameOf(from),
      toName: nameOf(to),
      parts,
      author: authorName,
    });
    setHistory((current) => [record, ...current]);
    setRunning(false);
    setPreview(false);
    setDone(record);
  }

  async function handleUndo(record: MigrationRecord) {
    setUndoing(record.id);
    await undoMigration(record.id);
    setHistory((current) => current.filter((item) => item.id !== record.id));
    setUndoing(null);
    if (done?.id === record.id) setDone(null);
  }

  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <PageIntro
        title="Migrace dat"
        description="Přenesení obsahu mezi projekty nebo z jiného webu. Jen pro správce."
      />

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <Card className="min-w-0 flex-1 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
            <Step number={1}>
              <SelectInput
                label="Odkud data vezmeme"
                name="from"
                options={options}
                value={from}
                disabled={running}
                onChange={(event) => change(setFrom)(event.target.value)}
              />
            </Step>

            <Step number={2}>
              <fieldset className="flex flex-col">
                <legend className="pb-2.5 font-text text-sm leading-[1.4] font-medium text-fg">
                  Co chcete přenést
                </legend>
                <ul className="flex flex-col gap-2.5">
                  {migrationParts.map((part) => (
                    <li
                      key={part.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <Checkbox
                        label={part.label}
                        checked={parts.includes(part.id)}
                        disabled={running}
                        onChange={(event) =>
                          change(setParts)(
                            event.target.checked
                              ? [...parts, part.id]
                              : parts.filter((item) => item !== part.id),
                          )
                        }
                      />
                      {part.amount && (
                        <span className="font-text text-[13px] leading-[1.4] text-fg-3">
                          {part.amount}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </fieldset>
            </Step>

            <Step number={3}>
              <SelectInput
                label="Kam data uložíme"
                name="to"
                options={options}
                value={to}
                disabled={running}
                error={
                  sameProject
                    ? "Vyberte jiný projekt, než ze kterého berete data."
                    : undefined
                }
                onChange={(event) => change(setTo)(event.target.value)}
              />
            </Step>

            {done ? (
              <Banner tone="success">
                Přenos {done.fromName} → {done.toName} je hotový. Najdete ho v
                historii, kde ho můžete vrátit zpět.
              </Banner>
            ) : (
              <Banner tone="warning" icon={WarningIcon}>
                Stránky se stejnou adresou se v projektu {nameOf(to)} přepíšou.
                Před přenosem uděláme zálohu, ke které se můžete vrátit.
              </Banner>
            )}

            {/* Not in the design: what "Zobrazit, co se změní" shows. */}
            {preview && canRun && (
              <p className="rounded-xl border border-line-soft bg-inset px-3.5 py-3 font-text text-[13px] leading-[1.45] text-fg-2">
                Z projektu {nameOf(from)} do projektu {nameOf(to)} se přenese:{" "}
                {partsSummary(parts).toLowerCase()}. Podrobný přehled změn
                doplní napojení na server.
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2.5">
              <Button
                variant="outline"
                size="md"
                disabled={!canRun || running}
                onClick={() => setPreview((current) => !current)}
              >
                Zobrazit, co se změní
              </Button>
              <Button
                type="submit"
                size="md"
                disabled={!canRun}
                loading={running}
                loadingLabel="Přenáším…"
              >
                Spustit přenos
              </Button>
            </div>
          </form>
        </Card>

        <Card className="flex w-full flex-col gap-1.5 p-6 xl:w-[360px] xl:shrink-0">
          <h2 className="font-title text-lg leading-[1.4] font-medium text-fg">
            Historie přenosů
          </h2>
          {history.length === 0 && (
            <p className="border-t border-line-soft pt-3 font-text text-[13px] leading-[1.4] text-fg-3">
              Zatím žádný přenos.
            </p>
          )}
          <ul className="flex flex-col">
            {history.map((record) => (
              <li
                key={record.id}
                className="flex flex-col gap-0.5 border-t border-line-soft py-3"
              >
                <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
                  {record.fromName} → {record.toName}
                </p>
                <p className="font-text text-xs leading-[1.4] text-fg-2">
                  {partsSummary(record.parts)}
                </p>
                <div className="flex items-center justify-between gap-3 font-text text-xs leading-[1.4]">
                  <span className="text-fg-3">
                    {formatDate(record.date)} · {record.author}
                  </span>
                  <button
                    type="button"
                    disabled={undoing !== null}
                    onClick={() => handleUndo(record)}
                    className="rounded-md font-semibold text-fg-2 transition-colors enabled:hover:text-fg disabled:opacity-60 focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
                  >
                    {undoing === record.id ? "Vracím…" : "Vrátit zpět"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
