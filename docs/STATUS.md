# RentWheels — Feature Status

> Updated after every phase. All features tracked honestly.

| Feature | Status | Notes |
|---------|--------|-------|
| Project Setup & Monorepo | Implemented | Monorepo structure with client, server, shared |
| MongoDB Connection | Implemented | Local default URI; health check and clear 503 when unavailable |
| Design System | Implemented | Light slate surfaces, blue accents, Inter font |
| Homepage (all sections) | Implemented | All 9 sections per spec section 3 |
| Navigation & Footer | Implemented | Responsive header with glassmorphism + complete footer |
| User Registration | Implemented | Customer and owner, validated profile/password, Argon2id |
| User Login (JWT + Refresh) | Implemented | 15-minute access JWT; rotating HTTP-only refresh cookie |
| Email Verification | Not started | No email provider configured |
| Password Reset | Not started | |
| RBAC (4 roles) | Partial | Customer/owner routes; admin/staff not provisioned |
| Route Guards (frontend) | Implemented | Session-aware protected routes |
| Route Protection (backend) | Partial | Authenticated customer and owner route guards |
| Owner Onboarding | Partial | Owner signup; no identity/document verification |
| Vehicle CRUD | Partial | Owner create form, edit API, and own-list view; no edit form/delete/moderation |
| Vehicle Document Upload | Not started | Only vehicle photos supported |
| Listing Status Machine | Partial | New listings publish as listed; approval states not operational |
| Admin Vehicle Approval | Not started | |
| Eligibility Policies | Not started | |
| Licence Upload | Not started | |
| Verification Staff Queue | Not started | |
| Licence Verification Flow | Not started | MANUAL provider; labelled SIMULATED if no real API |
| Secure Document Storage | Not started | Local dev adapter; S3 adapter stubbed |
| Document Access Logging | Not started | |
| Data Encryption at Rest | Not started | AES-256-GCM for licence numbers |
| Vehicle Search & Filters | Implemented | Mongo-backed city, dates, type, fuel, price, seats, query, sort |
| Availability Checking | Implemented | Reservation/block-date overlap checks |
| Booking Request Flow | Partial | Confirmed booking saved immediately; no owner approval/payment |
| Pricing Engine | Partial | Integer-paise total, weekly/monthly discount, platform fee and GST |
| Booking State Machine | Partial | Confirmed and cancellation states only |
| Overlap Prevention | Implemented | Atomic vehicle reservation update |
| Payment (Razorpay Test Mode) | Not started | Needs Razorpay test credentials |
| Payment (SIMULATED) | Not started | Labelled SIMULATED in UI and code |
| Webhook Verification | Not started | |
| Refund Calculations | Not started | |
| Owner Earnings & Payouts | Not started | |
| Leaflet Map Integration | Not started | OpenStreetMap tiles |
| Approximate vs Exact Location | Not started | |
| Pickup/Return Handover | Not started | |
| Inspection Photos | Not started | |
| Live Location Sharing | Not started | Browser geolocation only; labelled accordingly |
| Manual Location Fallback | Not started | |
| Customer Dashboard | Partial | Booking history and saved vehicles |
| Owner Dashboard | Partial | Own listings and bookings |
| Admin Dashboard | Not started | |
| Audit Log Viewer | Not started | |
| Financial Reports | Not started | |
| Reviews & Ratings | Partial | Detail display model exists; no review submission flow |
| Email Notifications | Not started | Console/log transport in dev; labelled SIMULATED |
| Security Middleware | Partial | Helmet, CORS, JSON size limit, role guards, refresh cookies; rate limiting and sanitization remain |
| Seed Script | Implemented | 6 vehicles, 5 cities, owner and customer demo accounts |
| Test Suite | Partial | Pricing/date arithmetic tests; API integration and concurrency tests remain |
| README & Deployment Guide | Not started | |
