# RentWheels — Product Specification

> **Version**: 1.0  
> **Last updated**: 2026-10-20  
> **Status**: Draft

---

## 1. Product Overview

RentWheels is a two-sided marketplace that connects vehicle owners who want to earn from their idle vehicles with customers who need short-term self-drive rentals. The platform handles discovery, booking, payments, document verification, handover logistics, and dispute resolution.

### 1.1 Key Stakeholders
| Role | Description |
|------|-------------|
| **Customer (Renter)** | Searches, books, and drives vehicles |
| **Owner (Host)** | Lists vehicles, sets pricing, manages availability |
| **Admin** | Manages platform, approves vehicles, resolves disputes |
| **Verification Staff** | Reviews identity documents and driving licences |

### 1.2 Core Value Propositions
- **For Customers**: Access to a wide range of vehicles at competitive prices, transparent pricing, verified vehicles, and secure booking.
- **For Owners**: Passive income from idle vehicles, insurance facilitation, easy listing management, and payment assurance.
- **For the Platform**: Commission on each booking, premium listing fees, and data-driven insights.

---

## 2. User Roles & Permissions

### 2.1 Role Definitions

#### Customer
- Register/login, manage profile
- Search and filter vehicles
- Create/cancel bookings
- Upload driving licence for verification
- Make payments
- View own bookings, trips, and payment history
- Rate and review completed trips
- Access pickup/return location (after booking confirmation)
- Share live location during trip (consent-based)

#### Owner
- Register/login, manage profile
- List/edit/remove vehicles
- Upload vehicle documents (RC, insurance, photos)
- Set pricing, availability calendar
- Accept/reject booking requests
- View own vehicles, bookings, and earnings
- Initiate pickup/return handover
- View renter's verified licence (after booking confirmation)
- Request payouts

#### Admin
- All owner and customer capabilities
- Approve/reject vehicle listings
- Manage verification staff accounts
- View and manage all bookings
- Access audit logs
- Generate reports
- Configure platform settings (commission rates, eligibility rules, pricing rules)
- Handle disputes and issue refunds
- Manage user accounts (suspend, unsuspend)

#### Verification Staff
- View document review queue
- Approve/reject/request-resubmission of driving licences
- Add verification notes
- Cannot access other platform features

### 2.2 Permission Matrix

| Action | Customer | Owner | Admin | Verification Staff |
|--------|----------|-------|-------|-------------------|
| Register/Login | ✓ | ✓ | ✓ | ✓ |
| Search vehicles | ✓ | ✓ | ✓ | ✗ |
| Book vehicle | ✓ | ✗ | ✗ | ✗ |
| List vehicle | ✗ | ✓ | ✓ | ✗ |
| Approve vehicle | ✗ | ✗ | ✓ | ✗ |
| Review documents | ✗ | ✗ | ✓ | ✓ |
| View all bookings | ✗ | ✗ | ✓ | ✗ |
| Manage users | ✗ | ✗ | ✓ | ✗ |
| View audit logs | ✗ | ✗ | ✓ | ✗ |
| Generate reports | ✗ | ✗ | ✓ | ✗ |
| View own bookings | ✓ | ✓ | ✓ | ✗ |
| Make payments | ✓ | ✗ | ✗ | ✗ |
| Request payouts | ✗ | ✓ | ✗ | ✗ |

---

## 3. Homepage & Landing Page

### 3.1 Sections (in order)
1. **Hero Section**: Full-width hero with tagline "Find Your Perfect Ride", search bar (city, dates, vehicle type), CTA button.
2. **How It Works**: 3-step illustration — Search → Book → Drive.
3. **Featured Vehicles**: Carousel of top-rated or promoted vehicles with image, name, type, price/day, rating, city.
4. **Popular Cities**: Grid of supported cities (Delhi, Mumbai, Bengaluru, Jaipur, Pune) with vehicle count badges.
5. **Vehicle Categories**: Cards for Hatchback, Sedan, SUV, Luxury, Bike/Scooter with icon and count.
6. **Why Choose RentWheels**: Trust badges — Verified Vehicles, Secure Payments, 24/7 Support, Best Prices.
7. **Owner CTA**: "List Your Vehicle & Earn" section targeting potential owners.
8. **Testimonials**: Rotating customer and owner testimonials.
9. **Footer**: Links (About, Contact, Terms, Privacy, FAQ), social icons, copyright.

