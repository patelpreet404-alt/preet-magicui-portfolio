import Navbar from "@/components/navbar";
import SiteBackground from "@/components/site-background";
import { MotionSettingsProvider } from "@/components/motion-settings";
import ProjectDetailsShell from "@/components/project-details-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Bodoni_Moda, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";
import "./portfolio-polish.css";
import "./design-explorer.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          manrope.variable,
          dmMono.variable,
          bodoni.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" storageKey="portfolio-space-theme">
          <MotionSettingsProvider>
          <TooltipProvider delayDuration={0}>
            <ProjectDetailsShell>
              <SiteBackground />
              <div className="site-content relative z-10 mx-auto w-full max-w-2xl px-6 py-12 pb-36 sm:py-24 sm:pb-36">
                {children}
              </div>
              <Navbar />
            </ProjectDetailsShell>
          </TooltipProvider>
          </MotionSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
