# Lima's Kitchen · লিমা'স রান্নাঘর

Bilingual (English/Bengali) one-page ordering site for a home-based Bengali party-food
kitchen in Welling DA16. Collection only, cash on collection, no online payment.

- **Live:** https://safoannul.github.io/limas-kitchen/
- **Stack:** Next.js 16 (static export) in [site/](site/), served by GitHub Pages from
  [docs/](docs/). Orders POST straight to Airtable with a write-only token.
- **Orders live in:** Airtable base "Limas Kitchen" → Orders (account saf.home.2017@gmail.com).
  See [SETUP-GUIDE.md](SETUP-GUIDE.md) for the owner's phone setup + email alerts.

## Working on the site

```bash
cd site
pnpm install
pnpm dev            # http://localhost:3000/limas-kitchen/
```

## Editing the menu, prices, code word, lead time

Everything is in [site/lib/menu.ts](site/lib/menu.ts) — prices in **pence**, and they are
the real ("friends") prices. `PUBLIC_MARKUP` (+20% default), `FRIENDS_CODE`
(LIMAFRIENDS) and `MIN_LEAD_HOURS` (48) are at the top. UI copy in both languages lives
in [site/lib/i18n.ts](site/lib/i18n.ts).

## Deploying

```bash
cd site
pnpm run publish:site   # builds and copies the export into ../docs
cd ..
git add -A && git commit -m "update" && git push
```

GitHub Pages serves `docs/` on main; changes appear in about a minute.

## Design

"Midnight dawat": dark editorial theme, huge Fraunces display type, molten saffron and
marigold on deep paan-green (English) / deep clay-maroon with gold (Bengali — its own
world, with Baloo Da 2 / Hind Siliguri type). Language choice persists for the visit.
The friends code reveals real prices site-wide with the public price struck through, and
each order records both totals.
