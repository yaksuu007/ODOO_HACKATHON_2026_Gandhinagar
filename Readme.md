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

## � Deployment

### Vercel Deployment

This project is configured for Vercel deployment with the following setup:

#### Prerequisites

1. **Database**: Set up a PostgreSQL database (recommended: Supabase, Neon, or Vercel Postgres)
2. **Redis (Optional)**: For caching and queues (recommended: Upstash or Redis Cloud)
3. **Email Service (Optional)**: For notifications (recommended: Resend or SendGrid)
4. **SMS Service (Optional)**: For SMS notifications (recommended: Twilio)

#### Environment Variables

Copy `.env.production.example` and configure the following required variables in Vercel:

```bash
# Required
DATABASE_URL="postgresql://user:password@host:5432/assetflow"
JWT_SECRET="your-production-jwt-secret-min-32-chars"
SESSION_SECRET="your-production-session-secret-min-32-chars"
NEXT_PUBLIC_API_URL="https://your-project.vercel.app/api"
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"
NODE_ENV="production"

# Optional (for notifications)
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASSWORD="your-resend-api-key"
SMTP_FROM="noreply@yourdomain.com"

# Optional (for caching)
REDIS_URL="redis://your-redis-url:6379"
```

#### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the root directory

3. **Configure environment variables**
   - In Vercel project settings → Environment Variables
   - Add all required variables from `.env.production.example`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically run the build script and deploy

5. **Post-deployment**
   - Run database migrations automatically via the build script
   - Test your deployed application
   - Set up custom domain (optional)

#### Deployment Configuration

The project includes:
- `vercel.json` - Vercel configuration for monorepo deployment
- `scripts/vercel-build.sh` - Build script with database migrations
- `.vercelignore` - Files to exclude from deployment
- `apps/api/api/index.ts` - Serverless function entry point

#### Troubleshooting

- **Build fails**: Check that all environment variables are set correctly
- **Database connection errors**: Verify `DATABASE_URL` is correct and database is accessible
- **API errors**: Ensure `NEXT_PUBLIC_API_URL` matches your deployed domain

### Manual Deployment

For manual deployment to other platforms:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the web app:
   ```bash
   cd apps/web
   npm start
   ```

3. Deploy the API:
   ```bash
   cd apps/api
   npm start
   ```

## �📄 License

MIT
