# Gold BD

A gold-trading platform for Bangladesh — frontend only. UI for phone+OTP auth, a wallet with
cash and gold balances, buy/sell against a live rate, KYC, and an admin panel.

## Folder structure

```
gold.bd/
├── client/                      Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         login, register, verify-otp
│   │   │   ├── (dashboard)/    dashboard, buy-gold, sell-gold, wallet, transactions, kyc
│   │   │   └── admin/          users, rates, transactions
│   │   ├── components/ui/      shadcn/ui components
│   │   ├── components/shared/  nav, user menu
│   │   ├── components/forms/   shared trade form
│   │   ├── lib/                api client, i18n, validations, misc utils
│   │   ├── store/               Redux store
│   │   └── hooks/              TanStack Query hooks
│   └── public/
└── packages/
    ├── shared-types/            ApiResponse<T>, PublicUser, Wallet/Transaction summaries
    └── utils/                   BDT/gram formatting, BD phone validation
```

There is no backend in this repo — no API routes, database, auth, or ledger. The pages and
hooks that call `/api/*` endpoints expect a backend to be wired up separately.

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000
```
