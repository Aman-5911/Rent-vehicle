# RentWheels Functional Audit

## Baseline at Audit Start

| Area | Current behavior | Persistence |
|---|---|---|
| Navbar | Home links, mobile menu toggle, scroll state | None |
| Hero search | City and date inputs update local component state | Search button does not submit or call the API |
| How It Works | Static informational content | None required |
| Featured vehicles | Hard-coded sample vehicles; previous/next carousel | No API; favorites are browser state only |
| Popular cities | Static photo cards and vehicle counts | Cards do not navigate or filter |
| Vehicle categories | Static category tiles and counts | Tiles do not navigate or filter |
| Trust and host sections | Static copy and displayed metrics | None |
| Testimonials | Previous/next/dot controls change local slide | No API |
| Footer | Static links and placeholder `#` social links | Most destinations do not have client routes |
| Backend | MongoDB connection attempt and `/api/v1/health` only | No domain models or API routes |

At the audit starting point, the client only registered `/`; the forms and routed pages below have since been added.

## Current UI/API Inventory

| UI element | Current behavior | Backend persistence |
|---|---|---|
| Desktop/mobile navbar links | Home, Browse Vehicles, How It Works, and List Your Vehicle routes; session-aware dashboard/sign-out | Auth session in memory plus refresh cookie |
| Hero city/date fields and Search | Search button carries city and dates into `/vehicles` | Mongo-backed results when MongoDB is available |
| How It Works cards | Informational copy only | None required |
| Featured vehicle carousel/arrows | Loads top-rated listings; keeps sample fallback if API is unavailable | Mongo `vehicles` when available |
| Featured heart | Requires login and toggles saved state | `users.favorites` |
| Featured Book Now/View All | Opens vehicle details or browse results | Vehicle API |
| City photo cards | Navigates to results filtered by city | Mongo `vehicles` |
| Category cards | Navigates to category/fuel-filtered results | Mongo `vehicles` |
| Trust cards and metrics | Static copy and sample metrics | No live metrics endpoint |
| Owner CTA | Listing link opens protected listing form; earnings calculator remains unimplemented | Vehicle API for listing |
| Testimonials arrows/dots | Changes local carousel slide | None; sample testimonials remain static |
| Browse search form | City, category, max price, fuel, dates, query, sort, compare up to two | `GET /api/v1/vehicles` |
| Browse listing card | Details, favorite, compare, and Book/View actions | Vehicle and favorite APIs |
| Compare table | Compares price, mileage, transmission, seats, and fuel for two loaded results | Client-only state |
| Vehicle detail | Photos, specifications, host, reviews, dates, quote, availability, booking | Vehicle/quote/availability/booking APIs |
| Registration/login forms | Validate and submit customer/owner account credentials | Mongo `users`, Argon2id, JWT session |
| Customer/owner dashboard | Bookings, saved vehicles, owner inventory, cancel/sign out | Booking/favorite/vehicle APIs |
| Owner listing form | Vehicle metadata and 3–10 photo upload | Mongo `vehicles`, local photo storage |
| Booking confirmation | Shows saved booking and paise breakdown | Mongo `bookings` |
| Footer links | Static; most destinations are not implemented | None |

## Missing Functionality

- MongoDB is not running in the current environment; search, auth, favorites, listings, and bookings return a clear 503 until it is started.
- Search has no pagination controls, vehicle-type selector in the homepage hero, or location autocomplete/map.
- Registration email verification, password reset, and account/profile editing are not implemented.
- Booking confirmation is immediate; owner approval, payment processing, refunds, and complete booking-state transitions are not implemented.
- Owner listing creation and edit API exist, but no edit form, delete flow, document upload, or approval moderation exists.
- Vehicle comparison is client-only and limited to the currently loaded results.
- Reviews can be displayed from records, but there is no review-submission endpoint or review UI.
- City/category counts, trust metrics, and testimonials are sample/static values.
- Footer routes including About, Careers, Help, Legal, Calculator, and social actions remain placeholders or have no page component.

## Required Collections

| Collection | Purpose |
|---|---|
| `users` | Account identity, role, password hash, contact data, favorite vehicle references, refresh-token hashes |
| `vehicles` | Owner, vehicle specifications, photos, daily price in paise, city/location, blocked dates, reservations, approval/listing state, rating summary |
| `bookings` | Renter, vehicle, date range, integer-paise price breakdown, status, transition history |
| `reviews` | Completed-booking rating and review text, with one review per booking |

Vehicle availability is stored with the vehicle and reservations are atomically claimed there; favorites are references on the user. Comparison is transient client state and does not need a collection.

## Required APIs and Routes

| Method | Route | Purpose / access |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create customer or owner account |
| `POST` | `/api/v1/auth/login` | Authenticate, issue access JWT and refresh cookie |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh session and issue new access JWT |
| `POST` | `/api/v1/auth/logout` | Revoke refresh session and clear cookie |
| `GET` | `/api/v1/auth/me` | Current account/profile |
| `GET` | `/api/v1/vehicles` | Search/filter/paginate listed vehicles |
| `GET` | `/api/v1/vehicles/:id` | Vehicle details, owner summary, availability and reviews |
| `GET` | `/api/v1/vehicles/:id/quote` | Server-calculated integer-paise price and date availability |
| `POST` | `/api/v1/vehicles` | Owner listing with photo upload |
| `GET` | `/api/v1/vehicles/mine` | Owner's listings |
| `PATCH` | `/api/v1/vehicles/:id` | Owner updates allowed listing fields |
| `GET` | `/api/v1/vehicles/:id/availability` | Check date-range availability |
| `GET` | `/api/v1/favorites` | Current user's saved vehicles |
| `PUT` | `/api/v1/favorites/:vehicleId` | Save a favorite |
| `DELETE` | `/api/v1/favorites/:vehicleId` | Remove a favorite |
| `POST` | `/api/v1/bookings` | Price and atomically reserve a vehicle/date range |
| `GET` | `/api/v1/bookings/mine` | Current user's bookings |
| `GET` | `/api/v1/bookings/:id` | Booking details for renter/owner |
| `PATCH` | `/api/v1/bookings/:id/cancel` | Cancel an eligible booking and release dates |

## Implementation Task List

1. [x] Preserve existing navigation/menu, testimonial and vehicle carousels, date controls, and favorite interactions.
2. [x] Implement Mongo-backed search, filters, listing detail, owner summary, availability, and sample seed data.
3. [x] Add register/login/refresh/logout/current-user flows using Argon2id/JWT and HTTP-only refresh cookies.
4. [x] Add customer/owner dashboard, detail, browse, auth, and vehicle-listing screens with existing styles.
5. [x] Add owner vehicle creation and validated photo upload; edit endpoint exists.
6. [x] Add integer-paise quotes, atomic date reservation, booking history, and cancellation.
7. [x] Persist favorites and add client-side vehicle comparison.
8. [x] Add pricing tests and setup/status documentation; remaining integrations are listed above.
9. [ ] Start MongoDB, run `npm run seed`, then exercise register → search → book → cancel and owner listing end to end.