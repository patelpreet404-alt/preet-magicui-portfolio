import { MotionSettingsProvider } from "@/components/motion-settings";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { profile } from "@/content";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { DM_Mono, Newsreader, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

/** Change to "dark" or "system" if Preet prefers; light is the default theme. */
const DEFAULT_THEME = "light";

// Display + UI. One variable file covers every weight used.
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

// Case-study prose and citation notes. Static 400 rather than the variable opsz file: 22 KB instead of 131 KB,
// which took ~0.6 s off case-study first paint in Lighthouse. Not on the critical path of the home page.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

// Real code only.
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: `${profile.name} — ${profile.jobTitle}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  openGraph: {
    title: `${profile.name} — ${profile.jobTitle}`,
    description: profile.description,
    url: profile.url,
    siteName: profile.name,
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
    title: `${profile.name} — ${profile.jobTitle}`,
    description: profile.description,
    card: "summary_large_image",
  },
};

// Runs before first paint: apply the saved reduce-motion choice and note whether this session has
// already played the hero sequence, so CSS can skip it without a flash. Both stores are optional.
const EARLY_SCRIPT = `try{var d=document.documentElement;var m=localStorage.getItem("portfolio-reduce-motion");if(m==="true"||m==="false")d.dataset.reducedMotion=m;if(sessionStorage.getItem("hero-sequence-played"))d.dataset.heroPlayed="true"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", grotesk.variable, newsreader.variable, dmMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme={DEFAULT_THEME}
          enableSystem={false}
          storageKey="portfolio-space-theme"
        >
          <MotionSettingsProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </MotionSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
