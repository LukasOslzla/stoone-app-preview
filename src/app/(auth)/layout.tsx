import Image from "next/image";
import { StooneLogo } from "@/components/StooneLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-bg">
      <main className="flex min-w-0 flex-1 flex-col items-center justify-between gap-10 p-6 sm:p-10">
        <div className="h-[18px] w-full shrink-0" />

        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          <StooneLogo className="h-[25px] w-[150px] text-beige" />
          {children}
        </div>

        <footer className="font-text text-[13px] leading-[1.4] text-fg-3">
          © STOONE s.r.o.
        </footer>
      </main>

      <aside
        aria-hidden
        className="sticky top-0 hidden h-dvh flex-1 py-4 pr-4 lg:block"
      >
        <div className="relative h-full overflow-hidden rounded-3xl border border-line-soft">
          <Image
            src="/images/stoone-sky.webp"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <Image
            src="/images/stoone-tower.webp"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#15151900_55%,#151519B3_100%)]" />
        </div>
      </aside>
    </div>
  );
}
