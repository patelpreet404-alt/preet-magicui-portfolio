import type { Metadata } from "next";
import { OptiLangDemo } from "@/components/optilang-demo";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/optilang" },
  title: "OptiLang demo",
  description: "Explore an interactive preview of the OptiLang compiler pipeline and optimization output.",
};

export default function OptiLangDemoPage() {
  return <OptiLangDemo />;
}
