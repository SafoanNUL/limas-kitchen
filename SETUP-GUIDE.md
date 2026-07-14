# Lima's Kitchen — owner & operations guide

Site: **https://safoannul.github.io/limas-kitchen/**
Orders land instantly in the Airtable base **"Limas Kitchen" → Orders**
(account saf.home.2017@gmail.com). Two pipeline-proof orders are already there
(LK-YBP3E from launch, LK-VPJ4K from the v2 relaunch).

## 1. Mum's order book (5 minutes)

1. Install the **Airtable** app on her phone (free).
2. On airtable.com → open **Limas Kitchen** → **Share** → invite her email as collaborator.
3. In the app, the **Orders** table shows every order: name, phone (tap to call),
   the dishes in plain words, total to take in cash, allergies, notes.
4. One habit: after the confirmation call, flip **Status** New → Confirmed
   (→ Ready → Collected on the day). The colours make the day's work obvious.

## 2. Email alert on every new order (2 minutes, dashboard-only)

Airtable Automations can't be created via API, so once, by hand:

1. Open the base on a computer → **Automations** → **Create automation**.
2. Trigger: **When a record is created** → table **Orders**.
3. Action: **Send email** → to her/your email → subject `New order {Ref} — {Name}` →
   body: insert fields Ref, Name, Phone, Needed for, Collection time, Order, Total £,
   Friends code, Allergies, Notes.
4. Turn it **On**. (Free plan: 100 runs/month — plenty.)

## 3. Prices, menu, friends code

Edit [site/lib/menu.ts](site/lib/menu.ts) (prices in pence, real/friends prices;
`PUBLIC_MARKUP`, `FRIENDS_CODE`, `MIN_LEAD_HOURS` at the top), then:

```bash
cd site && pnpm run publish:site && cd .. && git add -A && git commit -m "menu" && git push
```

**Business note (not on the site):** the +20% public tier only earns anything if
non-friends actually order. If it stays friends-only, set `PUBLIC_MARKUP` to `0`.

## 4. Security

- The token in the site is **write-only**, scoped to this single base: it can create an
  order but can never read, list, or edit existing orders (verified: reads return 403).
- The full-access "setup" token must never appear in any file or site. Rotate it at
  airtable.com/create/tokens whenever — nothing on the site uses it.
- The base's leftover empty "Table 1" can be deleted in the Airtable UI (cosmetic).

## 5. Photography (the next big visual upgrade)

The design deliberately works without photos, but real shots of her actual food will lift
trust further. When ready, add images under `site/public/` and slot them into the hero /
story / bundle components. (Higgsfield AI generation stayed blocked at build time:
account is trial-restricted to MCP-only usage.)

## 6. Legal before advertising

Register as a food business with **Bexley Council** — free, required at least **28 days
before** trading/advertising. Level 2 food hygiene certificate strongly recommended.
Allergens are shown per dish and captured per order on the form.

## 7. If something breaks

- Orders not appearing? Check airtable.com → Limas Kitchen → Orders directly.
- Any submit error shows customers her number (07404 034660), so orders fall back to a
  phone call, never into a void.
- Neither GitHub Pages nor Airtable pauses, expires, or bills at this scale.
