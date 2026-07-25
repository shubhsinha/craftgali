# Craftgali

A marketplace platform for artisans and craftspeople to list, auction, and sell handcrafted goods.

## Project Structure

```
craftgali/
├── apps/
│   ├── backend/      # Go API server
│   ├── web/          # Next.js PWA
│   └── mobile/       # Flutter app
├── packages/
│   └── design-tokens/ # Shared design tokens
├── docs/             # Project documentation
├── infra/            # Infrastructure config
└── .github/          # CI/CD workflows
```

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 20+
- Flutter 3.16+
- Docker & Docker Compose

### Local Development

```bash
# Start all services
cd infra
docker-compose up -d

# Backend
cd apps/backend
go run ./cmd/server/main.go

# Web
cd apps/web
npm install && npm run dev

# Mobile
cd apps/mobile
flutter pub get && flutter run
```
