import type { Metadata } from "next";
import { LearningManagementDemo } from "@/components/learning-management-demo";

export const metadata: Metadata = {
  title: "AI Learning Management System",
  description: "Explore sample courses, lesson notes, flashcards, and a quiz in a distinct study workspace.",
};

export default function LearningManagementDemoPage() {
  return <LearningManagementDemo />;
}
