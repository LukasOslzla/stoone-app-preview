import type { Metadata } from "next";
import { Suspense } from "react";
import { PagesList } from "@/components/pages/PagesList";
import { getSitePages, getSiteStatus } from "@/lib/pages";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Stránky webu" };

/** Pages of the project's public web ("Editor obsahu" in the menu). */
export default function PagesRoute({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [pages, site] = await Promise.all([
    getSitePages(slug),
    getSiteStatus(slug),
  ]);

  return (
    <PagesList
      pages={pages}
      site={site}
      editorHref={`/projects/${slug}/editor`}
    />
  );
}
