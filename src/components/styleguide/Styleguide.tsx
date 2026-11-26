"use client";

import { useState } from "react";
import {
  BuildingsIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  InfoIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
  SquaresFourIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { ChangePasswordDialog } from "@/components/account/ChangePasswordDialog";
import { AiPrompt } from "@/components/app/AiPrompt";
import { PageIntro } from "@/components/app/PageIntro";
import { LanguageMenu } from "@/components/app/sidebar/LanguageMenu";
import { ThemeSwitcher } from "@/components/app/ThemeSwitcher";
import { MenuItemsEditor } from "@/components/editor/MenuItemsEditor";
import { NotificationSettingsDialog } from "@/components/notifications/NotificationSettingsDialog";
import { RangeSelect, dateRanges } from "@/components/project/RangeSelect";
import { RealpadSyncPill } from "@/components/project/RealpadSync";
import { StooneLogo } from "@/components/StooneLogo";
import {
  AiSuggestionCard,
  type AiSuggestion,
} from "@/components/seo/AiSuggestionCard";
import { ShareImageField } from "@/components/seo/ShareImageField";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { AiSuggestButton } from "@/components/ui/AiSuggestButton";
import { Banner } from "@/components/ui/Banner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { CheckCard } from "@/components/ui/CheckCard";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  DataTable,
  sortRows,
  type DataTableColumn,
  type SortState,
} from "@/components/ui/DataTable";
import { DeltaBadge } from "@/components/ui/DeltaBadge";
import { DetailRows } from "@/components/ui/DetailRows";
import { DotPill } from "@/components/ui/DotPill";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { FormDialog } from "@/components/ui/FormDialog";
import { Disclosure } from "@/components/ui/Disclosure";
import { Dropzone } from "@/components/ui/Dropzone";
import { EmptyState } from "@/components/ui/EmptyState";
import { InfoStrip } from "@/components/ui/InfoStrip";
import { LogoTile } from "@/components/ui/LogoTile";
import { Modal } from "@/components/ui/Modal";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { Pagination } from "@/components/ui/Pagination";
import { PillSteps } from "@/components/ui/PillSteps";
import { ProgressTicks } from "@/components/ui/ProgressTicks";
import { PrevNext } from "@/components/ui/PrevNext";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  Skeleton,
  SkeletonCards,
  SkeletonRows,
} from "@/components/ui/Skeleton";
import { SortableList } from "@/components/ui/SortableList";
import { StatusChip } from "@/components/ui/StatusChip";
import { Stepper } from "@/components/ui/Stepper";
import { Switch } from "@/components/ui/Switch";
import { SwitchRow } from "@/components/ui/SwitchRow";
import { TabNav } from "@/components/ui/TabNav";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { SelectInput, TextArea, TextInput } from "@/components/ui/form/Field";
import { TagsInput } from "@/components/ui/form/TagsInput";
import { formatPrice } from "@/lib/format";
import { defaultNotificationSettings } from "@/lib/notifications";
import { unitStatuses, type UnitStatus } from "@/lib/unit-status";
import { BothThemes, Chapter, Demo, Row } from "./Showcase";

const chapters = [
  ["tokens", "Barvy a písmo"],
  ["themes", "Světlý a tmavý režim"],
  ["buttons", "Tlačítka"],
  ["forms", "Formuláře"],
  ["choices", "Výběr a filtry"],
  ["navigation", "Navigace"],
  ["status", "Stavy a hlášky"],
  ["data", "Data a karty"],
  ["states", "Prázdné stavy a načítání"],
  ["overlays", "Dialogy a nabídky"],
  ["ai", "AI"],
] as const;

/** Tokens from `src/app/globals.css`: dark value, light value, purpose. */
const colors: { name: string; dark: string; light: string; use: string }[] = [
  {
    name: "bg",
    dark: "#151519",
    light: "#E9E6DF",
    use: "pozadí, postranní menu",
  },
  { name: "panel", dark: "#151519", light: "#F2F1ED", use: "hlavní plocha" },
  { name: "card", dark: "#1E1E23", light: "#FFFFFF8C", use: "karty" },
  {
    name: "popover",
    dark: "#1E1E23",
    light: "#FFFFFF",
    use: "nabídky, dialogy",
  },
  { name: "inset", dark: "#0F0F12", light: "#EAE8E2", use: "zapuštěné plochy" },
  {
    name: "control",
    dark: "#2A2A30",
    light: "#E1DDD4",
    use: "aktivní přepínače, štítky",
  },
  {
    name: "field",
    dark: "#F8F6EF08",
    light: "#FFFFFF",
    use: "výplň formulářových polí",
  },
  { name: "line", dark: "#D2D5C533", light: "#2A231A2E", use: "ohraničení" },
  {
    name: "line-soft",
    dark: "#D2D5C524",
    light: "#2A231A1A",
    use: "jemné oddělovače",
  },
  { name: "fg", dark: "#F8F6EF", light: "#231E18", use: "hlavní text" },
  {
    name: "fg-2",
    dark: "#D2D5C5B3",
    light: "#231E18B8",
    use: "doplňkový text",
  },
  {
    name: "fg-3",
    dark: "#D2D5C573",
    light: "#231E188F",
    use: "popisky, nápověda",
  },
  {
    name: "beige",
    dark: "#CAC3B8",
    light: "#231E18",
    use: "hlavní akce, výběr",
  },
  {
    name: "ink",
    dark: "#1C1A18",
    light: "#FFFFFF",
    use: "text na hlavní akci",
  },
  { name: "tint", dark: "#FFFFFF", light: "#231E18", use: "hover: bg-tint/5" },
  {
    name: "mist",
    dark: "#D2D5C5",
    light: "#231E18",
    use: "okraje s průhledností",
  },
  {
    name: "copper",
    dark: "#CA9377",
    light: "#D0AE8F",
    use: "rezervováno, grafy",
  },
  {
    name: "brick",
    dark: "#8E3C39",
    light: "#8E3C39",
    use: "tmavě červený akcent",
  },
  { name: "green", dark: "#6FD13C", light: "#2F8F0E", use: "úspěch, volné" },
  {
    name: "yellow",
    dark: "#F2C94C",
    light: "#A87700",
    use: "upozornění, koncept",
  },
  { name: "red", dark: "#F0524B", light: "#D93A33", use: "chyba, smazání" },
  { name: "ai", dark: "#B3A2FF", light: "#6D4FE0", use: "AI a sdílený obsah" },
];

