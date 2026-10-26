# Local Development

## Start the application

1. Install workspace dependencies from the repository root with `npm install`.
2. Start MongoDB locally on `127.0.0.1:27017` (or set `MONGODB_URI` in `backend/.env`).
3. Copy `backend/.env.example` to `backend/.env`; set strong, separate `JWT_SECRET` and `JWT_REFRESH_SECRET` values before exposing the API beyond local development.
4. If MongoDB Atlas reports `ECONNREFUSED querySrv`, set `MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8` in `backend/.env`. Do not put JavaScript into `.env` files; they only contain `KEY=value` entries.
5. To enable Google sign-in, create an OAuth 2.0 Web client in Google Cloud Console, add `http://localhost:5173` as an authorized JavaScript origin, and set its client ID as `GOOGLE_CLIENT_ID` in `backend/.env` and `VITE_GOOGLE_CLIENT_ID` in `frontend/.env.local`. Both values must match. Restart the development server after setting them.
6. From the repository root, run `npm run seed` to create the sample owner, customer, and vehicle listings.
7. Run `npm run dev` to start the API and Vite frontend. Vite proxies `/api` to `http://localhost:5000`.

The API health endpoint is `http://localhost:5000/api/v1/health`. Without MongoDB, health checks still work; domain routes return `503 DATABASE_UNAVAILABLE`.

## Seeded demo accounts

- Owner: `owner@rentwheels.test`
- Customer: `customer@rentwheels.test`
- Default password: `RentWheels!Demo2026`

Set `DEMO_PASSWORD` in `backend/.env` before seeding to use a different local-only password. Seeded vehicle images are Unsplash automotive photographs; new owner uploads are validated JPEG, PNG, or WebP images stored under `backend/uploads` in development.

## Implemented flow boundaries

- Search filters by city, dates, category, fuel, maximum price, seats, query, and sort order.
- Registration/login use Argon2id, 15-minute access JWTs, rotating seven-day HTTP-only refresh cookies, and logout revocation.
- Booking calculates integer-paise totals and atomically reserves date ranges. Bookings are marked confirmed immediately; payment processing is not connected.
- Owner listing creation accepts 3–10 validated vehicle photos. Listings are immediately searchable; approval moderation and vehicle-document uploads are not implemented. The edit API exists, but the dashboard has no edit form yet.
- Favorites are account-backed. Vehicle comparison is client-only and compares two loaded results.
- Email/OTP verification for password accounts, password reset, payment/refund webhooks, reviews submission, admin/staff accounts, identity documents, and audit workflows remain unimplemented. Google sign-in verifies the Google ID token and its verified email on the API.