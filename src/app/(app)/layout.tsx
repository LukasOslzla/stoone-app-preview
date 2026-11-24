import { AiPrompt } from "@/components/app/AiPrompt";
import { Sidebar } from "@/components/app/Sidebar";
import { currentUser } from "@/lib/user";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-bg">
      <Sidebar user={currentUser} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto pb-28">{children}</main>
        <AiPrompt className="absolute bottom-7 left-1/2 w-[560px] max-w-[calc(100%-2rem)] -translate-x-1/2" />
      </div>
    </div>
  );
}
