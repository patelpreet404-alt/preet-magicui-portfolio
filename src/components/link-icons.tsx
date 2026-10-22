import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { LinkKind } from "@/content";

/** Content stays JSX-free; this maps link kinds to their default label and icon. */
export const LINK_KINDS: Record<LinkKind, { label: string; Icon: LucideIcon; external: boolean }> = {
  demo: { label: "Live demo", Icon: ArrowUpRight, external: true },
  source: { label: "Source", Icon: ArrowUpRight, external: true },
  preview: { label: "Interactive preview", Icon: ArrowRight, external: false },
  "case-study": { label: "Read case study", Icon: ArrowRight, external: false },
};
