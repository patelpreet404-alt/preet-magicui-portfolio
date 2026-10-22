#!/usr/bin/env node
/**
 * Captures full-page screenshots (plus a fold-only shot and a few layout metrics) of the
 * portfolio at three viewports in light and dark.
 *
 *   pnpm build && pnpm start            # in one terminal
 *   node scripts/screenshot.mjs --label before
 *
 * Options
 *   --label <name>     output folder: docs/redesign/screenshots/<name>/   (required)
 *   --base <url>       site origin                                          (default http://localhost:3000)
 *   --only <substr>    only routes whose path contains <substr>
 *   --themes <list>    comma list of light,dark                             (default light,dark)
 *   --reduced-motion   emulate prefers-reduced-motion: reduce
 *   --axe              run axe (needs @axe-core/playwright) on /, /about and the case study
 *
 * Routes that answer 404 are skipped, so the same script works before and after the redesign.
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] && !args[index + 1].startsWith("--") ? args[index + 1] : fallback;
};

const label = option("label");
if (!label) {
  console.error("Usage: node scripts/screenshot.mjs --label <name> [--base http://localhost:3000]");
  process.exit(1);
}
const base = option("base", "http://localhost:3000").replace(/\/$/, "");
const only = option("only");
const themes = option("themes", "light,dark").split(",").map((value) => value.trim()).filter(Boolean);
const reducedMotion = flag("reduced-motion");
const runAxe = flag("axe");

// Keep this in sync with the theme provider's storageKey in src/app/layout.tsx.
const THEME_STORAGE_KEY = "portfolio-space-theme";

const ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "work-researchpaper-ai", path: "/work/researchpaper-ai" },
  { name: "demo-optilang", path: "/projects/optilang" },
  { name: "demo-researchpaper-ai", path: "/projects/researchpaper-ai" },
  { name: "demo-ai-learning-management", path: "/projects/ai-learning-management" },
].filter((route) => !only || route.path.includes(only));

const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
];

const AXE_ROUTES = new Set(["home", "about", "work-researchpaper-ai"]);

let AxeBuilder = null;
if (runAxe) {
  try {
    ({ default: AxeBuilder } = await import("@axe-core/playwright"));
  } catch {
    console.warn("! --axe requested but @axe-core/playwright is not installed; skipping axe.");
  }
}

/** Scroll the whole page once so IntersectionObserver-driven content is rendered, then return to the top. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.8, 300);
    const root = document.scrollingElement ?? document.documentElement;
    for (let y = 0; y < root.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((resolve) => setTimeout(resolve, 400));
  });
}

async function measure(page, viewport) {
  return page.evaluate((viewportHeight) => {
    const top = (selector) => {
      const element = document.querySelector(selector);
      return element ? Math.round(element.getBoundingClientRect().top + window.scrollY) : null;
    };
    const root = document.scrollingElement ?? document.documentElement;
    const firstProject = top("#work article") ?? top("#projects article") ?? top("#projects .project-marquee__item");
    return {
      documentHeight: root.scrollHeight,
      screens: Number((root.scrollHeight / viewportHeight).toFixed(2)),
      sections: document.querySelectorAll("main > section, main > div > section").length,
      workSectionTop: top("#work") ?? top("#projects"),
      firstProjectTop: firstProject,
      firstProjectScreens: firstProject == null ? null : Number((firstProject / viewportHeight).toFixed(2)),
      h1: Array.from(document.querySelectorAll("h1")).map((node) => node.textContent?.trim()),
      horizontalOverflow: root.scrollWidth > window.innerWidth + 1,
    };
  }, viewport.height);
}

const outDir = path.join(ROOT, "docs", "redesign", "screenshots", label);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const report = { label, base, takenAt: new Date().toISOString(), reducedMotion, pages: [], skipped: [], axe: [] };

try {
  for (const route of ROUTES) {
    const probe = await fetch(base + route.path, { redirect: "manual" }).catch(() => null);
    if (!probe || probe.status === 404) {
      console.log(`- skip ${route.path} (${probe ? "404" : "unreachable"})`);
      report.skipped.push(route.path);
      continue;
    }

    for (const viewport of VIEWPORTS) {
      for (const theme of themes) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: theme,
          reducedMotion: reducedMotion ? "reduce" : "no-preference",
          deviceScaleFactor: 1,
        });
        await context.addInitScript(
          ([key, value]) => {
            try {
              window.localStorage.setItem(key, value);
            } catch {}
          },
          [THEME_STORAGE_KEY, theme],
        );
        const page = await context.newPage();
        const consoleErrors = [];
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => consoleErrors.push(String(error)));

        const file = `${route.name}__${viewport.name}__${theme}`;
        try {
          await page.goto(base + route.path, { waitUntil: "load", timeout: 45_000 });
          await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
          await page.evaluate(() => document.fonts?.ready);
          await page.waitForTimeout(reducedMotion ? 200 : 1600); // let the hero load sequence finish
          await page.screenshot({ path: path.join(outDir, `${file}__fold.png`) });
          await scrollThrough(page);
          await page.screenshot({ path: path.join(outDir, `${file}.png`), fullPage: true });

          const metrics = await measure(page, viewport);
          report.pages.push({ route: route.path, viewport: viewport.name, theme, ...metrics, consoleErrors });
          console.log(`✓ ${file}  ${metrics.documentHeight}px (${metrics.screens} screens)${consoleErrors.length ? `  ${consoleErrors.length} console error(s)` : ""}`);

          if (AxeBuilder && AXE_ROUTES.has(route.name) && viewport.name === "1440x900") {
            const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
            const serious = result.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
            report.axe.push({
              route: route.path,
              theme,
              violations: result.violations.map((violation) => ({
                id: violation.id,
                impact: violation.impact,
                help: violation.help,
                nodes: violation.nodes.length,
              })),
            });
            console.log(`  axe ${route.path} [${theme}]: ${result.violations.length} violation(s), ${serious.length} serious/critical`);
          }
        } catch (error) {
          console.error(`✗ ${file}: ${error.message}`);
          report.pages.push({ route: route.path, viewport: viewport.name, theme, error: error.message });
        } finally {
          await context.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}

await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(`\nSaved ${report.pages.length} captures and report.json to ${path.relative(ROOT, outDir)}/`);
