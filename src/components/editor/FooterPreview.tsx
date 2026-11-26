import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import type { SiteFooter } from "@/lib/editor";

const socialIcons = {
  instagram: InstagramLogoIcon,
  facebook: FacebookLogoIcon,
  youtube: YoutubeLogoIcon,
};

/** End of a page of the web with the footer that is being edited. */
export function FooterPreview({
  siteName,
  footer,
}: {
  siteName: string;
  footer: SiteFooter;
}) {
  const networks = (
    Object.keys(socialIcons) as (keyof typeof socialIcons)[]
  ).filter((key) => footer.social[key]);

  return (
    <div className="flex min-h-full flex-col bg-[#F8F6EF] font-sans">
      {/* The page above the footer, only hinted. */}
      <div aria-hidden className="flex flex-1 flex-col gap-3 px-14 py-10">
        <span className="h-3 w-24 rounded-full bg-[#1C1A1814]" />
        <span className="h-7 w-72 max-w-full rounded-full bg-[#1C1A1814]" />
        <span className="h-3 w-[420px] max-w-full rounded-full bg-[#1C1A180D]" />
        <span className="h-3 w-[360px] max-w-full rounded-full bg-[#1C1A180D]" />
      </div>

      <footer className="relative flex flex-col gap-8 bg-[#1C1A18] px-14 pt-10 pb-6 text-[#F8F6EF] outline-2 -outline-offset-2 outline-[#CAC3B8]">
        <span className="absolute top-0 right-6 flex h-[22px] items-center rounded-b-md bg-[#CAC3B8] px-2 text-[11px] leading-none font-bold text-[#1C1A18]">
          Patička
        </span>

        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-6">
          <div className="flex flex-col gap-3">
            <p className="text-2xl leading-none font-extrabold lowercase">
              {siteName}
            </p>
            <p className="flex flex-col text-[13px] leading-[1.7] text-[#F8F6EFB3]">
              {footer.phone && <span>{footer.phone}</span>}
              {footer.email && <span>{footer.email}</span>}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-[13px] leading-[1.4]">
            {footer.links.map((link) => (
              <li key={link.id}>{link.label}</li>
            ))}
          </ul>

          {networks.length > 0 && (
            <ul className="flex gap-2">
              {networks.map((key) => {
                const IconComponent = socialIcons[key];
                return (
                  <li
                    key={key}
                    className="flex size-9 items-center justify-center rounded-full border border-[#F8F6EF33]"
                  >
                    <IconComponent weight="fill" className="size-4" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="border-t border-[#F8F6EF1F] pt-4 text-[11px] leading-[1.4] text-[#F8F6EF80]">
          {footer.note}
        </p>
      </footer>
    </div>
  );
}
