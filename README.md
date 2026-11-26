# STOONE app – preview

**Testovací preview, ne produkční kód.** Obrazovky administrace nakódované podle návrhu v Pencilu, aby si z nich vývojáři mohli postupně brát komponenty.

- Next.js (App Router) + TypeScript + Tailwind CSS 4
- Náhled: https://stoone-app.vercel.app

## Co je hotové

| Obrazovka | Adresa |
| --- | --- |
| Přihlášení, obnova hesla | `/login`, `/login?reason=expired`, `/forgot-password` |
| Výběr projektů | `/overview` |
| Dashboard projektu | `/projects/momentum` |
| Byty – seznam | `/projects/momentum/units` |
| Byty – přidat ručně, nahrát z Excelu | `/projects/momentum/units/new`, `/projects/momentum/units/import` |
| Sektory – seznam, detail (základní údaje, domy na obrázku), nový sektor | `/projects/brique/sectors`, `/projects/brique/sectors/sektor-6`, `/projects/brique/sectors/sektor-6/houses`, `/projects/brique/sectors/new` |
| Stránky webu („Editor obsahu“ v menu) | `/projects/momentum/pages` |
| Nastavení webu (vyhledávače a sdílení, stránka 404) | `/projects/momentum/settings`, `/projects/momentum/settings/not-found` |
| Editor obsahu (hlavička, sekce stránek, galerie sekcí, sdílený obsah, odpověď AI) | `/projects/momentum/editor`, stránka přímo: `/projects/momentum/editor?page=%2Fcs` |
| Styleguide pro vývojáře (tokeny a živé ukázky komponent) | `/styleguide` |
| Konfigurátor standardů pro kupující (Vaše jednotky, průvodce po krocích) | `/configurator`, `/configurator/a-101` |
| Soubory (mřížka, tabulka, potvrzení smazání) | `/projects/momentum/files` |
| Uživatelé a role (uživatelé, role, pozvánka) | `/projects/momentum/users`, `/projects/momentum/users/roles` |
| Můj účet (z karty uživatele v menu) | `/projects/momentum/account` |
| Migrace dat | `/projects/momentum/migration` |
| Notifikace (panel z menu) | položka „Notifikace“ dole v menu |
| Realpad Sync v hlavičce projektu (v pořádku, synchronizuji, chyba) | `/projects/momentum` (v pořádku), `/projects/zizkov-3-0` (chyba); tlačítko spustí synchronizaci |
| Detail bytu (Přehled, Půdorysy a dokumenty, SEO) | `/projects/momentum/units/a-240`, `…/files`, `…/seo` |
| Detail budovy | `/projects/momentum/buildings/vybaveni` |
| Detail patra (Základní údaje, Půdorys a dokumenty, Byty na půdorysu) | `/projects/momentum/floors/ab-8`, `…/plan`, `…/units` |

`/projects/momentum/buildings` je provizorní rozcestník – seznam budov a pater v návrhu není.

## Kde co je

- `src/components/ui` – obecné stavební prvky: tlačítko, karta, formulářová pole (`form/`), `DataTable`, `Chip`, `SearchInput`, `Pagination`, `TabNav`, `Breadcrumb`, `Modal`, `DropdownMenu` (nabídky v hlavičce, menu a AI liště), `ChoiceCard`, `Checkbox`, `Stepper`, `Dropzone`, `FileRows`, `SegmentedControl`, štítky stavů.
- `src/components/app` – kostra aplikace: `AppShell`, postranní menu (`sidebar/`), hlavičky stránek (`PageHeader`, `PageIntro`, `FlowHeader`), AI lišta.
- `src/components/detail` – rámec detailové stránky se záložkami (`DetailScaffold`).
- `src/components/plan` – označování oblastí na obrázku (`PlanAreaEditor`, `PlanChecklist`).
- `src/components/seo` – SEO pole s počítadlem a náhled ve vyhledávači.
- `src/components/editor` – editor obsahu: lišta (`EditorBar`, `TargetSelect`), levé panely, náhled webu se zvýrazněním (`SitePreview`), galerie sekcí, odpověď AI.
- `src/components/configurator` – konfigurátor pro kupující: hlavička, karta jednotky s termínem a průběhem, průvodce (`ConfigWizard`), karta varianty.
- `src/components/styleguide` – stránka `/styleguide` s živými ukázkami všech sdílených komponent.
- `src/components/charts` – graf (`AreaChart`).
- `src/components/{dashboard,units,buildings,project,auth}` – obrazovky složené z prvků výše.
- `src/app/globals.css` – barvy a písma z návrhu jako Tailwind tokeny pro tmavý i světlý režim (`[data-theme="light"]`). Barvy se v komponentách používají jen přes tokeny, ne jako hex.
- `src/lib/theme.ts` – přepínání režimu (`setTheme`, `useTheme`); volba se pamatuje v prohlížeči.

## Co je mock

Všechna data a ukládání jsou v `src/lib` a jsou to jen ukázky:

- `auth.ts` – přihlášení (projde heslo s 8+ znaky) a obnova hesla
- `projects.ts`, `user.ts`, `dashboard.ts`, `buildings.ts`, `units.ts`, `units-import.ts`

V editoru obsahu (`editor.ts`) nahrazují živý web snímky obrazovky: přejmenování nebo přeřazení položek menu se proto v náhledu neprojeví, AI vrací na každé zadání stejný návrh a „Zveřejnit změny“ jen chvíli čeká.

V konfigurátoru (`configurator.ts`) jsou vzorky jen barevné přechody místo fotek produktů, nabídka variant je vymyšlená a „Stáhnout souhrn (PDF)“ nic nestáhne.

Ukládání jen chvíli čeká, nahrané soubory zůstávají v prohlížeči, import z Excelu soubor nečte a „Vylepšit s AI“ vrací předpřipravený text. Stránky za loginem nejsou chráněné. Sektory mají stejná data u každého projektu, obrysy domů jsou kromě RD24 jen přibližné a odkaz „Použít ukázkový“ v průvodci Nový sektor je jen pro preview.

## Spuštění

```bash
npm install
npm run dev
```
