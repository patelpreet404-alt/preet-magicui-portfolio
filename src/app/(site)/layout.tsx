import { SmoothScroll } from "@/components/smooth-scroll";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SkipLink } from "@/components/site/skip-link";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="type-body outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
