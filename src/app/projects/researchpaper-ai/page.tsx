import type { Metadata } from "next";
import { ResearchPaperDemo } from "@/components/research-paper-demo";

export const metadata: Metadata = {
  title: "ResearchPaper AI demo",
  description: "Explore a sample PDF research workspace with prepared answers and page citations.",
};

export default function ResearchPaperDemoPage() {
  return <ResearchPaperDemo />;
}