type DemoUnit = { id: string; name: string; status: UnitStatus; price: number };

const units: DemoUnit[] = [
  { id: "a101", name: "A.101", status: "free", price: 6946000 },
  { id: "a102", name: "A.102", status: "reserved", price: 8120000 },
  { id: "a103", name: "A.103", status: "sold", price: 5390000 },
];

const suggestion: AiSuggestion = {
  text: "Momentum Smíchov | Vybavené byty u metra Anděl",
  reason: "46 znaků, zobrazí se celý.",
};

/**
 * Styleguide for developers: design tokens and every shared component from
 * `src/components/ui` with its variants. All examples are live.
 */
export function Styleguide() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("dark");
  const [chip, setChip] = useState("all");
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [cards, setCards] = useState({ a: true, b: false });
  const [tags, setTags] = useState(["RD01", "RD02"]);
  const [page, setPage] = useState(2);
  const [sort, setSort] = useState<SortState | null>(null);
  const [modal, setModal] = useState<
    "modal" | "confirm" | "form" | "password" | "notifications" | null
  >(null);
  const [items, setItems] = useState([
    { id: "1", label: "O projektu" },
    { id: "2", label: "Lokalita" },
    { id: "3", label: "Ceník" },
  ]);
  const [files, setFiles] = useState<string | null>(null);
  const [demoRange, setDemoRange] = useState("30d");
  const [saleStatus, setSaleStatus] = useState("sale");
  const [substep, setSubstep] = useState("3");
  const [tableState, setTableState] = useState<"data" | "loading" | "empty">(
    "data",
  );
  const [notificationSettings, setNotificationSettings] = useState(
    defaultNotificationSettings,
  );
  const [shareImage, setShareImage] = useState<{
    title: string;
    note: string;
    url?: string;
  }>({
    title: "og.webp",
    note: "1200 × 630 px · správná velikost",
    url: "/images/momentum-og.webp",
  });

  const columns: DataTableColumn<DemoUnit>[] = [
    {
      id: "name",
      header: "Byt",
      sortValue: (unit) => unit.name,
      cell: (unit) => (
        <span className="text-sm font-semibold text-fg">{unit.name}</span>
      ),
    },
    {
      id: "status",
      header: "Stav",
      width: "w-[150px]",
      cell: (unit) => <StatusChip status={unit.status} />,
    },
    {
      id: "price",
      header: "Cena",
      width: "w-[140px]",
      align: "right",
      sortValue: (unit) => unit.price,
      cell: (unit) => formatPrice(unit.price),
    },
  ];

  return (
    <div className="flex min-h-dvh bg-bg">
      <aside className="sticky top-0 flex h-dvh w-[232px] shrink-0 flex-col gap-7 border-r border-line-soft px-5 py-7 max-lg:hidden">
        <StooneLogo className="h-[18px] w-[107.7px] text-beige" />
        <nav aria-label="Kapitoly" className="flex flex-col gap-0.5">
          {chapters.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-lg px-3 py-2 font-text text-sm leading-[1.4] font-medium text-fg-2 transition-colors hover:bg-tint/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-12 px-8 py-9 pb-24">
        <div className="flex justify-end">
          <ThemeSwitcher />
        </div>
        <PageIntro
          title="Styleguide"
          description="Přehled barev, písma a sdílených komponent aplikace STOONE. Ukázky jsou živé – používají stejný kód jako obrazovky. U každé komponenty je cesta, odkud se importuje; podrobný popis vlastností je v komentářích u typů ve zdrojovém souboru."
        />

        <Chapter
          id="tokens"
          title="Barvy a písmo"
          description="Tokeny jsou v src/app/globals.css: blok @theme je tmavý režim, [data-theme=light] ho přepisuje. V kódu se používají jen přes třídy (bg-card, text-fg-2, border-line, bg-beige/15), nikdy jako hex – jinak se rozbije druhý režim. U každé barvy je hodnota tmavá / světlá."
        >
          <Demo name="Barvy" source="src/app/globals.css" wide>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
              {colors.map((color) => (
                <li key={color.name} className="flex items-center gap-3">
                  <span
                    className="size-10 shrink-0 rounded-[10px] border border-line"
                    style={{ backgroundColor: `var(--color-${color.name})` }}
                  />
                  <span className="flex min-w-0 flex-col">
                    <code className="font-mono text-xs leading-[1.4] text-fg">
                      {color.name}
                    </code>
                    <span className="truncate font-text text-xs leading-[1.4] text-fg-3">
                      {color.dark} / {color.light} · {color.use}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Demo>

          <Demo
            name="Písmo"
            note={
              <>
                Nadpisy <code>font-title</code> (Lexend, medium), texty a
                ovládací prvky <code>font-text</code> (Hanken Grotesk).
              </>
            }
          >
            <p className="font-title text-3xl leading-[1.2] font-medium text-fg">
              Nadpis stránky · 30
            </p>
            <p className="font-title text-2xl leading-[1.2] font-medium text-fg">
              Nadpis dialogu · 24
            </p>
            <p className="font-title text-lg leading-[1.25] font-medium text-fg">
              Nadpis karty · 18
            </p>
            <p className="font-text text-sm leading-[1.4] text-fg-2">
              Běžný text · 14 · text-fg-2
            </p>
            <p className="font-text text-[13px] leading-[1.4] text-fg-3">
              Nápověda · 13 · text-fg-3
            </p>
            <p className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
              Popisek skupiny · 11
            </p>
          </Demo>

          <Demo
            name="Povrchy"
            note={
              <>
                Utility s přechodem, které nejdou složit z běžných tříd:{" "}
                <code>surface-card</code>, <code>surface-ai</code>,{" "}
                <code>bg-ai-gradient</code>.
              </>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="surface-card flex h-20 items-center justify-center rounded-2xl font-mono text-xs text-fg-2">
                surface-card
              </div>
              <div className="surface-ai flex h-20 items-center justify-center rounded-2xl font-mono text-xs text-fg-2">
                surface-ai
              </div>
              <div className="bg-ai-gradient flex h-20 items-center justify-center rounded-2xl font-mono text-xs text-white">
                bg-ai-gradient
              </div>
            </div>
            <Row label="Logo projektu">
              <LogoTile text="momentum" />
              <LogoTile text="momentum" size="lg" />
              <LogoTile text="brique" muted />
            </Row>
          </Demo>
        </Chapter>

        <Chapter
          id="themes"
          title="Světlý a tmavý režim"
          description="Režim se přepíná atributem data-theme na <html> (lib/theme: setTheme, useTheme). Tmavý je výchozí; světlý používá paletu „By Detailist“. Ukázky níže jsou vždy dvakrát – tmavě a světle – bez ohledu na to, jaký režim máte zapnutý."
        >
          <Demo name="Pravidla světlého režimu" wide>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 font-text text-sm leading-[1.5] text-fg-2">
              <li>
                <strong className="text-fg">Plochy:</strong> postranní menu má{" "}
                <code>bg</code>, obsah <code>panel</code> s levou linkou{" "}
                <code>line-soft</code>.
              </li>
              <li>
                <strong className="text-fg">Karty</strong> jsou poloprůhledná
                bílá (<code>card</code>, 55 %) s jemným přechodem camel do rohu
                a bez stínů.
              </li>
              <li>
                <strong className="text-fg">Bílé jsou</strong> formulářová pole,
                hledání, nabídky, dialogy a náhledy Googlu a sdílení (
                <code>field</code>, <code>popover</code>, <code>paper</code>).
              </li>
              <li>
                <strong className="text-fg">Akcent = inkoust:</strong> vše, co
                je v tmavém režimu béžové (hlavní tlačítko, aktivní položka
                menu, výběr, aktuální krok), je ve světlém <code>#231E18</code>,
                podklady s průhledností (<code>bg-beige/15</code>).
              </li>
              <li>
                <strong className="text-fg">
                  Zelená znamená jen „hotovo“:
                </strong>{" "}
                dokončený krok, hotový podkrok, „Uloženo“ a stavy typu Volné /
                Dokončeno. Fajfka vybrané karty a štítek „Standard“ zůstávají
                neutrální.
              </li>
              <li>
                <strong className="text-fg">Grafy:</strong> měděné tóny se ve
                světlém mění na camel a olive, křivka návštěvnosti je slate.
              </li>
            </ul>
          </Demo>

          <Demo
            name="Doplňkové barvy"
            note={
              <>
                Stejné v obou režimech: <code>camel</code>, <code>olive</code>,{" "}
                <code>slate</code>. Camel tónuje karty a začíná průběh, olive
                průběh končí a nahrazuje tmavou měď, slate je křivka hlavního
                grafu.
              </>
            }
          >
            <ul className="grid grid-cols-3 gap-3">
              {[
                ["camel", "#D0AE8F"],
                ["olive", "#6E6351"],
                ["slate", "#32424B"],
              ].map(([name, hex]) => (
                <li key={name} className="flex flex-col gap-2">
                  <span
                    className="h-14 rounded-xl border border-line"
                    style={{ backgroundColor: `var(--color-${name})` }}
                  />
                  <code className="font-mono text-xs text-fg">{name}</code>
                  <span className="font-text text-xs text-fg-3">{hex}</span>
                </li>
              ))}
            </ul>
          </Demo>

          <Demo
            name="Průběh a pilulky podkroků"
            source="ui/ProgressTicks, ui/PillSteps"
            note="Průběh: přechod béžová → měď (tmavý) a camel → olive (světlý). Pilulky se při nedostatku místa posouvají do strany: okraj se ztrácí a přibude kulatá šipka; po posunutí i šipka vlevo."
          >
            <BothThemes>
              <div className="flex flex-col gap-4">
                <ProgressTicks percent={62} label="Ukázka průběhu" />
                <PillSteps
                  label="Podkroky"
                  value={substep}
                  onChange={setSubstep}
                  steps={[
                    { id: "1", label: "4.1 Dlažba", done: true },
                    { id: "2", label: "4.2 Obklad", done: true },
                    { id: "3", label: "4.3 Umyvadlo" },
                    { id: "4", label: "4.4 Baterie" },
                    { id: "5", label: "4.5 Sprchový kout" },
                  ]}
                />
              </div>
            </BothThemes>
          </Demo>

          <Demo
            name="Karta, pole, hlavní tlačítko, štítek"
            source="ui/Card, ui/form/Field, ui/Button, ui/DotPill"
            wide
          >
            <BothThemes>
              <Card className="flex flex-col gap-4 p-5">
                <CardHeader
                  title="Základní údaje"
                  action={
                    <DotPill
                      label="Volné"
                      color="var(--color-green)"
                      tone="tinted"
                    />
                  }
                />
                <TextInput label="Cena" defaultValue="6 946 000" suffix="Kč" />
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button size="md">Uložit změny</Button>
                  <Button size="md" variant="outline">
                    Zrušit
                  </Button>
                  <DotPill label="Koncept" color="var(--color-yellow)" />
                </div>
              </Card>
            </BothThemes>
          </Demo>

          <Demo
            name="Stepper – pilulky, položka Jazyk"
            source="ui/Stepper, app/sidebar/LanguageMenu"
            note={
              <>
                <code>Stepper variant=&quot;pills&quot;</code> používá
                konfigurátor; hotové kroky mají zelenou fajfku. Jazyk je řádek v
                postranním menu pod Notifikacemi.
              </>
            }
            wide
          >
            <BothThemes>
              <div className="flex flex-col gap-4">
                <Stepper
                  variant="pills"
                  steps={["Podlahy", "Dveře", "Koupelna"]}
                  current={1}
                />
                <div className="w-[220px] max-w-full">
                  <LanguageMenu />
                </div>
              </div>
            </BothThemes>
          </Demo>
        </Chapter>

        <Chapter id="buttons" title="Tlačítka">
          <Demo
            name="Button"
            source="ui/Button"
            note={
              <>
                <code>variant</code>: primary · outline · danger.{" "}
                <code>size</code>: lg (přihlášení, na celou šířku) · action (44
                px) · md (40 px). <code>loading</code> zobrazí spinner a
                tlačítko zamkne.
              </>
            }
          >
            <Row label="Varianty">
              <Button size="md">Uložit změny</Button>
              <Button size="md" variant="outline">
                Zrušit
              </Button>
              <Button size="md" variant="danger">
                Smazat soubor
              </Button>
            </Row>
            <Row label="Stavy">
              <Button size="md" loading loadingLabel="Ukládám…">
                Uložit
              </Button>
              <Button size="md" disabled>
                Nedostupné
              </Button>
              <Button size="action">
                <PlusCircleIcon weight="fill" className="size-4" />
                Přidat byty
              </Button>
            </Row>
            <div className="max-w-[360px]">
              <Button>Přihlásit se</Button>
            </div>
          </Demo>

          <Demo
            name="AiSuggestButton"
            source="ui/AiSuggestButton"
            note="Malé tlačítko s AI přechodem k formulářovým polím."
          >
            <Row>
              <AiSuggestButton />
              <AiSuggestButton label="Navrhnout" />
              <AiSuggestButton loading />
            </Row>
          </Demo>
        </Chapter>

        <Chapter
          id="forms"
          title="Formuláře"
          description="Pole v administraci jsou v ui/form/Field (48 px, kompaktní 42 px pro úzké panely). Přihlašovací obrazovky používají větší ui/TextField (56 px)."
        >
          <Demo
            name="TextInput · SelectInput · TextArea"
            source="ui/form/Field"
            note={
              <>
                Společné: <code>label</code>, <code>hint</code>,{" "}
                <code>error</code>, <code>size</code> (md · sm),{" "}
                <code>action</code> (prvek vpravo od popisku).
              </>
            }
          >
            <TextInput label="Plocha" defaultValue="64,5" suffix="m²" />
            <TextInput
              label="Cena"
              defaultValue="abc"
              error="Zadejte číslo"
              suffix="Kč"
            />
            <SelectInput
              label="Dispozice"
              hint="Podle projektové dokumentace"
              defaultValue="2kk"
              options={[
                { value: "2kk", label: "2+kk" },
                { value: "3kk", label: "3+kk" },
              ]}
            />
            <TextArea label="Popis" defaultValue="Světlý byt s lodžií." />
          </Demo>

          <Demo
            name="SelectInput"
            source="ui/form/Field"
            note={
              <>
                Vlastní seznam místo systémového. Volby mohou mít{" "}
                <code>description</code> a <code>disabled</code>;{" "}
                <code>placeholder</code> se ukáže, dokud není nic vybráno.
                Ovládání: šipky, Home / End, Enter, Esc, psaní písmen. Když pod
                polem není místo, otevře se nahoru. S <code>name</code> se
                hodnota odešle ve formuláři.
              </>
            }
          >
            <SelectInput
              label="Stav prodeje"
              value={saleStatus}
              onChange={setSaleStatus}
              options={[
                {
                  value: "sale",
                  label: "V prodeji",
                  description: "Byty jsou vidět na webu",
                },
                {
                  value: "soon",
                  label: "Připravujeme",
                  description: "Na webu jen s poznámkou",
                },
                { value: "sold", label: "Vyprodáno" },
                { value: "archive", label: "Archiv", disabled: true },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectInput
                label="Bez výběru"
                options={[
                  { value: "a", label: "Budova A" },
                  { value: "b", label: "Budova B" },
                ]}
              />
              <SelectInput
                label="S chybou"
                error="Vyberte patro"
                options={[
                  { value: "1", label: "1. patro" },
                  { value: "2", label: "2. patro" },
                ]}
              />
            </div>
            <SelectInput
              label="Nedostupné"
              disabled
              defaultValue="cs"
              options={[{ value: "cs", label: "Čeština" }]}
            />
          </Demo>

          <Demo
            name='Kompaktní pole (size="sm")'
            source="ui/form/Field"
            note="Používá levý panel editoru obsahu."
          >
            <TextInput
              size="sm"
              label="Nadpis"
              defaultValue="Rezidence, kde čas má své místo"
              action={<AiSuggestButton label="Navrhnout" />}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <TextInput
                size="sm"
                label="Text odkazu"
                defaultValue="nabídka bytů"
              />
              <SelectInput
                size="sm"
                label="Vede na"
                defaultValue="cenik"
                options={[
                  { value: "cenik", label: "Ceník" },
                  { value: "kontakt", label: "Kontakt" },
                ]}
              />
            </div>
            <TagsInput
              label="Domy v sektoru"
              values={tags}
              onChange={setTags}
              addLabel="Přidat dům"
              normalize={(value) => value.trim().toUpperCase()}
            />
          </Demo>

          <Demo
            name="TextField · PasswordField"
            source="ui/TextField"
            note="Velká pole přihlašovacích obrazovek."
          >
            <TextField label="E-mail" type="email" placeholder="vas@email.cz" />
            <PasswordField label="Heslo" defaultValue="tajneheslo" />
          </Demo>

          <Demo
            name="Checkbox · Switch · SearchInput"
            source="ui/Checkbox, ui/Switch, ui/SearchInput"
          >
            <Row>
              <Checkbox
                label="Zobrazit na webu"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
              <Checkbox label="Nedostupné" disabled />
            </Row>
            <Row label="Switch · md a sm">
              <Switch
                label="Online kamera"
                checked={switchOn}
                onChange={setSwitchOn}
              />
              <Switch
                size="sm"
                label="Sobota: otevřeno"
                checked={!switchOn}
                onChange={(value) => setSwitchOn(!value)}
              />
            </Row>
            <SearchInput label="Hledat byt" placeholder="Hledat byt" />
          </Demo>

          <Demo
            name="SwitchRow · Disclosure"
            source="ui/SwitchRow, ui/Disclosure"
            note={
              <>
                <code>SwitchRow</code> je nastavení na jednom řádku (popisek,
                volitelný popis, přepínač). <code>Disclosure</code> schová méně
                používanou část formuláře za rozbalovací řádek.
              </>
            }
          >
            <SwitchRow
              label="Online kamera"
              checked={switchOn}
              onChange={setSwitchOn}
            />
            <SwitchRow
              label="Denní souhrn e-mailem"
              description="Každé ráno v 8:00, jen když je co hlásit"
              checked={!switchOn}
              onChange={(value) => setSwitchOn(!value)}
            />
            <Disclosure label="Pokročilé: klíčová slova, strukturovaná data">
              <TagsInput
                label="Klíčová slova"
                values={tags}
                onChange={setTags}
                addLabel="Přidat slovo"
              />
            </Disclosure>
          </Demo>

          <Demo
            name="MenuItemsEditor"
            source="editor/MenuItemsEditor"
            note="Seznam odkazů s řazením, přejmenováním na místě, přidáním a odebráním. Používá hlavička i patička v editoru obsahu."
          >
            <MenuItemsEditor
              items={items}
              label="Odkazy"
              addLabel="Přidat odkaz"
              onChange={(_, next) => setItems(next)}
            />
          </Demo>

          <Demo
            name="Dropzone"
            source="ui/Dropzone"
            note={
              <>
                <code>layout</code>: stacked · inline. Soubory vrací přes{" "}
                <code>onFiles</code>.
              </>
            }
          >
            <Dropzone
              title="Přetáhněte sem obrázek půdorysu"
              accept="image/*"
              onFiles={(list) => setFiles(list[0]?.name ?? null)}
            />
            <Dropzone
              layout="inline"
              title="Přetáhněte sem CSV"
              icon={FileCsvIcon}
              onFiles={(list) => setFiles(list[0]?.name ?? null)}
            />
            {files && (
              <p className="font-text text-[13px] text-fg-3">
                Vybráno: {files}
              </p>
            )}
          </Demo>
        </Chapter>

        <Chapter id="choices" title="Výběr a filtry">
          <Demo
            name="SegmentedControl"
            source="ui/SegmentedControl"
            note={
              <>
                <code>shape</code>: rounded · pill · block. Volby mohou mít{" "}
                <code>icon</code> a <code>count</code>.
              </>
            }
          >
            <Row>
              <SegmentedControl
                label="Zobrazení"
                shape="pill"
                value={view}
                onChange={setView}
                options={[
                  {
                    value: "grid",
                    label: "Mřížka",
                    icon: <SquaresFourIcon weight="fill" className="size-4" />,
                  },
                  {
                    value: "table",
                    label: "Tabulka",
                    icon: <ListIcon weight="fill" className="size-4" />,
                  },
                ]}
              />
              <SegmentedControl
                label="Stav stránek"
                shape="pill"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "all", label: "Všechny", count: 11 },
                  { value: "published", label: "Zveřejněné", count: 10 },
                  { value: "draft", label: "Koncepty", count: 1 },
                ]}
              />
            </Row>
            <SegmentedControl
              label="Období"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "Vše" },
                { value: "published", label: "30 dní" },
                { value: "draft", label: "7 dní" },
              ]}
              className="self-start"
            />
            <div className="max-w-[360px]">
              <SegmentedControl
                label="Vzhled"
                shape="block"
                value={theme}
                onChange={setTheme}
                options={[
                  { value: "auto", label: "Automatický" },
                  { value: "light", label: "Světlý" },
                  { value: "dark", label: "Tmavý" },
                ]}
              />
            </div>
          </Demo>

          <Demo
            name="Chip"
            source="ui/Chip"
            note={
              <>
                Přepínací filtr; volitelně <code>dotColor</code>,{" "}
                <code>count</code>, <code>tone=&quot;accent&quot;</code>.
              </>
            }
          >
            <Row>
              <Chip
                label="Všechny"
                count={240}
                selected={chip === "all"}
                onClick={() => setChip("all")}
              />
              <Chip
                label="Volné"
                dotColor={unitStatuses.free.color}
                count={96}
                selected={chip === "free"}
                onClick={() => setChip("free")}
              />
              <Chip
                label="Bez půdorysu"
                tone="accent"
                count={4}
                selected={chip === "attention"}
                onClick={() => setChip("attention")}
              />
            </Row>
          </Demo>

          <Demo
            name="CheckCard"
            source="ui/CheckCard"
            note={
              <>
                Karta se zaškrtnutím; <code>type</code>: checkbox · radio.
              </>
            }
          >
            <CheckCard
              title="Ceny a stavy bytů"
              description="Přepíše ceny podle Realpadu"
              checked={cards.a}
              onChange={(a) => setCards((current) => ({ ...current, a }))}
            />
            <CheckCard
              title="Půdorysy"
              description="Nahraje chybějící půdorysy"
              checked={cards.b}
              onChange={(b) => setCards((current) => ({ ...current, b }))}
            />
          </Demo>

          <Demo
            name="ChoiceCard"
            source="ui/ChoiceCard"
            note="Velká volba v průvodcích; jako odkaz (href) nebo tlačítko (onSelect)."
          >
            <ChoiceCard
              title="Import z CSV"
              description="Nahrajte tabulku se všemi byty najednou."
              note="Doporučeno pro více než 10 bytů"
              icon={<FileCsvIcon weight="fill" className="size-5" />}
              recommended
              onSelect={() => {}}
            />
          </Demo>

          <Demo
            name="SortableList"
            source="ui/SortableList"
            note="Seznam řazený přetažením nebo šipkami na úchytu; volitelně oddělovač „vložit sem“ mezi řádky."
          >
            <SortableList
              items={items}
              label="Položky menu"
              itemLabel={(item) => item.label}
              onReorder={setItems}
              selectedId="3"
              insertLabel="Nová položka sem"
              onInsert={(index) =>
                setItems((current) => [
                  ...current.slice(0, index),
                  { id: String(Date.now()), label: "Nová položka" },
                  ...current.slice(index),
                ])
              }
            >
              {(item) => (
                <span className="min-w-0 flex-1 truncate font-text text-sm font-medium text-fg">
                  {item.label}
                </span>
              )}
            </SortableList>
          </Demo>
        </Chapter>

        <Chapter id="navigation" title="Navigace">
          <Demo name="Breadcrumb · TabNav" source="ui/Breadcrumb, ui/TabNav">
            <Breadcrumb
              items={[
                { label: "Byty", href: "#navigation" },
                { label: "A.101" },
              ]}
            />
            <TabNav
              label="Části detailu"
              tabs={[
                { label: "Základní údaje", href: "/styleguide" },
                { label: "Soubory", href: "/styleguide/files", count: 4 },
                { label: "SEO", href: "/styleguide/seo" },
                { label: "Migrace", restriction: "Jen pro správce" },
              ]}
            />
          </Demo>

          <Demo name="Stepper" source="ui/Stepper">
            <Stepper steps={["Podklad", "Domy", "Shrnutí"]} current={1} />
          </Demo>

          <Demo
            name="Pagination · PrevNext"
            source="ui/Pagination, ui/PrevNext"
          >
            <Pagination
              page={page}
              pageCount={5}
              onPageChange={setPage}
              summary="Zobrazeno 13–24 z 60 bytů"
            />
            <PrevNext
              prevHref="#navigation"
              nextHref="#navigation"
              prevLabel="Předchozí byt"
              nextLabel="Další byt"
              position="2 z 6"
            />
          </Demo>
        </Chapter>

        <Chapter id="status" title="Stavy a hlášky">
          <Demo
            name="Banner"
            source="ui/Banner"
            note={
              <>
                <code>tone</code>: error · warning · success · locked.
              </>
            }
          >
            <Banner tone="error">Nepodařilo se uložit změny.</Banner>
            <Banner tone="warning">Čtyři byty nemají půdorys.</Banner>
            <Banner tone="success">Import proběhl v pořádku.</Banner>
            <Banner tone="locked">Tuto část může upravit jen správce.</Banner>
          </Demo>

          <Demo
            name="StatusChip · DotPill · DeltaBadge"
            source="ui/StatusChip, ui/DotPill, ui/DeltaBadge"
          >
            <Row label="Stavy bytu (lib/unit-status)">
              {(Object.keys(unitStatuses) as UnitStatus[]).map((status) => (
                <StatusChip key={status} status={status} />
              ))}
            </Row>
            <Row label="DotPill · neutral a tinted">
              <DotPill label="Aktivní" color="var(--color-green)" />
              <DotPill
                label="Na webu"
                color="var(--color-green)"
                tone="tinted"
              />
              <DotPill
                label="Koncept"
                color="var(--color-yellow)"
                tone="tinted"
              />
              <DotPill label="Malý" color="var(--color-copper)" size="sm" />
            </Row>
            <Row label="DeltaBadge">
              <DeltaBadge label="12 %" trend="up" />
              <DeltaBadge label="4 %" trend="down" tone="negative" />
            </Row>
          </Demo>

          <Demo
            name="RealpadSyncPill"
            source="project/RealpadSync"
            note={
              <>
                Stav synchronizace v hlavičce projektu. <code>state</code>: ok ·
                syncing · error. <code>RealpadSync</code> ze stejného souboru
                přidává chování tlačítka.
              </>
            }
          >
            <Row>
              <RealpadSyncPill state="ok" lastSync="před 5 min" />
              <RealpadSyncPill state="syncing" lastSync="před 5 min" />
              <RealpadSyncPill state="error" lastSync="dnes 8:00" />
            </Row>
          </Demo>

          <Demo name="InfoStrip" source="ui/InfoStrip" wide>
            <InfoStrip
              icon={InfoIcon}
              action={{ label: "Zobrazit", onClick: () => {} }}
            >
              Realpad naposledy poslal data před 5 minutami.
            </InfoStrip>
          </Demo>
        </Chapter>

        <Chapter id="data" title="Data a karty">
          <Demo
            name="Card · CardHeader · DetailRows"
            source="ui/Card, ui/DetailRows"
          >
            <Card className="flex flex-col gap-4 p-6">
              <CardHeader
                title="Základní údaje"
                description="Synchronizováno z Realpadu"
                action={<DotPill label="Aktivní" color="var(--color-green)" />}
              />
              <DetailRows
                rows={[
                  { label: "Dispozice", value: "2+kk" },
                  { label: "Plocha", note: "bez lodžie", value: "64,5 m²" },
                  { label: "Cena", value: formatPrice(6946000) },
                ]}
              />
            </Card>
          </Demo>

          <Demo
            name="DataTable"
            source="ui/DataTable"
            note={
              <>
                Sloupce se <code>sortValue</code> jdou řadit; řádky seřaďte
                funkcí <code>sortRows</code> před stránkováním.
              </>
            }
          >
            <Card className="px-6 py-2">
              <DataTable
                columns={columns}
                rows={sortRows(units, columns, sort)}
                rowKey={(unit) => unit.id}
                sort={sort}
                onSortChange={setSort}
                minWidth={420}
              />
            </Card>
          </Demo>
        </Chapter>

        <Chapter
          id="states"
          title="Prázdné stavy a načítání"
          description="Každý seznam má tři stavy navíc: načítá se, nic v něm není a nepodařilo se ho načíst. Celostránkové varianty jsou v src/app/error.tsx a src/app/not-found.tsx; stránky se při načítání nahrazují komponentou PageSkeleton."
        >
          <Demo
            name="EmptyState"
            source="ui/EmptyState"
            note={
              <>
                <code>tone</code>: neutral · error. <code>size</code>: md (část
                stránky) · sm (uvnitř tabulek, karet a panelů). Do{" "}
                <code>action</code> patří jedno hlavní tlačítko, které stav
                řeší.
              </>
            }
          >
            <Card>
              <EmptyState
                icon={BuildingsIcon}
                title="Zatím tu nejsou žádné byty"
                text="Nahrajte je z Excelu, nebo přidejte první ručně."
                action={
                  <Button size="md">
                    <PlusCircleIcon weight="fill" className="size-4" />
                    Přidat byty
                  </Button>
                }
              />
            </Card>
            <Card>
              <EmptyState
                size="sm"
                icon={MagnifyingGlassIcon}
                title="Žádný byt neodpovídá filtru"
                text="Zkuste jiný stav nebo upravte hledaný text."
                action={
                  <Button size="md" variant="outline">
                    Zrušit filtry
                  </Button>
                }
              />
            </Card>
          </Demo>

          <Demo
            name="EmptyState – chyba"
            source="ui/EmptyState"
            note='Stejná komponenta s tone="error"; vždy nabídněte „Zkusit znovu“.'
          >
            <Card>
              <EmptyState
                tone="error"
                icon={WarningCircleIcon}
                title="Byty se nepodařilo načíst"
                text="Zkontrolujte připojení a zkuste to znovu."
                action={<Button size="md">Zkusit znovu</Button>}
              />
            </Card>
          </Demo>

          <Demo
            name="Skeleton · SkeletonRows · SkeletonCards · PageSkeleton"
            source="ui/Skeleton"
            note="Zástupné bloky při načítání. Tvar má odpovídat tomu, co se načte."
          >
            <Row>
              <Skeleton className="size-11 rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-56" />
              </div>
            </Row>
            <SkeletonRows rows={3} />
            <SkeletonCards count={3} className="!grid-cols-3" />
          </Demo>

          <Demo
            name="DataTable – stavy"
            source="ui/DataTable"
            note={
              <>
                <code>loading</code> ukáže zástupné řádky, <code>empty</code>{" "}
                přijme text nebo <code>EmptyState</code>.
              </>
            }
          >
            <SegmentedControl
              label="Stav tabulky"
              className="self-start"
              value={tableState}
              onChange={setTableState}
              options={[
                { value: "data", label: "Data" },
                { value: "loading", label: "Načítání" },
                { value: "empty", label: "Prázdná" },
              ]}
            />
            <Card className="px-6 py-2">
              <DataTable
                columns={columns}
                rows={tableState === "data" ? units : []}
                loading={tableState === "loading"}
                rowKey={(unit) => unit.id}
                sort={sort}
                onSortChange={setSort}
                minWidth={420}
                empty={
                  <EmptyState
                    size="sm"
                    icon={MagnifyingGlassIcon}
                    title="Žádný byt neodpovídá filtru"
                  />
                }
              />
            </Card>
          </Demo>
        </Chapter>

        <Chapter id="overlays" title="Dialogy a nabídky">
          <Demo
            name="Modal · ConfirmDialog"
            source="ui/Modal, ui/ConfirmDialog"
            note={
              <>
                Postavené na nativním <code>&lt;dialog&gt;</code>: zachytí fokus
                a zavřou se klávesou Esc. <code>size</code>: md (640 px) · sm
                (480 px).
              </>
            }
          >
            <Row>
              <Button
                size="md"
                variant="outline"
                onClick={() => setModal("modal")}
              >
                Otevřít dialog
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={() => setModal("confirm")}
              >
                Otevřít potvrzení
              </Button>
            </Row>
            <Modal
              open={modal === "modal"}
              onClose={() => setModal(null)}
              title="Pozvat uživatele"
              description="Pošleme mu e-mail s odkazem pro přihlášení."
            >
              <TextInput label="E-mail" placeholder="jmeno@firma.cz" />
              <div className="flex justify-end gap-2.5">
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => setModal(null)}
                >
                  Zrušit
                </Button>
                <Button size="md" onClick={() => setModal(null)}>
                  Poslat pozvánku
                </Button>
              </div>
            </Modal>
            <ConfirmDialog
              open={modal === "confirm"}
              onClose={() => setModal(null)}
              onConfirm={() => setModal(null)}
              title="Smazat soubor?"
              description="Soubor zmizí z knihovny i z webu."
              warning="Tuto akci nelze vrátit zpět."
              confirmLabel="Smazat soubor"
            />
          </Demo>

          <Demo
            name="FormDialog"
            source="ui/FormDialog"
            note={
              <>
                Dialog s formulářem a patičkou „Zrušit / potvrdit“. Sám řeší
                stav odesílání; když <code>onSubmit</code> vrátí{" "}
                <code>false</code> (chyba ve formuláři), zůstane otevřený. Staví
                na něm Změnit heslo, Přidat stránku a Požádat o novou sekci.
              </>
            }
          >
            <Row>
              <Button
                size="md"
                variant="outline"
                onClick={() => setModal("form")}
              >
                Otevřít formulář
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={() => setModal("password")}
              >
                Změnit heslo
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={() => setModal("notifications")}
              >
                Nastavení upozornění
              </Button>
            </Row>
            <FormDialog
              open={modal === "form"}
              onClose={() => setModal(null)}
              size="sm"
              title="Přejmenovat soubor"
              description="Název se změní i na webu."
              submitLabel="Uložit"
              submittingLabel="Ukládám…"
              onSubmit={() =>
                new Promise<void>((resolve) => setTimeout(resolve, 900))
              }
            >
              <TextInput label="Název" defaultValue="pudorys-a101.pdf" />
            </FormDialog>
            <NotificationSettingsDialog
              open={modal === "notifications"}
              onClose={() => setModal(null)}
              settings={notificationSettings}
              onChange={setNotificationSettings}
            />
            <ChangePasswordDialog
              open={modal === "password"}
              onClose={() => setModal(null)}
              onChanged={() => {}}
            />
          </Demo>

          <Demo
            name="NumberedSteps"
            source="ui/NumberedSteps"
            note="Krátký návod v krocích, např. v nápovědě „Jak upravit stránku“."
          >
            <NumberedSteps
              steps={[
                {
                  title: "U stránky klikněte na Upravit",
                  text: "Otevře se editor s náhledem webu.",
                },
                {
                  title: "Přepište obsah sekce",
                  text: "Vzhled sekce zůstává stejný.",
                },
                { title: "Klikněte na Zveřejnit změny" },
              ]}
            />
          </Demo>

          <Demo
            name="ShareImageField"
            source="seo/ShareImageField"
            note={
              <>
                Řádek s obrázkem pro sdílení. S <code>onReplace</code> ukáže
                tlačítko, které otevře výběr souboru.
              </>
            }
          >
            <ShareImageField
              title={shareImage.title}
              note={shareImage.note}
              thumbnailUrl={shareImage.url}
              onReplace={(file) =>
                setShareImage({
                  title: file.name,
                  note: "Nový obrázek",
                  url: URL.createObjectURL(file),
                })
              }
            />
          </Demo>

          <Demo
            name="DropdownMenu"
            source="ui/DropdownMenu"
            note={
              <>
                Nabídka z libovolného tlačítka: volby se zaškrtnutím, odkazy (
                <code>href</code>) i akce, skupiny s nadpisem. <code>side</code>
                : bottom · top, <code>align</code>: start · end. Zavře se
                klávesou Esc nebo kliknutím mimo, šipky přecházejí mezi
                položkami. Používá ji přepínač projektu, období, jazyk, AI lišta
                a karta uživatele.
              </>
            }
          >
            <Row>
              <DropdownMenu
                label="Období"
                groups={[
                  {
                    label: "Období",
                    items: dateRanges.map((range) => ({
                      id: range.id,
                      label: range.label,
                      selected: range.id === demoRange,
                      onSelect: () => setDemoRange(range.id),
                    })),
                  },
                  {
                    items: [
                      {
                        id: "disabled",
                        label: "Vlastní rozsah",
                        note: "připravujeme",
                        disabled: true,
                      },
                    ],
                  },
                ]}
                trigger={(props) => (
                  <Button size="md" variant="outline" {...props}>
                    {dateRanges.find((range) => range.id === demoRange)?.label}
                  </Button>
                )}
              />
              <RangeSelect />
            </Row>
          </Demo>

          <Demo
            name="ActionMenu"
            source="ui/ActionMenu"
            note="Nabídka akcí řádku za tlačítkem „…“; pozicuje se vůči oknu, takže ji tabulka neořízne."
          >
            <Row>
              <ActionMenu
                label="Akce: ukázka"
                items={[
                  {
                    label: "Upravit",
                    icon: (
                      <PencilSimpleIcon weight="fill" className="size-3.5" />
                    ),
                    onSelect: () => {},
                  },
                  {
                    label: "Stáhnout",
                    icon: (
                      <DownloadSimpleIcon weight="fill" className="size-3.5" />
                    ),
                    onSelect: () => {},
                  },
                  {
                    label: "Odstranit",
                    tone: "danger",
                    icon: <TrashIcon weight="fill" className="size-3.5" />,
                    onSelect: () => {},
                  },
                ]}
              />
              <span className="flex items-center gap-2 font-text text-[13px] text-fg-3">
                <BuildingsIcon weight="fill" className="size-4" />
                Ikony: @phosphor-icons/react, weight=&quot;fill&quot;
              </span>
            </Row>
          </Demo>
        </Chapter>

        <Chapter
          id="ai"
          title="AI"
          description="Prvky AI používají fialový přechod (bg-ai-gradient, surface-ai) a barvu ai."
        >
          <Demo name="AiSuggestionCard" source="seo/AiSuggestionCard">
            <AiSuggestionCard
              suggestion={suggestion}
              onUse={() => {}}
              onAnother={() => {}}
              onDismiss={() => {}}
            />
          </Demo>
          <Demo
            name="AiPrompt"
            source="app/AiPrompt"
            note="Plovoucí zadání pro AI; text vrací přes onSubmit."
          >
            <AiPrompt />
          </Demo>
        </Chapter>
      </main>
    </div>
  );
}
