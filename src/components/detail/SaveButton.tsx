import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";

/** "Uložit změny" with a short confirmation after a successful save. */
export function SaveButton({
  saving,
  saved,
}: {
  saving: boolean;
  saved: boolean;
}) {
  return (
    <>
      <span
        role="status"
        className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] text-fg-3"
      >
        {saved && !saving && (
          <>
            <CheckCircleIcon weight="fill" className="size-3.5 text-green" />
            Změny uloženy
          </>
        )}
      </span>
      <Button type="submit" size="md" loading={saving} loadingLabel="Ukládám…">
        Uložit změny
      </Button>
    </>
  );
}
