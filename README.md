# Lima's Kitchen · লিমা'স রান্নাঘর

A bilingual (English/Bengali) one-page ordering site for a home-based Bengali party-food
kitchen in Welling DA16. Collection only, cash on collection, no online payment.

- **Live site:** https://safoannul.github.io/limas-kitchen/
- **Orders land in:** Airtable base "Limas Kitchen" → Orders table (owner views them in
  the Airtable mobile app; an Airtable Automation emails each new order).
- **Stack:** static HTML/CSS/JS (no build step), GitHub Pages hosting, Airtable REST API.

## Editing the menu / prices
Everything lives in [docs/assets/js/menu-data.js](docs/assets/js/menu-data.js).
Prices are in **pence** and are the real ("friends") prices; the site shows +20% to
everyone unless the friends code is applied. The code and the markup are at the top of
that file (`FRIENDS_CODE`, `PUBLIC_MARKUP`), the minimum lead time too (`MIN_LEAD_HOURS`).

## Adding real food photos
Drop JPGs into `docs/assets/img/` and set the matching slot filename in
[docs/assets/img/manifest.js](docs/assets/img/manifest.js). Until then the site draws its
own warm dish medallions, so nothing looks broken without photos.

## The order pipeline
Browser → Airtable REST (`typecast:true`) using a **write-only** personal access token
scoped to this single base (it cannot read or list records). Price totals are also stored
so the owner can sanity-check on the confirmation call.

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for the owner/notification setup.
