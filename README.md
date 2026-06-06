# Tender Portal Dashboard

Frontend web application for a B2B tender/procurement system.

## Tech Stack

- React 19 + TypeScript
- Vite
- TanStack Router (file-based routing)
- TanStack Query
- Tailwind CSS
- Zod (validation)
- Lucide React (icons)
- date-fns

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app runs at `http://localhost:5173`. Backend must run at `http://localhost:3000` (or set `VITE_API_BASE_URL` in `.env`).

## Routes

| Path | Role | Description |
|------|------|-------------|
| `/login` | Public | Login |
| `/register/buyer` | Public | Register as buyer |
| `/register/supplier` | Public | Register as supplier |
| `/buyer/dashboard` | Buyer | Dashboard |
| `/buyer/tenders` | Buyer | List tenders |
| `/buyer/tenders/create` | Buyer | Create tender |
| `/buyer/tenders/:id` | Buyer | Tender detail |
| `/buyer/tenders/:id/edit` | Buyer | Edit tender |
| `/buyer/tenders/:id/proposals` | Buyer | View proposals |
| `/buyer/proposals/:id` | Buyer | Proposal detail |
| `/buyer/proposals/:id/negotiations` | Buyer | Negotiation chat |
| `/supplier/dashboard` | Supplier | Dashboard |
| `/supplier/tenders` | Supplier | Browse tenders |
| `/supplier/tenders/:id` | Supplier | Tender detail |
| `/supplier/tenders/:id/proposals/create` | Supplier | Create proposal |
| `/supplier/proposals` | Supplier | My proposals |
| `/supplier/proposals/:id` | Supplier | Proposal detail |
| `/supplier/proposals/:id/edit` | Supplier | Edit proposal |
| `/supplier/proposals/:id/negotiations` | Supplier | Negotiation chat |
| `/admin/dashboard` | Admin | Dashboard |
| `/admin/accounts/pending` | Admin | Pending accounts |
| `/admin/accounts` | Admin | All accounts |
| `/admin/accounts/:id` | Admin | Account detail |
| `/admin/tenders/pending` | Admin | Pending tenders |
| `/admin/tenders` | Admin | All tenders |
| `/admin/tenders/:id` | Admin | Tender detail |
| `/admin/proposals/:id/negotiations` | Admin | View negotiation |
| `/admin/roles` | Admin | Roles & permissions |

## Build

```bash
npm run build
```
