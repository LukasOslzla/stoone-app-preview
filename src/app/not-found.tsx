import Link from "next/link";
import { CompassIcon } from "@phosphor-icons/react/ssr";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

/** 404 of the administration: unknown address, project, unit… */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <EmptyState
        icon={CompassIcon}
        title="Tahle stránka neexistuje"
        text="Adresa je špatně, nebo byl projekt či byt mezitím odstraněn."
        action={
          <Link
            href="/overview"
            className={cn(buttonBase, buttonSizes.md, buttonVariants.primary)}
          >
            Zpět na projekty
          </Link>
        }
      />
    </div>
  );
}
