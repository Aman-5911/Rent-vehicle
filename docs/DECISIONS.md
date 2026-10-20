# RentWheels — Architecture & Design Decisions

> This document records design decisions made during implementation.  
> If the spec is ambiguous, the safest reasonable default is chosen and recorded here.

## Decision Log

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| D1 | Use Tailwind CSS v3 as specified in architecture decisions (React + Vite + Tailwind) | Prompt explicitly locks Tailwind as the CSS framework despite general guidelines preferring vanilla CSS. Prompt architecture decisions override general guidelines. | 2026-10-20 |
| D2 | MongoDB replica set via `run-rs` npm package for development transactions | Overlap prevention requires transactions; `run-rs` is the simplest way to get a local replica set without manual MongoDB configuration. | 2026-10-20 |
| D3 | Argon2id for password hashing (over bcrypt) | Argon2id is the recommended modern choice — memory-hard, resistant to GPU attacks, and endorsed by OWASP. | 2026-10-20 |
| D4 | Access token stored in JS memory (closure/context), refresh token in httpOnly secure cookie | Prevents XSS from stealing tokens. Refresh rotation prevents replay. | 2026-10-20 |
| D5 | All file uploads processed via `multer` with magic-byte validation (`file-type` library) | Validates actual file content, not just extension or MIME header. | 2026-10-20 |
| D6 | Paise-based integer arithmetic using native JS BigInt-safe integers (no external library needed since amounts stay within Number.MAX_SAFE_INTEGER) | Simplicity; rental amounts won't exceed 2^53 paise (~₹90 trillion). | 2026-10-20 |
| D7 | Vitest for server-side tests, Vitest + React Testing Library for client | Consistent test runner across the monorepo, fast, Vite-native. | 2026-10-20 |
| D8 | `zod` schemas shared between route validation and frontend form validation via a shared `/shared` package | Prevents schema drift between client and server. | 2026-10-20 |
| D9 | Booking overlap prevention uses MongoDB `findOneAndUpdate` with date-range filter as an atomic operation; concurrency test fires 10 simultaneous requests | Transactions require replica set; atomic findOneAndUpdate is the primary guard with transaction as defense-in-depth when replica set is available. | 2026-10-20 |
| D10 | Security deposit is tracked as a separate payment intent, not part of the booking payment | Allows independent refund of deposit vs. booking amount. | 2026-10-20 |
| D11 | Coordinates coarsened by adding random offset within ~500m radius using a seeded hash of the vehicle ID | Deterministic per vehicle (same approximate location each time) but hides exact location. | 2026-10-20 |
| D12 | Audit log stored in MongoDB (not a file) for queryability | Admin needs searchable, filterable audit log viewer in dashboard. | 2026-10-20 |
| D13 | Email verification uses 6-digit OTP (not magic link) for simplicity in dev mode | Console transport just logs the OTP; no need for clickable links in dev. | 2026-10-20 |
| D14 | Vehicle search uses MongoDB text indexes + query filters (not Elasticsearch) | Keeps the stack simple; sufficient for the scale described. | 2026-10-20 |
| D15 | Lucide React for all icons as specified in architecture decisions | Consistent, tree-shakeable icon library. | 2026-10-20 |