### 3.2 Navigation Bar
- Logo (left)
- Links: Home, Browse Vehicles, How It Works, List Your Vehicle
- Auth buttons: Login / Register (right)
- When logged in: avatar dropdown with dashboard link, profile, logout
- Mobile: hamburger menu

### 3.3 Design System
- **Primary**: Navy (#1a1a2e)
- **Secondary**: Electric Blue (#0ea5e9)
- **Accent**: White (#ffffff)
- **Background**: Light gray (#f8fafc) / Dark navy (#0f0f23)
- **Success**: #22c55e
- **Warning**: #f59e0b
- **Error**: #ef4444
- **Typography**: Inter (headings), system sans-serif (body)
- **Border Radius**: 8px (cards), 12px (buttons), 50% (avatars)
- **Shadows**: Subtle elevation system (sm, md, lg, xl)
- **Responsive Breakpoints**: Mobile (< 640px), Tablet (640–1024px), Desktop (> 1024px)

---

## 4. Authentication & Authorization

### 4.1 Registration
- Fields: Full name, email, phone number, password, role selection (Customer or Owner)
- Email verification via OTP or magic link
- Password requirements: minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
- Phone number format validation (Indian +91)

### 4.2 Login
- Email + password
- JWT access token (short-lived, 15 minutes)
- Refresh token in httpOnly secure cookie (7 days, rotating)
- Logout invalidates refresh token server-side

### 4.3 Password Reset
- Email-based flow: request → receive link → set new password
- Token expires in 1 hour
- Rate-limited: 3 requests per hour per email

### 4.4 Session Management
- Access token in memory (not localStorage)
- Silent refresh on token expiry
- Concurrent session limit: configurable (default 5)

---

## 5. Vehicle Listing & Management

### 5.1 Vehicle Model Fields
- Owner reference
- Brand, model, year, variant
- Vehicle type/category (Hatchback, Sedan, SUV, MUV, Luxury, Bike, Scooter)
- Fuel type (Petrol, Diesel, Electric, CNG, Hybrid)
- Transmission (Manual, Automatic)
- Seating capacity
- Registration number (encrypted at rest)
- Registration city
- Color
- Mileage (km/l or km/kWh)
- Features list (AC, GPS, Bluetooth, Sunroof, etc.)
- Photos (up to 10, at least 3 required)
- Documents: Registration Certificate (RC), Insurance, PUC, Fitness Certificate
- Pricing: base rate per day (in paise), weekly discount %, monthly discount %
- Pickup location (coordinates + address, coarsened for public display)
- Availability calendar (blocked dates)
- Listing status (see 5.2)
- Created/updated timestamps
- Average rating, total trips

### 5.2 Listing Status Flow
```
DRAFT → PENDING_APPROVAL → APPROVED → LISTED
                         → REJECTED (with reason)
LISTED → UNLISTED (by owner)
UNLISTED → LISTED (if still approved)
LISTED → SUSPENDED (by admin, with reason)
SUSPENDED → LISTED (by admin, after resolution)
Any → DELETED (soft delete)
```

### 5.3 Admin Approval
- Admin reviews vehicle details, photos, and documents
- Can approve, reject (with reason), or request additional documents
- Vehicle cannot become LISTED without APPROVED status
- Document expiry tracking with notifications

### 5.4 Eligibility Policies (Configurable)
- Minimum photos count
- Required documents list
- Maximum vehicle age
- Insurance validity requirement
- PUC validity requirement

---

## 6. Renter Verification

### 6.1 Driving Licence Verification Flow
```
NOT_SUBMITTED → SUBMITTED → UNDER_REVIEW → VERIFIED
                                          → REJECTED (with reason)
REJECTED → RESUBMITTED → UNDER_REVIEW → VERIFIED
                                       → REJECTED
VERIFIED → EXPIRED (automated check)
```

### 6.2 Document Requirements
- Driving licence front and back photos
- Valid licence number
- Licence expiry date must be after booking end date
- Licence class must match booked vehicle type (configurable mapping)
- Age requirement: minimum 18 (configurable per jurisdiction)

### 6.3 Verification Staff Queue
- Queue sorted by submission date
- Staff can: view document images (watermarked in UI), approve, reject with reason, request re-upload
- All actions logged to audit trail
- Staff cannot download or print documents

### 6.4 Secure Document Storage
- Files stored via storage adapter (local dev, S3-compatible production)
- Files never served statically
- Access only through authorized endpoint
- Access checks: role + ownership/assignment
- Every access logged (who, when, what, IP)
- Filenames randomized on storage
- Upload validation: magic bytes, file size limits (5MB), allowed MIME types (image/jpeg, image/png, application/pdf)
- Licence numbers encrypted at rest (AES-256-GCM)
- Display: masked in UI (show only last 4 characters)
- Retention policy: configurable, deletion job/script

### 6.5 Provider Interface
- Default: MANUAL review provider (verification staff reviews)
- Interface defined for future automated API integration
- Never display "verified against official database" unless an automated provider returned that result
- Verification result source stored with the verification record

---

## 7. Booking State Machine

### 7.1 States
| State | Description |
|-------|-------------|
| REQUESTED | Customer has requested a booking |
| APPROVED | Owner has approved the request |
| REJECTED | Owner has rejected the request |
| PAYMENT_PENDING | Awaiting payment from customer |
| CONFIRMED | Payment received, booking confirmed |
| HANDOVER_PENDING | Awaiting vehicle pickup handover |
| ACTIVE | Vehicle handed over, trip in progress |
| RETURN_PENDING | Awaiting vehicle return |
| COMPLETED | Vehicle returned, trip ended |
| CANCELLED_BY_CUSTOMER | Customer cancelled |
| CANCELLED_BY_OWNER | Owner cancelled |
| CANCELLED_BY_ADMIN | Admin cancelled |
| DISPUTED | Dispute raised |
| REFUND_PENDING | Refund being processed |
| REFUND_COMPLETED | Refund issued |

### 7.2 Allowed Transitions
```
REQUESTED → APPROVED (by owner)
REQUESTED → REJECTED (by owner)
REQUESTED → CANCELLED_BY_CUSTOMER (by customer)
REQUESTED → CANCELLED_BY_ADMIN (by admin)

APPROVED → PAYMENT_PENDING (system, auto)
APPROVED → CANCELLED_BY_CUSTOMER (by customer)
APPROVED → CANCELLED_BY_OWNER (by owner)
APPROVED → CANCELLED_BY_ADMIN (by admin)

PAYMENT_PENDING → CONFIRMED (system, on payment success)
PAYMENT_PENDING → CANCELLED_BY_CUSTOMER (by customer)
PAYMENT_PENDING → CANCELLED_BY_ADMIN (by admin)

CONFIRMED → HANDOVER_PENDING (system, when pickup time approaches)
CONFIRMED → CANCELLED_BY_CUSTOMER (by customer, refund policy applies)
CONFIRMED → CANCELLED_BY_OWNER (by owner, penalty applies)
CONFIRMED → CANCELLED_BY_ADMIN (by admin)

HANDOVER_PENDING → ACTIVE (by owner, after handover inspection)
HANDOVER_PENDING → CANCELLED_BY_CUSTOMER (by customer)
HANDOVER_PENDING → CANCELLED_BY_OWNER (by owner)
HANDOVER_PENDING → CANCELLED_BY_ADMIN (by admin)

ACTIVE → RETURN_PENDING (system, when return time approaches)
ACTIVE → DISPUTED (by customer or owner)

RETURN_PENDING → COMPLETED (by owner, after return inspection)
RETURN_PENDING → DISPUTED (by customer or owner)

COMPLETED → DISPUTED (by customer or owner, within dispute window)

CANCELLED_BY_CUSTOMER → REFUND_PENDING (system, if refund applicable)
CANCELLED_BY_OWNER → REFUND_PENDING (system, auto)
CANCELLED_BY_ADMIN → REFUND_PENDING (system, if payment was made)

DISPUTED → REFUND_PENDING (by admin, after resolution)
DISPUTED → COMPLETED (by admin, dispute resolved no refund)

REFUND_PENDING → REFUND_COMPLETED (system, on refund processed)
```

### 7.3 Transition Rules
- Every transition is validated against the allowed transitions map
- Every transition records: previous state, new state, triggered by (user ID + role), timestamp, reason/notes
- Side effects are defined per transition (notifications, payment triggers, etc.)
- Illegal transitions return 400 with a clear error message
- Concurrency: use optimistic locking (version field) or transactions

### 7.4 Overlap Prevention
- A vehicle cannot have two confirmed/active bookings with overlapping dates
- Enforced at the database level (atomic check-and-write or transaction)
- Must handle race conditions (concurrent booking attempts)
- Concurrency test required: fire 10 simultaneous booking requests for the same vehicle and date range; exactly one should succeed

---

## 8. Pricing Engine

### 8.1 Pricing Components
| Component | Description |
|-----------|-------------|
| Base rate | Owner-set daily rate in paise (INR) |
| Duration discount | Weekly (7+ days) and monthly (30+ days) discount % |
| Platform fee | Configurable % of base amount |
| GST | Configurable % (default 18%) |
| Security deposit | Configurable per vehicle type |
| Late return fee | Per-hour charge after scheduled return |
| Damage/cleaning fee | Ad-hoc charges added by owner/admin |

### 8.2 Calculation Rules
- All money stored and calculated in integer paise (1 INR = 100 paise)
- No floating-point arithmetic for money
- Pricing rules stored in database, not hardcoded
- Pure functions for calculation (no side effects)
- Full unit test coverage for all pricing scenarios

### 8.3 Price Breakdown (shown to customer)
```
Base rate: ₹X × N days = ₹Y
Duration discount (W%): -₹Z
Subtotal: ₹A
Platform fee (P%): +₹B
GST (G%): +₹C
─────────────────────────
Total: ₹D
Security deposit (refundable): ₹E
─────────────────────────
Amount to pay: ₹F
```

### 8.4 Owner Earnings
```
Booking amount (after discount): ₹A
Platform commission (C%): -₹B
TDS (if applicable): -₹C (SIMULATED)
─────────────────────────
Owner earnings: ₹D
```

---

## 9. Payments

### 9.1 Payment Flow
1. Customer initiates payment after booking is APPROVED
2. Server creates a payment order (Razorpay order or simulated)
3. Customer completes payment on frontend
4. Server verifies payment via webhook (not frontend callback)
5. On verification success: booking transitions to CONFIRMED
6. On failure: booking remains in PAYMENT_PENDING

### 9.2 Provider Interface
- **Razorpay Test Mode**: Real Razorpay SDK in test mode with test API keys
- **SIMULATED Provider**: Fake payment flow for development without Razorpay credentials. Clearly labelled SIMULATED in UI.
- Provider selected via environment variable

### 9.3 Webhook Security
- Razorpay: verify signature using webhook secret (HMAC SHA256)
- Reject tampered signatures with 400 and log the attempt
- Idempotency: process each payment event only once (store processed event IDs)

### 9.4 Refunds
- Full refund: cancellation by owner or admin
- Partial refund: customer cancellation per cancellation policy
  - > 48h before pickup: 90% refund
  - 24–48h before pickup: 75% refund
  - 12–24h before pickup: 50% refund
  - < 12h before pickup: no refund
- Refund amount calculated in paise, never floating-point
- Refund processed through payment provider

### 9.5 Owner Payouts
- Tracked per booking
- Payout eligibility: trip completed + no active disputes + payout cooldown period
- Manual payout trigger by admin or scheduled batch
- Payout status: PENDING → PROCESSING → COMPLETED / FAILED

### 9.6 Security
- No raw card data touches the server
- PCI compliance is the payment provider's responsibility
- All payment events in audit log
- Duplicate payment prevention via idempotency keys

---

## 10. Customer Dashboard

### 10.1 Sections
- **My Bookings**: List with filters (status, date range), booking cards showing vehicle, dates, status, amount
- **Active Trip**: Current trip details, map showing vehicle location (if live sharing enabled), pickup/return info
- **Payment History**: All transactions with status, amounts, dates
- **My Documents**: Licence verification status, uploaded documents
- **Profile**: Edit name, phone, avatar
- **Saved Vehicles**: Wishlist/favorites

### 10.2 Booking Card
- Vehicle image, name, type
- Dates (pickup → return)
- Status badge (color-coded)
- Price paid
- Actions: Cancel, View Details, Rate (if completed), Raise Dispute

---

## 11. Owner Dashboard

### 11.1 Sections
- **My Vehicles**: List with status badges, quick actions (edit, unlist, view bookings)
- **Booking Requests**: Pending requests with accept/reject actions
- **Active Rentals**: Current trips with renter info (masked licence), return schedule
- **Earnings**: Total earnings, pending payouts, completed payouts, earnings chart
- **Payout Requests**: Request payout, payout history
- **Calendar**: Availability calendar per vehicle with booked dates highlighted

### 11.2 Earnings Summary
- Total revenue
- Platform commission deducted
- Net earnings
- Pending payouts
- Completed payouts
- Per-vehicle breakdown

---

## 12. Admin Dashboard

### 12.1 Sections
- **Overview**: KPI cards (total users, active listings, bookings today, revenue this month)
- **User Management**: User list, search, filter by role, suspend/unsuspend, view details
- **Vehicle Approvals**: Pending approvals queue, approve/reject with notes
- **Booking Management**: All bookings with filters, status transitions, dispute resolution
- **Verification Queue**: Pending document reviews (delegated to verification staff)
- **Financial Reports**: Revenue, commissions, refunds, payouts — with date range filters
- **Audit Logs**: Searchable log viewer (action, actor, target, timestamp, IP)
- **Platform Settings**: Commission rates, eligibility policies, cancellation policies
- **Reports**: Exportable CSV/JSON for bookings, revenue, users

### 12.2 Audit Log Entry
```json
{
  "action": "BOOKING_STATUS_CHANGE",
  "actor": { "userId": "...", "role": "owner" },
  "target": { "type": "booking", "id": "..." },
  "details": { "from": "REQUESTED", "to": "APPROVED" },
  "ip": "...",
  "userAgent": "...",
  "timestamp": "..."
}
```

---

## 13. Maps & Location

### 13.1 Technology
- Leaflet.js with OpenStreetMap tiles
- Tile URL configurable via environment variable

### 13.2 Location Privacy
- **Public listings**: Show approximate pickup area only (coordinates coarsened to ~500m radius)
- **After booking confirmation**: Exact pickup location revealed to confirmed renter only
- **Owner**: Always sees exact location of own vehicles

### 13.3 Live Location Sharing
- Uses browser Geolocation API
- **Explicit consent required** before activation (opt-in per trip)
- Customer can stop sharing at any time
- Auto-expires at rental end time
- If geolocation unavailable: fall back to manual location updates
- Never claim "live GPS tracking" beyond browser geolocation capability

### 13.4 Handover Location
- Pickup and return coordinates stored per booking
- Distance-based confirmation: both parties must be within configurable radius
- Manual override available if geolocation fails

---

## 14. Handover & Inspection

### 14.1 Pickup Handover
1. Owner marks vehicle as ready
2. Customer arrives, both parties confirm location proximity
3. Owner conducts inspection: checklist (fuel level, odometer, damage) + photos
4. Both parties digitally acknowledge handover
5. Booking status → ACTIVE

### 14.2 Return Handover
1. Customer initiates return
2. Owner inspects: checklist + photos
3. Compare pre/post inspection (fuel, odometer, damage)
4. Both parties acknowledge return
5. If discrepancies: flag for dispute or additional charges
6. Booking status → COMPLETED

### 14.3 Inspection Record
- Fuel level (percentage or quarters)
- Odometer reading
- Exterior photos (minimum 4 angles)
- Interior photos (minimum 2)
- Damage notes (free text)
- Checklist: tire condition, lights, wipers, AC, documents in vehicle

---

## 15. Notifications (Email)

### 15.1 Email Events
| Event | Recipients |
|-------|-----------|
| Registration | User |
| Email verification | User |
| Password reset | User |
| Booking requested | Owner |
| Booking approved/rejected | Customer |
| Payment confirmed | Customer, Owner |
| Pickup reminder (24h before) | Customer, Owner |
| Return reminder (24h before) | Customer, Owner |
| Booking cancelled | Both parties |
| Licence verification result | Customer |
| Vehicle approval result | Owner |
| Dispute raised | Both parties, Admin |
| Payout processed | Owner |

### 15.2 Email Provider
- Pluggable transport interface
- Development: console/log transport (prints to server logs)
- Production: SMTP or transactional email service (e.g., SendGrid, Mailgun)
- Selected via environment variable

---

## 16. Reviews & Ratings

### 16.1 Rules
- Only customers who completed a trip can review
- One review per booking
- Rating: 1–5 stars
- Text review: optional, max 500 characters
- Owner can respond to reviews (one response per review)
- Admin can hide/remove inappropriate reviews

### 16.2 Display
- Vehicle listing shows average rating and review count
- Individual reviews visible on vehicle detail page
- Reviewer shown by first name only

---

## 17. Security & Privacy

### 17.1 Middleware Stack
- Helmet.js for HTTP security headers
- CORS with allowlist (configurable origins)
- Rate limiting: auth endpoints (5 req/min), verification endpoints (10 req/min), general API (100 req/min)
- NoSQL injection sanitization (mongo-sanitize or equivalent)
- Request body size limits (JSON: 1MB, file uploads: 5MB per file, 50MB total per request)
- Centralized error handler: no stack traces to clients, structured error responses

### 17.2 Data Protection
- Passwords: bcrypt or argon2 hashing
- Licence numbers: AES-256-GCM encryption at rest, key from environment variable
- PII fields: masked in logs (email: j***@example.com, phone: ****1234)
- Upload filenames: randomized UUIDs
- File access: logged (who, when, what, IP address)

### 17.3 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  }
}
```

### 17.4 Success Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

---

## 18. Testing Strategy

### 18.1 Unit Tests
- All pricing engine functions
- Booking state machine transitions (valid + invalid)
- Validation schemas
- Encryption/decryption utilities
- Date/time utilities

### 18.2 Integration Tests
- Auth flows (register, login, refresh, logout, password reset)
- RBAC enforcement (each role blocked from others' endpoints)
- Vehicle CRUD with authorization
- Booking lifecycle (full happy path)
- Payment webhook processing
- Document upload and access control
- Overlap prevention (concurrency test)

### 18.3 API Tests
- Every endpoint: at least one happy-path test
- Every protected endpoint: authorization failure test
- Validation error responses
- Pagination and filtering

### 18.4 Frontend Tests
- Component rendering tests
- Form validation
- Route guard behavior

### 18.5 Test Data
- Seed script with clearly labelled TEST DATA
- Demo accounts for all four roles
- Minimum 15 vehicles across 5 cities
- Bookings in varied statuses
- Test payment records

---

## 19. Implementation Phases

### Phase 1: Foundation
- Project setup (monorepo, tooling, linting)
- MongoDB connection with health check
- Design system implementation
- Responsive homepage with all sections from §3
- Navigation bar and footer
- **Gate**: Homepage renders correctly at mobile and desktop widths

### Phase 2: Authentication & Authorization
- User registration and login
- JWT access + refresh token system
- Email verification flow
- Password reset flow
- RBAC middleware (4 roles)
- Frontend route guards
- Backend route protection
- **Gate**: Tests prove each role is blocked from others' endpoints

### Phase 3: Vehicle Management
- Owner onboarding flow
- Vehicle CRUD API and UI
- Document upload (RC, insurance, photos)
- Listing status state machine
- Admin approval workflow
- Configurable eligibility policies
- **Gate**: Vehicle cannot become bookable without required documents and admin approval

### Phase 4: Renter Verification
- Licence upload and verification request
- Verification staff review queue
- Status transitions (submitted → under review → verified/rejected)
- Secure document storage with access control
- Masked display of sensitive data
- Access logging
- **Gate**: Unauthorized document access is rejected and logged; booking cannot reach handover without Verified licence status

### Phase 5: Search, Booking & Pricing
- Vehicle search with filters (city, dates, type, price, transmission, fuel)
- Availability checking
- Booking request flow
- Pricing engine with all components
- Booking state machine implementation
- Overlap prevention with concurrency test
- **Gate**: Overlap prevention passes; pricing calculation tests pass

### Phase 6: Payments
- Payment provider interface
- Razorpay test mode integration
- SIMULATED payment provider
- Webhook verification
- Idempotency/duplicate prevention
- Cancellation and refund flows
- Owner earnings calculation
- Payout tracking (gated on eligibility)
- **Gate**: Tampered webhook signatures rejected; refund math tests pass

### Phase 7: Maps & Handover
- Leaflet map integration
- Approximate vs exact location display
- Pickup/return handover flow with inspections
- Photo capture for inspections
- Consent-based location sharing
- Stop control and auto-expiry
- Manual fallback for location
- **Gate**: Location access tests pass for every role

### Phase 8: Dashboards
- Customer dashboard (§10)
- Owner dashboard (§11)
- Admin dashboard (§12)
- Audit log viewer
- Financial reports
- Verification queue (admin view)
- **Gate**: Each dashboard works end-to-end against real API data

### Phase 9: Polish & Deployment
- Complete test suite per §18
- Seed script (15+ vehicles, 5 cities, all roles)
- README with setup instructions
- Deployment guide
- STATUS.md finalized
- Performance review
- Accessibility audit
- **Gate**: Fresh clone to running app in under 10 documented steps

---

## 20. Glossary

| Term | Definition |
|------|-----------|
| Paise | Smallest unit of INR (1 INR = 100 paise). All monetary values stored as integers in paise. |
| RC | Registration Certificate — proof of vehicle registration |
| PUC | Pollution Under Control certificate |
| Handover | The process of transferring the vehicle between owner and renter |
| Coarsened coordinates | GPS coordinates rounded/offset to hide exact location (~500m radius) |
| SIMULATED | A feature that mimics real behavior for development/demo but does not connect to a real service |
