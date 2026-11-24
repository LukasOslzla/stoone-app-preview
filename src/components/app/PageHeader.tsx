import { GlobeIcon, MoonIcon, SunIcon } from "@phosphor-icons/react/ssr";

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line-soft px-8 py-6">
      <h1 className="font-title text-[26px] leading-[1.2] font-medium tracking-[-0.3px] text-fg">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Jazyk"
          className="flex size-10 items-center justify-center rounded-xl text-fg-2 transition-colors hover:bg-white/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
        >
          <GlobeIcon weight="fill" className="size-5" />
        </button>

        {/* Only the dark theme is designed so far; the light option is inert. */}
        <div
          role="group"
          aria-label="Barevný režim"
          className="flex h-9 items-center gap-0.5 rounded-full border border-line bg-inset p-[3px]"
        >
          <button
            type="button"
            aria-label="Světlý režim"
            aria-pressed={false}
            title="Světlý režim zatím není k dispozici"
            className="flex h-7 w-[34px] items-center justify-center rounded-full text-fg-3 focus-visible:outline-[1.5px] focus-visible:outline-beige"
          >
            <SunIcon weight="fill" className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Tmavý režim"
            aria-pressed
            className="flex h-7 w-[34px] items-center justify-center rounded-full bg-beige text-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
          >
            <MoonIcon weight="fill" className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
