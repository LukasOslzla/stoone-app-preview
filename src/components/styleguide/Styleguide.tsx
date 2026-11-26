"use client";

import { useState } from "react";
import {
  BuildingsIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  InfoIcon,
  ListIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
  SquaresFourIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { ChangePasswordDialog } from "@/components/account/ChangePasswordDialog";
import { AiPrompt } from "@/components/app/AiPrompt";
import { PageIntro } from "@/components/app/PageIntro";
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
import { InfoStrip } from "@/components/ui/InfoStrip";
import { LogoTile } from "@/components/ui/LogoTile";
import { Modal } from "@/components/ui/Modal";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { Pagination } from "@/components/ui/Pagination";
import { PrevNext } from "@/components/ui/PrevNext";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
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
import { Chapter, Demo, Row } from "./Showcase";

const chapters = [
  ["tokens", "Barvy a písmo"],
  ["buttons", "Tlačítka"],
  ["forms", "Formuláře"],
  ["choices", "Výběr a filtry"],
  ["navigation", "Navigace"],
  ["status", "Stavy a hlášky"],
  ["data", "Data a karty"],
  ["overlays", "Dialogy a nabídky"],
  ["ai", "AI"],
] as const;

/** Tokens from `src/app/globals.css` (`@theme`). */
const colors: { name: string; value: string; use: string }[] = [
  { name: "bg", value: "#151519", use: "pozadí aplikace" },
  { name: "card", value: "#1E1E23", use: "karty, dialogy" },
  { name: "inset", value: "#0F0F12", use: "zapuštěné plochy" },
  { name: "control", value: "#2A2A30", use: "aktivní přepínače, štítky" },
  { name: "line", value: "#D2D5C533", use: "ohraničení" },
  { name: "line-soft", value: "#D2D5C524", use: "jemné oddělovače" },
  { name: "fg", value: "#F8F6EF", use: "hlavní text" },
  { name: "fg-2", value: "#D2D5C5B3", use: "doplňkový text" },
  { name: "fg-3", value: "#D2D5C573", use: "popisky, nápověda" },
  { name: "beige", value: "#CAC3B8", use: "hlavní akce, výběr" },
  { name: "ink", value: "#1C1A18", use: "text na béžové" },
  { name: "copper", value: "#CA9377", use: "hover hlavní akce" },
  { name: "copper-deep", value: "#A26D55", use: "stisk hlavní akce" },
  { name: "brick", value: "#8E3C39", use: "tmavě červený akcent" },
  { name: "green", value: "#6FD13C", use: "úspěch, volné" },
  { name: "yellow", value: "#F2C94C", use: "upozornění, koncept" },
  { name: "red", value: "#F0524B", use: "chyba, smazání" },
  { name: "ai", value: "#B3A2FF", use: "AI a sdílený obsah" },
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
              className="rounded-lg px-3 py-2 font-text text-sm leading-[1.4] font-medium text-fg-2 transition-colors hover:bg-white/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-12 px-8 py-9 pb-24">
        <PageIntro
          title="Styleguide"
          description="Přehled barev, písma a sdílených komponent aplikace STOONE. Ukázky jsou živé – používají stejný kód jako obrazovky. U každé komponenty je cesta, odkud se importuje; podrobný popis vlastností je v komentářích u typů ve zdrojovém souboru."
        />

        <Chapter
          id="tokens"
          title="Barvy a písmo"
          description="Tokeny jsou v src/app/globals.css v bloku @theme. V Tailwindu se používají jako bg-card, text-fg-2, border-line apod."
        >
          <Demo name="Barvy" source="src/app/globals.css" wide>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
              {colors.map((color) => (
                <li key={color.name} className="flex items-center gap-3">
                  <span
                    className="size-10 shrink-0 rounded-[10px] border border-line"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="flex min-w-0 flex-col">
                    <code className="font-mono text-xs leading-[1.4] text-fg">
                      {color.name}
                    </code>
                    <span className="truncate font-text text-xs leading-[1.4] text-fg-3">
                      {color.value} · {color.use}
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
              <DotPill label="Aktivní" color="#6FD13C" />
              <DotPill label="Na webu" color="#6FD13C" tone="tinted" />
              <DotPill label="Koncept" color="#F2C94C" tone="tinted" />
              <DotPill label="Malý" color="#CA9377" size="sm" />
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
                action={<DotPill label="Aktivní" color="#6FD13C" />}
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
