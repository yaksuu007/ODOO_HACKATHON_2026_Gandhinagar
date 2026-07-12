# 📌 Overview

**AssetFlow** — Enterprise Asset & Resource Management System

A comprehensive monorepo application for managing enterprise assets, resources, allocations, bookings, maintenance, audits, and reporting. Built with modern web technologies for scalability and maintainability.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Hono, TypeScript, Prisma
- **Database**: PostgreSQL (local via Docker or Neon)
- **Package Manager**: npm
- **Build System**: Turborepo
- **ORM**: Prisma

## 📂 Project Structure

```
assetflow/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Hono backend application
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   ├── shared-utils/     # Shared utility functions
│   ├── shared-configs/   # Shared configurations
│   ├── api-client/       # Shared API client
│   └── ui-components/    # Shared UI components
├── configs/         # Monorepo configurations
├── docs/            # Documentation
├── prisma/          # Prisma schema and migrations
├── database/        # Database setup scripts
└── docker-compose.yml # Docker setup
```

## ✨ Features

- **Asset Management**: Track and manage enterprise assets
- **Resource Booking**: Book and allocate resources
- **Maintenance Scheduling**: Schedule and track asset maintenance
- **Audit System**: Conduct asset audits
- **Organization Management**: Manage departments and users
- **Reporting**: Generate reports and analytics
- **Activity Logs**: Track all system activities
- **RBAC**: Role-based access control

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (for local PostgreSQL)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. Start PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

5. Set up the database:
   ```bash
   npm run prisma:migrate
   ```

6. Seed the database (optional):
   ```bash
   npm run prisma:seed
   ```

### Development

Start all applications in development mode:
```bash
npm run dev
```

Start individual applications:
```bash
# Frontend
npm run dev:web

# Backend
npm run dev:api
```

### Build

Build all applications:
```bash
npm run build
```

Build individual applications:
```bash
npm run build:web
npm run build:api
```

## 📜 Available Scripts

| Script               | Description                                  |
|----------------------|----------------------------------------------|
| `npm run dev`        | Start all applications in development mode   |
| `npm run dev:web`    | Start only the frontend                      |
| `npm run dev:api`    | Start only the backend                       |
| `npm run build`      | Build all applications                       |
| `npm run test`       | Run all tests                                |
| `npm run lint`       | Lint all packages                            |
| `npm run format`     | Format all code                              |
| `npm run type-check` | Run TypeScript type checking                 |
| `npm run clean`      | Clean all build outputs                      |
| `npm run prisma:migrate` | Run database migrations                  |
| `npm run prisma:studio` | Open Prisma Studio                       |
| `npm run prisma:seed` | Seed the database                           |

## 📚 Documentation

- [Architecture](./docs/architecture/ARCHITECTURE.md)
- [Database Schema](./docs/architecture/DATABASE_SCHEMA.md)
- [Database Setup](./database/README.md)

## 📄 License

MIT
