#!/usr/bin/env node
// WCAG contrast for the design tokens in src/app/globals.css (hex values duplicated here on purpose:
// this is a check, not a source of truth). Run: node scripts/contrast.mjs
const themes = {
  light: { paper: "#f6f7f4", ink: "#14171f", graphite: "#565e6c", rule: "#d9dcd6", link: "#2b44d1", highlight: ["#f2e35c", 1] },
  dark: { paper: "#0f1522", ink: "#ecede8", graphite: "#9ba3b4", rule: "#263049", link: "#9daeff", highlight: ["#ead95a", 0.35] },
};
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (top, bottom, alpha) => top.map((c, i) => Math.round(c * alpha + bottom[i] * (1 - alpha)));
const lum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
// Rule: citation markers sit after the highlighted phrase, never on the underlay (link on the dark
// underlay is only 3.3:1), so that pairing is intentionally not part of the design.
let failed = false;
for (const [name, t] of Object.entries(themes)) {
  const paper = rgb(t.paper);
  const under = mix(rgb(t.highlight[0]), paper, t.highlight[1]);
  const rows = [
    ["ink on paper", rgb(t.ink), paper, 7],
    ["graphite on paper", rgb(t.graphite), paper, 6],
    ["link on paper", rgb(t.link), paper, 4.5],
    ["ink on highlight underlay", rgb(t.ink), under, 4.5],
    ["paper on ink (primary button)", paper, rgb(t.ink), 4.5],
    ["rule on paper (non-text, decorative)", rgb(t.rule), paper, 0],
  ];
  console.log(`\n${name}`);
  for (const [label, fg, bg, min] of rows) {
    const value = ratio(fg, bg);
    const pass = value >= min;
    if (!pass) failed = true;
    console.log(`  ${pass ? "PASS" : "FAIL"}  ${value.toFixed(2).padStart(5)}:1  (min ${min || "n/a"})  ${label}`);
  }
}
process.exit(failed ? 1 : 0);
