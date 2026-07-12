# AssetFlow

Enterprise Asset & Resource Management System

## Overview

AssetFlow is a comprehensive monorepo application for managing enterprise assets, resources, allocations, bookings, maintenance, audits, and reporting.

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Hono, TypeScript, Prisma
- **Database**: PostgreSQL
- **Package Manager**: npm
- **Build System**: Turborepo

## Project Structure

```
assetflow/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Hono backend application
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   ├── shared-utils/     # Shared utility functions
│   ├── shared-configs/   # Shared configurations
│   └── api-client/       # Shared API client
├── configs/         # Monorepo configurations
├── docs/            # Documentation
└── scripts/         # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL

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

4. Set up the database:
   ```bash
   npm run prisma:migrate
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

## Scripts

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run format` - Format all code
- `npm run clean` - Clean all build outputs

## Documentation

- [Architecture](./docs/architecture/ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./docs/api/)
- [Development Guide](./docs/development/)

## License

MIT
