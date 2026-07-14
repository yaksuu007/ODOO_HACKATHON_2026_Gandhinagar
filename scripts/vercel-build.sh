#!/bin/bash

# Vercel Build Script for AssetFlow
# This script runs database migrations and builds the project

set -e

echo "🚀 Starting Vercel build process..."

# Run Prisma migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Running Prisma migrations..."
  cd apps/api
  npx prisma generate --schema ../../prisma/schema.prisma
  npx prisma migrate deploy --schema ../../prisma/schema.prisma
  cd ../..
  echo "✅ Prisma migrations completed"
else
  echo "⚠️  DATABASE_URL not set, skipping migrations"
fi

# Build the entire monorepo
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully"
