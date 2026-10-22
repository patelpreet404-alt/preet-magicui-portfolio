<!-- Saved verbatim from the prompt that started the redesign (also kept as SONNET_MASTER_PROMPT.md at the repo root, untracked). -->

# Portfolio redesign — master prompt (paste into Claude Code at the repo root)

You are the lead design engineer on a redesign of my developer portfolio.

- Repo: `patelpreet404-alt/preet-magicui-portfolio` — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion 12 (`motion/react`), shadcn/Radix, Magic UI, pnpm.
- Live site: https://preet-magicui-portfolio.vercel.app

## Goal

Turn this into a fast, professional portfolio that a recruiter understands in 30 seconds and that is crafted well enough to submit to Awwwards (jury weights: design 40%, usability 30%, creativity 20%, content 10%; 6.5+ earns an Honorable Mention). **Lead with the work.** Everything that is not work, experience or contact gets condensed into About.

Today the home page has 15 sections and is ~12 screens tall at 1440×900; the first project starts 5.6 screens down (7.8 on a phone). After the redesign the home page has 6 sections and the first project is visible within ~1.2 screens.

## Before you write code

1. Read: `src/app/page.tsx`, `src/app/layout.tsx`, `src/data/resume.tsx`, `src/data/journey.ts`, `src/data/project-design-explorer.ts`, `src/data/project-designs.ts`, `src/data/project-schemas.ts`, every file in `src/components/section/`, `src/components/project-viewer.tsx`, `src/components/project-details.tsx`, `src/components/navbar.tsx`, `src/app/globals.css`, `src/app/portfolio-polish.css`, `src/app/design-explorer.css`, and `public/preet-patel-resume.pdf` (text).
2. Create branch `redesign/v2`. Run `pnpm install && pnpm lint && pnpm build`; note pre-existing errors.
3. Save this entire prompt to `docs/redesign/PLAN.md`. Create `docs/redesign/PROGRESS.md` with a checkbox for every task below, a "Decisions" log and a "Content needed from Preet" list. Update it as you go — it is how we resume across sessions.
4. Add `scripts/screenshot.mjs` (Playwright; add `@playwright/test` as a devDependency and run `pnpm exec playwright install chromium` once) that captures full-page screenshots of `/`, `/about`, one `/work/[slug]` and the three `/projects/*` demo pages at 390×844, 768×1024 and 1440×900, in light and dark, into `docs/redesign/screenshots/<label>/` (skip routes that don't exist yet). Capture `before` now. If Playwright cannot run here, say so and continue.
5. Work phase by phase. **Stop at the end of every phase**: show screenshots, list what changed and what's next, and wait for me to say "continue".

## Non-negotiables

- **Never invent facts, dates, metrics, employers, roles or links.** Use only content already in the repo or the résumé. Where something is missing, render a visible placeholder like `[TODO: month year]` and add it to "Content needed from Preet".
- Keep claims consistent across the site and the résumé. When sources disagree, use the more conservative wording and log a TODO.
- No major-version upgrades. Allowed: `next` to the latest 16.x, `react`/`react-dom` to 19.3.x (needed for `<ViewTransition>`), add `lenis`. Do **not** add GSAP, Three.js or any other animation library.
- Server Components by default; `"use client"` only on leaf components that need state or effects.
- Every animation respects `prefers-reduced-motion` **and** the existing manual motion setting (`MotionSettingsProvider`). No content may depend on JS animation to become visible.
- WCAG 2.2 AA: visible focus, focus never hidden behind sticky UI (`scroll-padding-top`), targets ≥ 24×24 CSS px (keep the existing 44px targets), text contrast ≥ 4.5:1.
- Old URLs keep working: `/?project=<slug>` redirects to `/work/<slug>` (use `redirects()` in `next.config.mjs` with a `has` query matcher). Keep `/projects/optilang`, `/projects/researchpaper-ai`, `/projects/ai-learning-management` (interactive demos) and link to them from case studies.
- Don't break those demo pages: their styles (`.optilang-theme`, `.research-theme`, `.studyroom-*`, `.project-demo-fullscreen` and related rules in `globals.css`) must keep working. If you restructure CSS, move them into a `demos.css` imported only by those routes, and check each demo page in the screenshot script.
- Small commits, one concern each. `pnpm lint && pnpm build` must pass at the end of every phase.

## Information architecture

**Home page, in this order:**

1. **Header** (sticky): "Preet Patel" (home link) · Work · About · Contact · Résumé (PDF, new tab) · availability dot. Hide on scroll down, show on scroll up, always show on focus. Below 640px: name + "Menu" button that opens a full-screen sheet (focus-trapped, Esc closes).
2. **Hero**
3. **Selected work** (`#work`) — 4 flagship projects, large
4. **Experience** (`#experience`) — Rang Technologies, fully visible
5. **More work** (`#more-work`) — compact index with filters
6. **About** (`#about`) — everything else, condensed
7. **Contact + footer** (`#contact`)

**Remove from the home page** (move components to `src/components/_archive/` during Phases 2–3; delete in Phase 5):
"What I build" focus grid (→ hero), Education (→ About), the 10-chapter Journey carousel (→ About timeline + `/about`), Online Presence live stats (→ plain links), Tech Stack icon grid (→ About toolbox), the auto-scrolling projects marquee (→ Selected work), Engineering map (→ filters in More work), Project design explorer (→ each case study), Research & learning (→ About), Hackathons (→ About), the terminal-portfolio iframe (→ footer link), the saved/compare-projects UI, the HLS space-video background (`site-background.tsx`), and `BlurFade` wrappers on every block.

**New routes:** `/work/[slug]` (statically generated case studies), `/about` (the longer story). Keep `/blog` out of navigation and the sitemap and set `robots: { index: false }` on it until it has posts.

## Design direction — "Cited"

**Idea:** my strongest project, ResearchPaper AI, answers questions and cites the exact page. The portfolio does the same: a few key claims carry numbered citations that open their evidence (repo file, live demo, metric definition, résumé). Spend all the boldness on that one idea; keep everything else quiet, precise and fast.

**Color tokens** — CSS variables in `globals.css`, mapped into Tailwind v4 `@theme`. Light is the default theme `[DEFAULT_THEME = light — change to "dark" or "system" if Preet prefers]`; dark is a fully designed alternative via the `.dark` class (keep `next-themes`). Delete the forced-dark `:root` overrides in `portfolio-polish.css` and every hard-coded hex in component CSS.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F6F7F4` | `#0F1522` | page background |
| `--ink` | `#14171F` | `#ECEDE8` | primary text |
| `--graphite` | `#565E6C` | `#9BA3B4` | secondary text (≥ 6:1 on paper) |
| `--rule` | `#D9DCD6` | `#263049` | hairlines, row dividers |
| `--highlight` | `#F2E35C` | `#EAD95A` (≈35% alpha as an underlay) | **only** for cited claims |
| `--link` | `#2B44D1` | `#9DAEFF` | links, focus ring, active states |

Rules: no decorative gradients, glows or drop shadows (use contrast and rules); radius 6px for controls and 14px for media frames; never recolor/italicize a single word of a headline for emphasis — the highlight is reserved for cited claims.

**Typography** — remove Bodoni Moda, Manrope and the hard-coded Georgia.
- Schibsted Grotesk (variable, `next/font/google`) — display + UI.
- Newsreader (variable with `opsz`, `next/font/google`) — case-study prose and citation notes.
- DM Mono — real code only (never for labels).
- If a family isn't available in `next/font/google` for the installed Next version, use its `@fontsource-variable/*` package.

| Role | Size | Line height | Tracking / weight |
|---|---|---|---|
| Display (hero h1) | `clamp(2.75rem, 1.6rem + 4.6vw, 6rem)` | 1.02 | -0.03em / 600 |
| h2 | `clamp(2rem, 1.4rem + 2.4vw, 3.5rem)` | 1.05 | -0.02em / 600 |
| h3 (project titles) | `clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)` | 1.1 | -0.01em / 600 |
| Lead | 1.25rem | 1.5 | 400 |
| Body | 1.0625rem, max 66ch | 1.6 | 400 |
| Prose (Newsreader) | 1.1875rem, max 68ch | 1.65 | 400 |
| Meta | 0.875rem | 1.45 | 500 |

Sentence case everywhere. No all-caps eyebrows above headings, no pill labels, no tracked-out labels, no middle-dot meta strings, no `01 / 02` numbering unless the content is a real sequence (citations and the timeline are).

**Layout:** 12-column grid; max-width 1320px; inline padding `clamp(1.25rem, 4vw, 3rem)`; 24px gutters; everything left-aligned (no centered section headings). Section spacing `clamp(6rem, 12vw, 10rem)`. At ≥ 1100px the right three columns of text sections form a margin for citation notes.

**Motion tokens:** `--dur-fast 120ms`, `--dur-base 220ms`, `--dur-slow 360ms`, `--dur-hero 700ms`; `--ease-out cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out cubic-bezier(0.65, 0, 0.35, 1)`. Allowed motion: (1) one hero load sequence, (2) responses to user actions (hover, open, navigate), (3) the View Transition from a work row's media to its case-study hero. Nothing loops, nothing auto-scrolls. No custom cursor, no preloader, no marquee, no scroll-jacking.

## Signature: citations

- `<Cite id="...">claim</Cite>` renders the claim with a highlighter underlay (`linear-gradient(transparent 55%, var(--highlight) 55%)`) and a superscript **button** `[n]`. Numbers follow reading order per page.
- Activating `[n]` opens a note. ≥ 1100px: in the margin column, aligned to the line, never overlapping another note (stack them). < 1100px: an inline disclosure under the paragraph. Button has `aria-expanded`/`aria-controls`; Esc closes; focus returns to the marker.
- Note content lives in `src/content/citations.ts`: claim, 1–2 sentence explanation, evidence links (repo file, demo, résumé) and an optional tiny visual (e.g. a two-bar 57 → 37 instruction comparison for OptiLang).
- Load sequence (once per session; skipped under reduced motion): text renders immediately — the h1 is the LCP, never hide it — then the highlight sweeps across each cited phrase (`background-size` 0% → 100%, 700ms, 120ms stagger) and the markers fade in. Total under 1.4s.
- Use citations sparingly: hero (3), Experience (1), each Selected work item (1). Nowhere else on the home page.

## Section specs

### Hero (no background video, particles or grid patterns)

- `h1`: "Preet Patel builds software that shows its work."
- Lead (first person, graphite): "I'm a final-year Computer Science student at Delhi Technological University. I've built a research assistant that cites the page behind every answer[1], an attendance platform for 50+ employees at Rang Technologies[2], and a compiler for a small C-like language in C++17[3]."
  - [1] ResearchPaper AI: page-aware extraction → FAISS retrieval → streamed answer with page citations; public demo uses a prepared sample. Links: demo, source (`app/services/chat_service.py`).
  - [2] Rang Technologies, Software Development Intern, Jun–Aug 2026: Flask + Supabase, IP-based verification, admin analytics, 10+ endpoints optimized, manual processing down 80%. Link: résumé.
  - [3] OptiLang: Flex/Bison front end, semantic checks, three-address code, five optimization passes; on the repo's demo program 57 → 37 instructions (35%) in ~0.34 ms. Links: demo, source.
- Availability line with a status dot: `[TODO: e.g. "Open to software engineering and applied-AI roles for 2027 — Delhi, remote or relocation"]`.
- Actions: "View selected work" (→ `#work`), "Email me" (mailto), text link "Résumé (PDF)".
- Portrait: right column at ≥ 1024px (4:5, `next/image`); below 1024px it moves to About. Remove "Hi, I'm Preet.", the rotating Fullstack/Founder/Creative word and the credibility pills.

### Selected work (`#work`)

- Heading "Selected work" + one short intro line. Four rows, in order: **ResearchPaper AI**, **OptiLang**, **Studyloom** (the AI Learning Management System — use the product name, subtitle "AI course builder"), **Foodfolk** `[TODO: or SubbieGuard — Preet decides]`.
- ≥ 1024px: text in columns 1–4 (h3 title, one-liner, role `[TODO]`, stack as plain text, one cited proof, links "Live demo", "Source", "Read case study"), media in columns 5–12 (16:10, 14px radius). Mobile: media first, then text. Rows are separated by rules, not cards.
- Media: existing demo MP4s (`public/projects/*-demo.mp4`) with their posters; `preload="none"`; play muted + loop only while hovered/focused or ≥ 60% in view; pause otherwise; under reduced motion show the poster and a "Play preview" button. Projects without video use a `next/image` screenshot.
- The title and "Read case study" link to `/work/[slug]`; the media frame is wrapped in `<ViewTransition name={`work-media-${slug}`}>` (same name on the case-study hero).
- One-liners (from the data, keep facts):
  - ResearchPaper AI — "Ask a research paper anything; every answer cites the page it came from."
  - OptiLang — "A compiler for a small C-like language, from tokens to optimized three-address code."
  - Studyloom — "Turns a topic into a course: outline, notes, flashcards and quizzes, generated in the background."
  - Foodfolk — "A restaurant map shaped by your friends' recommendations."
- Demo caveats ("prepared sample", "synthetic data") move to an "About this demo" note on the case-study page — not on the home page.

### Experience (`#experience`)

- Rang Technologies — Software Development Intern — Remote (New Jersey, USA) — Jun–Aug 2026, small logo. Visible by default (remove the accordion).
- Three short bullets from the data (platform; verification and visibility; performance) and an outcome line with a citation: "Manual attendance processing down 80%[n]". Stack as plain text.
- The title differs between sources ("Software Development Intern" vs "Software Development / Data Analytics Intern"): use the résumé's and log a TODO.

### More work (`#more-work`)

- Filter buttons (`aria-pressed`): All, AI & ML, Full-stack, Systems, Data, Security — derived from project domains.
- A semantic list of rows (not cards): name, one-liner, status (Live demo / Prototype / Ongoing research / Sample data), stack (max 3), links. Include SubbieGuard (or Foodfolk), Fieldnote, Ledgerline, Signal and the crypto-ransomware research (no links; status "Ongoing research").
- Fine-pointer desktops only: hovering a row shows a small preview image near the cursor (transform-only, rAF-throttled, off under reduced motion); keyboard focus shows it in a fixed slot.

### About (`#about`) — condensed

- Bio, 3–4 sentences, first person, from existing copy (grew up in Al Jubail, Saudi Arabia; moved to Delhi for DTU; what I like building). Portrait here on mobile.
- Now: one sentence on the ongoing crypto-ransomware research (Cuckoo Sandbox behavioral features, Random Forest, SHA-256 signature matching).
- Timeline, max 6 rows: 2019–2023 school in Al Jubail (PCM + CS) · 2023 B.Tech CSE at DTU · 2024 Smart India Hackathon · `[TODO: year]` ResearchPaper AI, Studyloom, OptiLang · Jun–Aug 2026 Rang Technologies · Now: research and looking for my next team. Link "The longer story" → `/about`.
- Education: DTU (B.Tech CSE, 2023–2027); International Indian School Al Jubail (2021–2023).
- Toolbox: grouped plain text (Languages, Backend, AI and data, Frontend, Tools). No icon circles.
- Beyond code: U-19 regional cricket (Al Jubail), national hackathons, IBM SkillsBuild (RAG and generative AI), Kaggle (ML and Python).
- Elsewhere: GitHub, LinkedIn, LeetCode, NeetCode as plain links. No live counters; stop calling `/api/online-presence` (delete the route in Phase 5).

### Contact + footer (`#contact`)

- Large "Let's talk." + availability sentence (TODO). Email as a large link + "Copy email" (reuse the existing copy logic and live region). LinkedIn, GitHub, Résumé.
- Footer: © year, live Delhi time (IST, `<time>`, updates each minute), theme toggle (Magic UI Animated Theme Toggler, reduced-motion safe), motion toggle (existing setting), "Prefer a terminal?" → https://preet-patel-portfolio.vercel.app/ (new tab; no iframe).
- Fix today's bug where the contact copy column collapses to 2–3 words per line at desktop widths.

### Case studies (`/work/[slug]`)

`generateStaticParams` + `generateMetadata` from data; an `opengraph-image` per project. Sections, skipping any without data:

1. Top bar: "All work" (`<Link transitionTypes={['nav-back']}>`) and "Next: <project>" (`nav-forward`).
2. Title, one-liner, facts (Role, Timeline, Status, Stack), primary links (Live demo, Source, Interactive preview → `/projects/*` where it exists).
3. Hero media with the same `ViewTransition` name as the home row (video in a Magic UI `Safari` frame, or a screenshot).
4. Problem → What I built → How it works (architecture stages as an accessible stepper: stage list; selecting one shows input, output, contribution and source link) → System design (port the design-explorer overview / services / data model from `project-design-explorer.ts` + `project-schemas.ts`) → Decisions → Results (with citations) → Limitations and next steps → What I learned.
5. "About this demo" note.
6. Contact CTA + next project.

Prose in Newsreader, UI in Schibsted Grotesk, max 68ch. Once the pages work, delete the modal flow (`project-details.tsx`, `project-viewer.tsx`, `ProjectDetailsShell`) and the saved/compare feature.

## Data

- Move content into typed, JSX-free modules in `src/content/`: `profile.ts`, `projects.ts`, `experience.ts`, `timeline.ts`, `citations.ts`. Links become `{ kind: 'demo' | 'source' | 'case-study' | 'preview', href }`; components map kinds to icons.
- Per project: `slug`, `name`, `subtitle`, `oneLiner`, `role` (TODO), `period` (TODO), `status`, `featuredRank`, `domains`, `stack`, `media { poster, video?, alt }`, `proof?`, plus the existing `caseStudy`, `architecture`, `screenshots` and design-explorer references.
- Resolve inconsistencies conservatively and log TODOs: "Foodfolk" vs "FoodSocial"; "DGS — Career Development Platform" (only in the journey — drop unless it gets a page); the intern title; the journey's "50K+ credit records · 100K+ e-commerce orders" vs project cards that say the data is synthetic or sample; OptiLang "eight-stage" / "LLVM IR" (résumé) vs the site's wording; the "During B.Tech" dates.

## Performance, accessibility, SEO

- Targets (p75): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Lighthouse mobile: Performance ≥ 90; Accessibility, Best Practices and SEO ≥ 95.
- Remove `hls.js` and the Mux background stream, the iframe, and the unused template images in `/public` (`buildspace.jpg`, `atomic.png`, `lime.svg`, `splunk.svg`, `ib.png`, `nvidia.png`, `laurier.png`, `waterloo.png`, `shopify.svg`, `mitremedia.png`, `me.png`) after grepping for references.
- Every image through `next/image` with correct `sizes`. Re-export `crypto-ransomware-preview.png` (1.2 MB) and `preet-patel-avatar.jpg` (396 KB, shown at 112px today) at sensible dimensions.
- If `ffmpeg` exists, re-encode the three ~6 MB demo MP4s to < 2 MB each: `ffmpeg -i in.mp4 -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart out.mp4`, plus a VP9 WebM. Otherwise log a TODO.
- Fonts via `next/font` only, latin subset, only the weights used.
- Accessibility: skip link; landmarks; one h1 per page; focus ring 2px `--link` with 3px offset; Esc closes notes and menus; under reduced motion no transforms, no autoplay, View Transitions and Lenis off. Run axe (`@axe-core/playwright` in the screenshot script) on `/`, `/about` and one case study: zero serious or critical issues.
- SEO: title "Preet Patel — Software Engineer (AI & Backend)", description from data, canonical URL, Open Graph/Twitter per page; redesign `src/app/opengraph-image.tsx` in the new identity; add `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `icon.svg` + `apple-icon` (a "PP" monogram) replacing the default Next.js favicon; JSON-LD `Person` (name, jobTitle, alumniOf DTU, sameAs GitHub/LinkedIn, url); remove the empty `verification` fields.

## Phases (stop after each one)

- **Phase 0 — Baseline:** branch, install, build, `PLAN.md`, `PROGRESS.md`, before screenshots.
- **Phase 1 — Foundations:** tokens (light + dark), fonts, type scale, grid/container, motion tokens and reduced-motion utilities, remove the space video and the `portfolio-polish.css` overrides (fold anything still needed into `globals.css`), header and footer shells, skip link, theme toggle, data refactor into `src/content/`.
- **Phase 2 — Home page:** hero with citations, Selected work, Experience, More work, About, Contact. Old sections out of `page.tsx`.
- **Phase 3 — Case studies and /about:** routes, metadata, OG images, stepper and system design, next/previous, `?project=` redirect, remove the modal and saved/compare.
- **Phase 4 — Motion and polish:** hero sequence, `ViewTransition` morph and directional navigation (upgrade to the latest Next 16.x and React 19.3.x if needed), optional Lenis (off for reduced motion and touch), More-work hover preview, micro-interactions. Then critique your own work: screenshot every page at 390/768/1440 in both themes, list the 10 weakest details, fix them, and screenshot again.
- **Phase 5 — Performance, accessibility, SEO:** everything in the section above; delete `_archive/`, unused dependencies (`hls.js`; `react-markdown` only if nothing uses it) and unused images.
- **Phase 6 — Final QA:** before/after screenshots, the final "Content needed from Preet" list, a short `docs/redesign/CHANGELOG.md`, open a PR (don't merge).

## Done when

- On 1440×900 the first Selected-work project is visible within ~1.2 screen heights of the top; on a 390px phone within ~2.
- The home page has exactly six sections after the header; nothing moves on its own.
- Both themes pass contrast; a keyboard-only run-through works on every page.
- Lighthouse mobile meets the targets; build and lint pass; no console errors.
- Every number on the site traces to a citation or the résumé, and every placeholder is listed for Preet.

## How to work

- Before each phase, add a short plan (files you'll touch) to `PROGRESS.md` and keep a todo list.
- Prefer refactoring what works (copy-email logic, motion settings provider, architecture and design-explorer data, demo pages) over rewriting from scratch.
- For version-specific Next.js APIs (`<ViewTransition>`, `Link` `transitionTypes`, `redirects` with `has`, metadata files), read the docs bundled in `node_modules/next/dist/docs/` for the installed version before writing code. If an API is missing, upgrade within Next 16.x / React 19.3.x as allowed above.
- Magic UI components you may use: `Safari` (device frame), Animated Theme Toggler. Install them from the Magic UI docs via the shadcn CLI; if the CLI fails, copy the source from magicui.design. Don't use Marquee, Meteors, Particles, Sparkles Text, Border Beam, Shine Border, Confetti, Smooth Cursor or Number Ticker (static numbers read as more credible).
- When a product or visual decision is unclear, choose the quieter option and record it under "Decisions".
