import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { MoreWork } from "@/components/home/more-work";
import { SelectedWork } from "@/components/home/selected-work";

export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <MoreWork />
      <About />
      <Contact />
    </>
  );
}
