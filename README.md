# STOONE app – preview

**Testovací preview, ne produkční kód.** Login a výběr projektů nakódované podle návrhu v Pencilu.

- Next.js (App Router) + TypeScript + Tailwind CSS 4
- Náhled: https://stoone-app.vercel.app

## Co je mock

- `src/lib/auth.ts` – přihlášení (projde heslo s 8+ znaky) a obnova hesla
- `src/lib/projects.ts` – data projektů
- `src/lib/user.ts` – přihlášený uživatel

Stránky za loginem nejsou chráněné. Detail projektu je jen zástupná stránka.

## Spuštění

```bash
npm install
npm run dev
```

Routy: `/login`, `/login?reason=expired`, `/forgot-password`, `/overview`.
