# Gymcentrix — The High-Performance Gym Ecosystem

Gymcentrix is a premium, monorepo-based gym management platform designed for scaling fitness enterprises. It features a high-end, glassmorphic administrative dashboard, real-time biometric agent integration, and robust multi-branch subscription enforcement.

## 🚀 Core Capabilities

- **Tiered Branch Locking**: Automated enforcement of subscription limits (1 branch for Basic/Pro, Unlimited for Enterprise).
- **Manual Facility Activation**: Explicit "Active Branch" selection for restricted plans, allowing gyms to prioritize specific facilities for biometric traffic.
- **Biometric API Infrastructure**: Express-based backend with API Key authentication and facility-level gating for check-ins, heartbeats, and agent registrations.
- **Super Admin Dashboard**: Comprehensive tenant oversight, including gym registration, plan management, and live deployment health monitoring.
- **PWA Ready**: Mobile-optimized dashboard with offline support and "Add to Home Screen" capabilities.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend API**: Express.js, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Infrastructure**: Turborepo, PWA (Service Workers)
- **Styling**: Premium Glassmorphism, Lucide Icons, Modern Typography

## 📦 Project Structure

```text
├── apps
│   ├── api          # Express backend for biometric agents
│   └── web          # Next.js administrative dashboard & landing page
├── packages
│   └── db           # Shared Prisma schema and database client
├── openspec         # Spec-driven development documentation
└── LICENSE          # Proprietary license (Northernware)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL instance

### INSTALLATION
```bash
npm install
```

### DATABASE SETUP
```bash
cd packages/db
npx prisma generate
npx prisma db push
```

### RUN DEVELOPMENT
```bash
npm run dev
```

## 🛡️ License

**Proprietary.** 
Copyright (c) 2026 Northernware Software Development Services. All rights reserved.
Unauthorized use, modification, or distribution is strictly prohibited.
