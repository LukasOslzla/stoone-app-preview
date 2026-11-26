import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { PlusCircleIcon } from "@phosphor-icons/react/ssr";
import { PageIntro } from "@/components/app/PageIntro";
import { SectorCard } from "@/components/sectors/SectorCard";
import Link from "next/link";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { getSectors } from "@/lib/sectors";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Sektory" };

/** Sectors – pick a sector to edit. */
export default function SectorsPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const sectors = await getSectors(slug);

  return (
    <div className="flex flex-col gap-6 px-8 pt-7 pb-8">
      <PageIntro
        title="Sektory"
        description="Skupiny domů, ze kterých si zájemce vybírá na webu. Klikněte na sektor, který chcete upravit."
        action={
          <Link
            href={`/projects/${slug}/sectors/new`}
            className={cn(buttonBase, buttonSizes.md, buttonVariants.outline)}
          >
            <PlusCircleIcon weight="fill" className="size-[15px] text-fg-2" />
            Přidat sektor
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sectors.map((sector) => (
          <SectorCard
            key={sector.slug}
            sector={sector}
            href={`/projects/${slug}/sectors/${sector.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
