# Craftgali — Architecture

## Stack
- **Backend**: Go (Gin), PostgreSQL, JWT
- **Web**: Next.js 14, Tailwind CSS, PWA
- **Mobile**: Flutter 3
- **Infra**: Docker Compose (local), Terraform (prod)

## Backend Domain Design
Each `internal/` package corresponds to a bounded context:
- `auth` — registration, login, JWT, RBAC
- `users` — profiles, roles (artist/collector), reputation
- `listings` — CRUD for artworks, image uploads
- `auctions` — bidding engine, timed auctions, bid validation
- `escrow` — UPI payment escrow
- `commission` — tiered commission calculation
- `messaging` — buyer/seller chat
- `discovery` — location/radius search, recommendations
- `portfolio` — public artist galleries

## Data Flow
```
Client (Web/Mobile) → REST API (Go/Gin) → PostgreSQL
```

## External Services
- Payment gateway (UPI) — escrow integration
- Image storage — CDN/object storage
- Push notifications — FCM/APNs
