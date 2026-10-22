# Redesign changelog (`redesign/v2`)

A short summary. The full record, with decisions and measurements, is in [PROGRESS.md](PROGRESS.md).

## What changed

- **Information architecture.** The home page went from 13 sections (15 by the original audit's count) to six: Hero, Selected work, Experience, More work, About, Contact. The first project now starts at 1.18 screens (1440×900) instead of 5.9, and at 1.25 screens on a phone instead of 7.8. Page height fell from 10,927 px to 7,768 px at 1440 wide.
- **Design system "Cited".** Light and dark tokens, Schibsted Grotesk and Newsreader, a type scale, a 12-column grid, motion tokens, and a reduced-motion switch that honours both the OS setting and the manual toggle. The forced-dark overrides, the space video (and `hls.js`), the marquee, the iframe and the modal are gone.
- **Citations.** `<Cite>` highlights a claim and opens its evidence (repo file, demo, résumé, a two-bar chart) in the margin at ≥1100 px or inline below. Eight on the home page.
- **Case studies.** Nine static `/work/[slug]` pages with an accessible stage stepper, system design and data model, decisions, limitations and an "About this demo" note; `/about` tells the longer story. `/?project=<slug>` redirects to the new pages. The three interactive demos are unchanged.
- **Motion.** One hero load sequence (once per session), the work-media → case-study morph and directional navigation (View Transitions), optional Lenis smooth scrolling, and a hover/keyboard preview in More work. Nothing loops or scrolls on its own; videos play only in view and have a pause button.
- **Performance, accessibility, SEO.** Lighthouse mobile: Accessibility, Best Practices and SEO 100, Performance 94–98. axe: 0 violations in both themes. Sitemap, robots, manifest, icons, JSON-LD, per-page Open Graph and Twitter images.
- **Content model.** Typed, JSX-free modules in `src/content/`. Unknown facts render as visible `[TODO: …]` placeholders.

## Upgrades and dependencies

Next 16.1.1 → 16.4.2 and React 19.2.3 → 19.3.1 (needed for `<ViewTransition>` and `Link transitionTypes`); added `lenis`, `@playwright/test`, `@axe-core/playwright`; removed `hls.js`, `react-markdown`, `rehype-pretty-code`, `tailwindcss-animate`, three Radix packages.

## Known gaps

See "Content needed from Preet" in [PROGRESS.md](PROGRESS.md). Not done: re-encoding the three ~6 MB demo videos (no `ffmpeg` here), real dates/roles/availability/portrait/bio.
