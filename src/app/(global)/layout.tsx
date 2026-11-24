import { AppShell } from "@/components/app/AppShell";
import { GlobalSidebar } from "@/components/app/sidebar/GlobalSidebar";
import { currentUser } from "@/lib/user";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell sidebar={<GlobalSidebar user={currentUser} />}>
      {children}
    </AppShell>
  );
}
