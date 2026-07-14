# Lima's Kitchen — DESIGN

## Theme decision (scene sentence)
A Bengali woman in Welling, phone in hand between school runs, ordering biryani for her
son's aqiqah from someone her family already trusts, in warm afternoon light. Warm, calm,
daylight. => **Light, warm paper ground.** Not dark. Not clinical white.

## Color strategy: Committed
Terracotta carries the surface; deep teal grounds it; marigold accents sparingly (<8%).
All OKLCH. Neutrals tinted toward terracotta. Never #000/#fff.

### English mode (warm oatmeal paper)
- `--paper`      oklch(0.968 0.012 74)    warm oatmeal
- `--paper-2`    oklch(0.945 0.016 72)    slightly deeper panel
- `--ink`        oklch(0.255 0.024 40)    warm near-black (cocoa)
- `--ink-soft`   oklch(0.45 0.03 45)      muted body
- `--terracotta` oklch(0.58 0.14 40)      primary (clay oven)
- `--terracotta-deep` oklch(0.47 0.135 38)
- `--teal`       oklch(0.44 0.072 205)    deep pottery teal (secondary)
- `--teal-deep`  oklch(0.34 0.06 210)
- `--marigold`   oklch(0.78 0.15 78)      accent, prices/highlights only
- `--line`       oklch(0.86 0.02 60)      hairlines

### Bengali mode (warmer, gilded — its own world)
Deeper terracotta paper ground, gold linework, higher ornament density. Not the same page
with different text: the ground darkens to clay, kantha stitching becomes gold, headings
gain a serif Bengali treatment.
- `--paper`      oklch(0.93 0.026 68)     deeper clay paper
- `--paper-2`    oklch(0.9 0.03 64)
- `--terracotta` oklch(0.53 0.145 38)
- `--marigold`   oklch(0.74 0.16 76)  (gold linework)
- ornament opacity and stitch density increase

## Typography
- **English headings:** "Fraunces" (optical serif, warm, characterful) — the "home cook's
  handwriting made typographic". Weight 500-600, slight optical size.
- **English body:** "Inter" / system — 16-18px, line length 60-70ch.
- **Bengali:** "Hind Siliguri" for body + nav (clean, screen-legible Bangla) and
  "Baloo Da 2" for Bengali display headings (rounded, warm, ornamental) so Bengali mode
  has a distinct type voice, not Latin-fallback tofu.
- Scale ratio ~1.28. Dish name is primary in active language; other language is a smaller
  subtitle beneath.

## Motifs & texture
- **Nakshi kantha running-stitch**: a dashed hairline used as section dividers and card
  edges (SVG/CSS dashed border in terracotta/gold). Evokes hand-quilting by women at home.
- **Alpona corner flourish**: a small SVG paisley/lotus linework mark at section headers.
- Subtle paper grain via layered radial gradients (no external texture image required so it
  works before photos land).

## Elevation & shape
- Soft, low, warm shadows (terracotta-tinted, never grey/blue). Radius 14-18px on panels,
  full pill on buttons. Cards used sparingly — menu uses a warm ledger/list rhythm, not a
  card grid, to avoid the identical-card-grid slop.

## Motion
- Ease-out-quint for reveals; language toggle cross-fades ground + swaps ornament. Respect
  prefers-reduced-motion. No layout-property animation.

## Imagery (deferred — Higgsfield blocked at build time)
All food photos load via a single manifest `assets/img/manifest.js` keyed by slot
(hero, noodles, biryani, ...). Until real photos exist, each slot renders a hand-built CSS
"dish medallion" (layered warm gradients + alpona linework) so the site looks intentional,
not broken. Dropping real JPGs into assets/img/ + flipping the manifest flag swaps them in
with zero code change.
