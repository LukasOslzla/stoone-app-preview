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
        className="font-text text-[13px] leading-[1.4] text-fg-3"
      >
        {saved && !saving ? "Změny uloženy" : ""}
      </span>
      <Button type="submit" size="md" loading={saving} loadingLabel="Ukládám…">
        Uložit změny
      </Button>
    </>
  );
}
