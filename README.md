# Gold BD

A gold-trading platform for Bangladesh: phone+OTP auth, a wallet with cash and gold balances,
buy/sell against a live rate, KYC, and an admin panel — all backed by a double-entry ledger.

## Architecture

```
Frontend (Next.js App Router, ShadCN UI, React Hook Form + Zod, TanStack Query)
        │
        ▼
API Layer (proxy.ts: auth guard + Redis rate limit → Next.js Route Handlers, REST)
        │
        ▼
Service Layer (auth, otp, kyc, payment, gold, wallet)
        │
        ▼
Ledger Engine (double-entry postings — the only place balances change)
        │
        ▼
Prisma ORM → PostgreSQL (data) + Redis (rate cache, rate limiting)
```

## Folder structure

```
gold.bd/
├── apps/
│   └── web/                    Next.js app
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/         login, register, verify-otp
│       │   │   ├── (dashboard)/    dashboard, buy-gold, sell-gold, wallet, transactions, kyc
│       │   │   ├── admin/          users, rates, transactions
│       │   │   └── api/            auth, gold, wallet, transactions, kyc, admin
│       │   ├── components/ui/      shadcn/ui components
│       │   ├── components/shared/  nav, user menu
│       │   ├── components/forms/   shared trade form
│       │   ├── lib/
│       │   │   ├── prisma/         Prisma client (driver-adapter setup)
│       │   │   ├── ledger/         double-entry ledger engine
│       │   │   ├── services/       auth, otp, kyc, payment, gold, wallet (mocked externals)
│       │   │   ├── auth/           JWT session + route guards
│       │   │   └── validations/    Zod schemas
│       │   ├── hooks/              TanStack Query hooks
│       │   ├── proxy.ts            auth guard + rate limit (Next 16's middleware.ts successor)
│       │   └── generated/prisma/   generated Prisma Client (gitignored)
│       └── prisma/schema.prisma
├── packages/
│   ├── shared-types/            ApiResponse<T>, PublicUser, Wallet/Transaction summaries
│   └── utils/                   BDT/gram formatting, BD phone validation
├── docker/
│   ├── docker-compose.yml       Postgres 16 + Redis 7 for local dev
│   └── Dockerfile               production image for apps/web
└── .env.example
```

## Getting started

```bash
npm install
cp .env.example apps/web/.env      # already present with matching defaults
npm run docker:up                  # starts Postgres + Redis
npm run db:migrate                 # applies the schema
npm run db:seed                    # creates an admin, a demo user, and a gold rate
npm run dev                        # http://localhost:3000
```

**Seeded accounts** (`npm run db:seed`):
- Admin — `01700000000` / `Admin@1234`
- Demo user (৳50,000 seeded cash) — `01800000000` / `Demo@1234`

OTP codes aren't sent to a real phone in dev — check the terminal running `next dev` for
`[sms-mock] -> ...` log lines.

## Mocked integrations

SMS, payment gateway, and KYC are stubbed so every flow works end-to-end without vendor
credentials. Each is a small interface with one concrete implementation, so wiring in a real
vendor later is a one-file change:

- `src/lib/services/sms-provider.ts` — `SmsProvider` (currently logs to console)
- `src/lib/services/payment.service.ts` — `PaymentProvider` (currently auto-approves deposits)
- `src/lib/services/kyc.service.ts` — submissions land as `PENDING`; an admin approves/rejects
  from `/admin/users`

## The ledger

`src/lib/ledger/ledger-engine.ts` is the only code path allowed to change a wallet's balance.
Every buy, sell, deposit, and withdrawal is expressed as one or more `LedgerEntry` postings
(CASH/GOLD × DEBIT/CREDIT) written atomically with the wallet update inside a Prisma
transaction — so the `LedgerEntry` table is always a complete, replayable audit trail.

## Notes on the toolchain

This scaffold was built against **Next.js 16**, **Prisma 7**, and a pre-release **shadcn/ui**
CLI — all newer than most published guides. A few things that differ from older Next/Prisma
projects, in case you extend this:

- `middleware.ts` is renamed to `proxy.ts` (`src/proxy.ts`).
- Prisma Client is generated to `src/generated/prisma` (not `node_modules/@prisma/client`) and
  requires an explicit driver adapter (`@prisma/adapter-pg`) — see `src/lib/prisma/client.ts`.
- Prisma CLI config (schema path, migrations, seed command, datasource URL) lives in
  `apps/web/prisma.config.ts`, not `package.json`.
# Gold.BD
