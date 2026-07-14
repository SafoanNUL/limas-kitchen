# Lima's Kitchen — owner & operations guide

The site is live at **https://safoannul.github.io/limas-kitchen/**
Orders land instantly in the Airtable base **"Limas Kitchen" → Orders** table
(account: saf.home.2017@gmail.com). One order is already in there — ref **LK-YBP3E**,
the launch test.

## 1. Give Mum the order list on her phone (5 minutes)

1. Install the **Airtable** app on her phone (App Store / Google Play, free).
2. On airtable.com, open the **Limas Kitchen** base → **Share** → invite her email
   as a **collaborator** (editor). Free plan allows this.
3. Sign her into the app. The Orders table is her order book: newest at the bottom
   (or sort by "Placed at" descending). Tapping a row shows everything: name, phone
   (tap to call), what they ordered, total to take in cash, allergies, notes.
4. Teach her the one habit: after the confirmation call, change **Status**
   New → Confirmed (and later → Collected). The colours make it obvious.

## 2. Email alert for every new order (2 minutes, one-time)

Airtable can't set this up via its API, so it's a quick manual step:

1. Open the **Limas Kitchen** base on a computer → click **Automations** (top bar).
2. **Create automation** → name it "New order email".
3. Trigger: **When a record is created** → Table: **Orders**.
4. Action: **Send email** → To: her email (and yours) → Subject:
   `New order {Ref} — {Name}` → Message: insert the fields
   `Ref, Name, Phone, Needed for, Collection time, Order, Total £, Friends code, Allergies, Notes`.
5. Turn the automation **On**.

Free plan includes 100 automation runs/month — far more than needed. If she prefers a
phone *push* over email, the Airtable app also sends a notification when a record is
assigned or when a "watched" view changes; email is the simplest reliable option.

## 3. Prices, menu, friends code

Everything is in `docs/assets/js/menu-data.js` in the repo
(github.com/SafoanNUL/limas-kitchen):

- Prices are in **pence** and are the **real (friends) prices**.
- `PUBLIC_MARKUP: 0.2` — everyone without the code sees +20%.
- `FRIENDS_CODE: "LIMAFRIENDS"` — change it here any time.
- `MIN_LEAD_HOURS: 48` — the enforced lead time.

Edit on github.com (pencil icon) → commit → the site updates itself in ~1 minute.

**A business note, not shown on the site:** the two-tier pricing only earns anything if
people *outside* the friends circle order at the +20% price. If it stays friends-only,
just set `PUBLIC_MARKUP: 0` and call it the friends price.

## 4. Adding real food photos (when ready)

The site currently draws its own warm "dish medallion" art. To use real photos:
put JPGs in `docs/assets/img/` and set the matching slot in
`docs/assets/img/manifest.js` (e.g. `hero: "hero.jpg"`). No other changes needed.
Good slots to fill first: `hero`, `ownerNote`, the three bundles.

(The Higgsfield account on this machine is currently trial-restricted to MCP-only usage,
so AI generation was blocked at build time. Fourteen ready-to-run prompts for every slot
are saved in the project conversation; any image source works though — real photos of
her actual food will beat AI images for trust anyway.)

## 5. Security notes

- The token inside the site (`docs/config.js`) is **write-only**: it can create an order
  but can never read, list, or edit existing orders. Customers' details are safe.
- The powerful "setup" token you pasted during the build should be treated as sensitive:
  it can read all orders. Don't put it in any file or website. Rotate it at
  airtable.com/create/tokens whenever you like — nothing on the site uses it.
- The base was created by hand, so an empty default **"Table 1"** exists next to Orders.
  Delete it in the Airtable UI (right-click the table tab) — cosmetic only.

## 6. Legal before advertising (important)

Register the kitchen as a **food business with Bexley Council** — free, and must be done
at least **28 days before** trading/advertising. A **Level 2 food hygiene certificate**
is strongly recommended. Allergen information is already displayed per dish and captured
per order, which supports Natasha's-Law-style diligence for direct sales.

## 7. If something ever breaks

- Site up? https://safoannul.github.io/limas-kitchen/ (GitHub Pages status: githubstatus.com)
- Orders not arriving? Check airtable.com → base → Orders directly; the site also shows
  customers her phone number (07404 034660) on any submit error, so orders fall back to
  a phone call, never into a void.
- Neither GitHub Pages nor Airtable "sleeps" or expires with inactivity, and both are free
  at this scale. There is nothing to keep alive.
