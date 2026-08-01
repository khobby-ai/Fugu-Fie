# Fugu Fie — Smock Store

A full storefront: catalog, cart, checkout, and real payment (card + Mobile
Money via Paystack). Backend is Express with JSON-file storage — no database
setup required to get running.

## Design notes

The visual language is built around how a smock is actually made: narrow
hand-loomed cotton strips sewn together. That's why a repeating vertical-band
pattern (deep plum-purple / rust / cream) shows up as the header underline,
section dividers, and footer — it's standing in for the strip-weave
construction rather than decorating for its own sake. Palette: raw cotton
background, deep plum-purple as the main color, kola-nut rust, and a
restrained millet-gold accent.

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Get free Paystack test keys:
1. Sign up at dashboard.paystack.com (free, instant — no approval wait for test mode).
2. Settings → API Keys & Webhooks → copy the **Test** secret and public keys.
3. Put the secret key in `server/.env` as `PAYSTACK_SECRET_KEY`.

Test mode lets you run full checkouts with fake card numbers (Paystack's
docs list test cards) before you ever touch real money. Switching to live
keys later requires a short business verification on Paystack's side.

```bash
npm start
```

Runs on http://localhost:4000.

## 2. Frontend setup

```bash
cd client
npm install
npm run dev
```

Runs on http://localhost:5173. No `.env` needed on the frontend — the public
key isn't used here (see note below on why).

## 3. Try it end to end

1. Browse the catalog, add a smock to your cart, pick a size.
2. Go to checkout, fill in your details, click Pay.
3. You'll be sent to Paystack's own hosted checkout page — pay with a
   Paystack test card (card or Mobile Money).
4. Paystack redirects you back to the site automatically. The backend
   verifies the payment server-side (never trust the client alone) before
   marking the order paid.

### Why a redirect instead of a popup

The frontend never touches Paystack directly — the backend starts the
transaction (using the secret key, which must never be exposed to a
browser) and hands the customer a one-time checkout link. This is simpler
to get right than the embedded-popup approach, since there's no public key
or client-side parameters that can be missing or mismatched — if it works
once with valid test keys, it keeps working.

## 4. Set up WhatsApp order notifications (free)

Uses CallMeBot, a free personal-use API for pinging your own number:

1. Save `+34 644 59 71 65` as a contact on your phone — call it "CallMeBot" or similar.
2. Open WhatsApp (not Signal) and message that contact exactly:
   `I allow callmebot to send me messages`
3. Within a couple minutes it replies with your personal API key.
4. In `server/.env`, set `CALLMEBOT_PHONE` to your WhatsApp number (international
   format, no + or spaces — e.g. `233241234567`) and `CALLMEBOT_APIKEY` to the
   key from step 3.

Once set, you'll get a WhatsApp ping when: a new order starts, a payment is
confirmed, an international quote is requested, and when someone submits a
custom smock request. If these two vars are left blank, the site still
works fine — notifications just get skipped (logged to the server terminal
instead).

## 5. Set up the custom-request WhatsApp link

In `client/.env` (copy from `client/.env.example`), set `VITE_WHATSAPP_NUMBER`
to your WhatsApp number in the same international format as above. This
powers the "Continue to WhatsApp" button on the Custom Request page — it
opens a pre-filled chat with you, and the customer attaches their reference
photo themselves before sending (WhatsApp's free tools don't let a website
attach a file to someone else's message — only their own WhatsApp app can
do that, which is why this is a handoff rather than fully automatic).

## What's deliberately left out of this MVP

- No admin panel — edit `server/data/products.json` directly to add/change stock.
- No product photos — thumbnails are placeholder color blocks with the
  product name; swap in real photography whenever you have it (drop images
  in `client/public/` and reference them in `products.json`).
- Orders land in `server/data/orders.json` in addition to the WhatsApp
  pings from section 4 — useful as a full record, or a fallback if a
  notification ever fails to send. This matters most for international
  orders: check for entries with `"status": "quote_requested"` — those
  are customers waiting on you to work out real shipping cost.
- No user accounts — checkout is guest-only, which is normal for a store
  this size.
- Orders/products live in JSON files, fine for low volume; move to a real
  database (Postgres, SQLite) once you're past a few hundred orders.
- CallMeBot is free for personal use but rate-limited and not built for
  high volume — fine for a store this size, but if orders scale up
  significantly, a paid WhatsApp Business API (via Twilio or Meta directly)
  is the more reliable long-term option.
