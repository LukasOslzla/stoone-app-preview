import { createElement } from "react";
import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  ArticleIcon,
  EnvelopeSimpleIcon,
  ImageIcon,
  ImageSquareIcon,
  ImagesIcon,
  ImagesSquareIcon,
  InstagramLogoIcon,
  MapTrifoldIcon,
  SquaresFourIcon,
  TagIcon,
  TextHIcon,
} from "@phosphor-icons/react";

/** Icon of every section type from `lib/editor`. */
const icons: Record<string, Icon> = {
  "text-images": ArticleIcon,
  gallery: ImageSquareIcon,
  "heading-info": TextHIcon,
  pricing: TagIcon,
  "wide-image": ImageIcon,
  "contact-form": EnvelopeSimpleIcon,
  hero: ImageIcon,
  benefits: SquaresFourIcon,
  map: MapTrifoldIcon,
  "photo-pair": ImagesSquareIcon,
  "gallery-scroll": ImagesIcon,
  instagram: InstagramLogoIcon,
};

/** Icon of a section type, by the type's id. */
export function SectionIcon({ type, ...props }: IconProps & { type: string }) {
  return createElement(icons[type] ?? ArticleIcon, {
    weight: "fill",
    ...props,
  });
}
