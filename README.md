# Creator Score

A Next.js 15 platform for marketing teams to discover, evaluate, score, and manage creator/influencer collaborations using a standardized, weighted scoring framework instead of raw follower counts.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, hand-rolled shadcn/ui-style components (Radix UI primitives), Framer Motion, React Hook Form, Zod
- **Backend**: Next.js Server Actions, Prisma ORM 7 (with the `@prisma/adapter-pg` driver adapter)
- **Database**: PostgreSQL
- **Auth**: NextAuth.js v5 — Google OAuth + email/password (Credentials provider)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. Copy the env template and fill in values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — a PostgreSQL connection string.
   - `AUTH_SECRET` — generate with `npx auth secret`.
   - `AUTH_TRUST_HOST=true` — required when self-hosting outside Vercel.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, only needed for Google login.

2. Install dependencies and set up the database:

   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Sign in with a seeded demo account:
   - **Admin**: `admin@creatorscore.app` / `password123`
   - **Team Member**: `team@creatorscore.app` / `password123`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:seed` | Seed demo users, creators, scores, and campaigns |
| `npm run db:studio` | Open Prisma Studio |

## What's implemented in this pass

This is the **core foundation** of the PRD: full data model, auth + role-based access, the creator scoring engine and recommendation logic, creator CRUD, the dashboard (stat cards, charts, recent activity), the creator detail page (Overview, Scoring, Campaigns, Communication, and Notes tabs are fully functional), the Score Calculator, campaigns, analytics, CSV export, and admin-only scoring-weight settings.

Deferred for a future pass (present in the schema/UI as stubs or noted below): Cloudinary/file uploads (Files tab, contract/media-kit attachments), a full audit trail (History tab), per-creator analytics, PDF/Excel export, reminder notifications, AI score suggestions, duplicate-creator detection, and CSV bulk import.

### Notable implementation choices

- **Email login** is implemented as email + password (Credentials provider) rather than magic-link email, since magic links require an SMTP/email provider that wasn't specified in the PRD.
- **Prisma 7** requires an explicit driver adapter (`@prisma/adapter-pg`) instead of a `url` in `schema.prisma`; the connection string lives in `prisma.config.ts` (for Migrate/seed) and `src/lib/prisma.ts` (for the runtime client).
- Middleware uses a lightweight, Edge-safe NextAuth instance (`src/lib/auth.config.ts`) so Prisma/bcrypt never get bundled into the Edge runtime; the full instance with the Prisma adapter and providers lives in `src/lib/auth.ts`.
