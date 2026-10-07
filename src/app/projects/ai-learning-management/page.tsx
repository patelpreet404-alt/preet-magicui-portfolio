import type { Metadata } from "next";
import { LearningManagementDemo } from "@/components/learning-management-demo";

export const metadata: Metadata = {
  title: "AI Learning Management System demo",
  description: "Explore sample study courses, notes, flashcards, and a quiz.",
};

export default function LearningManagementDemoPage() {
  return <LearningManagementDemo />;
}
