# Washland — Kondapur Zone (PRD + SRS v1.2)

Document type: PRD + SRS (v1.2 — Localized Scope + Referral System)
Service area: 12 km radius around Kondapur, Hyderabad, India
Base Store: Washland Main Outlet — Kondapur

---

## 1) Summary
Build a localized web + mobile system for customers to book laundry services with doorstep pickup and delivery within a 12 km radius of the Kondapur outlet. MVP covers customer booking (web), admin/store dashboard (web), and minimal rider workflow. Integrations: payment gateway (Razorpay/PayU), WhatsApp notifications, and OTP login.

## 2) Phase-1 Services
- Dry Cleaning
- Steam Ironing
- Saree Rolling
- Saree Polishing
- Saree Pre-Pleating
- Stain Removal
- Shoe Cleaning
- Bag Cleaning

Admin should be able to add services, pricing, and photos via the dashboard.

## 3) Roles & Permissions
- Customer: book, pay, track, earn/redeem points, referrals
- Admin: manage services, orders, coupons, riders, referrals, loyalty, reports
- Store Operator: POS, walk-ins, in-store payments
- Rider: assigned pickups/deliveries only

## 4) High-level Customer Flow
1. OTP login (phone)
2. Select service(s), add to cart
3. Schedule pickup (date/time slot) within supported area
4. Checkout (UPI/card/COD) and receive WhatsApp/SMS updates
5. Rider picks up, store processes items, delivery back to customer

## 5) Referral & Loyalty (MVP)
- Unique referral code/link per customer
- Rewards:
  - Referrer: ₹100 credit (or 100 points) after referred user's first *completed* order
  - Referred: ₹50 welcome credit on first order (one-time)
- Points: 1 point per ₹10 spent; 1 point = ₹1 (default); configurable maximum % of order redeemable (e.g., 20%)
- Expiry: 6 months by default
- Admin controls to modify values and manually adjust points
- (Phase-2) Wallet to reflect credits and history

## 6) Admin Dashboard — MVP Modules
- Services (CRUD + images)
- Orders (status flows, assign rider)
- Coupons & discounts
- Referral & loyalty management
- POS (in-store orders)
- Reports and notifications (WhatsApp)

## 7) Payments & Invoices
- Integrate Razorpay or PayU for UPI and card payments
- Support COD for walk-ins
- Automatic GST invoice generation (PDF) and GSTIN capture for business customers

## 8) Notifications
- Use WhatsApp Business API / Twilio for templated messages for: order confirmed, pickup assigned, picked up, processing started, ready for delivery, out for delivery, delivered, loyalty/referral credits

## 9) Rider Module
- View assigned pickups/deliveries (within 12 km)
- Update status (Picked, Delivered)
- Capture photo & OTP confirmation at delivery

## 10) Service Area
- Enforce 12 km radius from Kondapur outlet at address entry / scheduling; block addresses outside the radius

---

# What's pending / prioritized implementation checklist (recommended order)

Top priority (blockers for MVP launch):
1. OTP phone login (secure rate-limited flow) — required for onboarding and referrals.
2. Payment gateway integration (Razorpay/PayU) and server-side order creation + webhooks.
3. Referral & loyalty backend (referral codes, validation, crediting after "order completed").
4. Service area enforcement (12 km radius check) on address and scheduling.
5. WhatsApp notification integration for key order events.
6. Admin dashboard: add/edit services, view orders, assign riders, coupon management.
7. Dev server health: reproduce and fix `.next/routes-manifest.json` ENOENT error (required for developer QA).

High priority (MVP features that follow):
8. Rider module basic web app (status updates, photo, OTP).
9. Coupon & discount application and audit logs.
10. GST invoice generation (PDF) and storing invoice history.
11. Points expiry cron job (6 months) and admin manual adjustments.

Lower / Phase-2 items:
12. Wallet system (reflect referral/loyalty credits; usable in checkout).
13. Rider route optimization (Google Maps) and multi-outlet/franchise support.
14. Subscription plans, customer feedback & rating module.

---

## Technical contract (short)
- Inputs:
  - Customer: phone, name, address (lat/lon), cart (service id(s), quantity), preferred pickup slot, payment method.
  - Admin actions via dashboard: create/update services, coupons, referral configs.
- Outputs:
  - Order created with status transitions (Created → Pickup Assigned → Picked Up → Processing → Ready → Out for Delivery → Delivered).
  - Wallet/points/referral ledger entries.
- Success criteria:
  - Users within 12 km must be able to complete a paid booking end-to-end.
  - Referral credits are only applied when the referred user's first order is completed.
  - Admin can add and edit services and coupons.

## Suggested DB schema (minimal / illustrative)
- users (id, phone, name, email, role, created_at)
- services (id, title, slug, description, price_inr, unit='per kg', images[])
- orders (id, user_id, status, total_amount, paid, payment_provider, created_at, pickup_at, address, lat, lon)
- order_items (id, order_id, service_id, qty, price)
- referrals (id, referrer_id, referred_id, code, status ENUM(pending, credited), created_at)
- loyalty_points (id, user_id, points, source, expires_at, created_at)
- wallets (id, user_id, balance, created_at)
- coupons (id, code, type(enum percent|flat), value, cap, active)
- riders (id, name, phone, current_location_lat, current_location_lon)

## API endpoints (MVP surface)
- POST /api/auth/otp (request OTP)
- POST /api/auth/verify (verify OTP, return session)
- GET /api/services
- POST /api/orders (create order)
- GET /api/orders/:id
- POST /api/payments/create (create payment order)
- POST /api/payments/webhook (payment status updates)
- POST /api/referral/apply (apply referral code)
- GET /api/admin/services, POST /api/admin/services, etc.

## Edge cases to handle
- Duplicate referral abuse — ensure single reward per referred user, validate by unique phone and first completed order only.
- Partial refunds and points rollback (if order cancelled or refunded).
- Failed payments / webhook retries and reconciliation.
- Address geocoding failures — fallback to manual lat/lng entry or deny with helpful UX.
- Points expiry and retroactive adjustments.

## Implementation notes & suggestions
- Use Next.js API routes for server actions; keep payment secret keys in server environment (`.env`).
- Store lat/lon for addresses at time of booking to avoid later ambiguity.
- Use a background worker or serverless cron (e.g., GitHub Actions scheduled, or provider cron) for points expiry and wallet cleanups.
- WhatsApp templates must be pre-approved by Meta/Twilio; design templated messages with placeholders for order id, customer name, etc.
- For OTP, consider third-party providers (Twilio, MSG91) and implement rate limiting + retry limits.

## Quick estimates (very rough)
- OTP login + basic auth: 1–2 days
- Payment integration + webhooks + invoice PDF: 2–3 days
- Referral & loyalty core backend + admin UI: 2–4 days
- Admin dashboard (CRUD services, orders view): 3–5 days
- Rider module (basic): 2–3 days
- WhatsApp integration (templating + senders + tests): 2–4 days

---

## Next immediate actions I can take now
1. Create a prioritized implementation plan and break the top 3 features into tickets (APIs, DB schema, UI pages). 
2. Reproduce the dev server ENOENT issue and capture logs so we can unblock visual QA. 
3. Start implementing the referral & loyalty DB models and API endpoints (I can scaffold models and endpoints if you want).

If you want, I can now:
- scaffold the referral & loyalty models and API routes in the repo, or
- reproduce the dev server issue and show logs (I will need to run `pnpm dev`), or
- create detailed tickets for the top-priority items with acceptance criteria.

Please tell me which of the three you want me to do next.