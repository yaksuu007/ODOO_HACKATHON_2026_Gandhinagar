# Prisma ORM Setup

This directory contains the Prisma ORM configuration for the AssetFlow project. The Prisma schema is generated from the existing PostgreSQL database schema defined in the `database/` directory.

## Files

- `schema.prisma` - Prisma schema definition with all models, enums, and relationships
- `seed.ts` - Database seed file with initial data
- `README.md` - This file

## Prerequisites

Before using Prisma, ensure you have:

1. Node.js installed (v18 or higher recommended)
2. PostgreSQL 15+ database running
3. Database initialized using the SQL scripts in `database/`

## Installation

Install Prisma CLI and the Prisma Client:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

## Environment Configuration

Create a `.env` file in the project root with your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/assetflow?schema=assetflow"
```

Replace the placeholder values with your actual database credentials.

## Prisma Commands

### Generate Prisma Client

Generate the Prisma Client based on the schema:

```bash
npx prisma generate
```

This command generates the Prisma Client in `node_modules/.prisma/client` and TypeScript types.

### Format Schema

Format the Prisma schema file:

```bash
npx prisma format
```

### Validate Schema

Validate the Prisma schema for errors:

```bash
npx prisma validate
```

### Database Migrations

**Important:** This project uses SQL migrations as the primary source of truth. The `database/` directory contains all SQL DDL scripts that should be run to initialize the database.

If you need to create new migrations using Prisma:

```bash
npx prisma migrate dev --name <migration_name>
```

However, for this project, it's recommended to:
1. Make changes to the SQL files in `database/`
2. Run the SQL scripts directly
3. Update `schema.prisma` to match the SQL changes
4. Run `npx prisma generate` to update the Prisma Client

### Seed Database

Seed the database with initial data:

```bash
npx prisma db seed
```

Or using ts-node:

```bash
npx ts-node prisma/seed.ts
```

The seed file creates:
- Default organization
- Admin user (email: `admin@default.com`, password: `Admin123!`)
- Default roles (Super Admin, Admin, Manager, Employee, Viewer)
- Default permissions
- Default department, location, and asset category
- Sample bookable resource
- Default settings and feature flags
- Sample notification templates
- Sample dashboard widgets
- Sample report

**Security Note:** Change the default admin password in production before deploying.

### Studio (Database GUI)

Open Prisma Studio to interact with your database visually:

```bash
npx prisma studio
```

## Schema Overview

The Prisma schema includes the following domain models:

### Authentication & RBAC
- `Organization` - Multi-tenant organizations
- `User` - User accounts
- `Role` - User roles with hierarchical levels
- `Permission` - Granular permissions
- `RolePermission` - Role-permission assignments
- `UserRole` - User-role assignments
- `Session` - User sessions
- `PasswordResetToken` - Password reset tokens

### Organization Setup
- `Department` - Organizational departments
- `Employee` - Employee records
- `AssetCategory` - Asset categorization
- `Location` - Physical locations
- `LocationHierarchy` - Hierarchical location structure

### Asset Management
- `Asset` - Asset inventory
- `AssetStatusHistory` - Asset status changes
- `AssetPhoto` - Asset photos
- `AssetDocument` - Asset documents
- `AssetQrCode` - QR codes for assets
- `AssetSpecification` - Asset specifications
- `AssetWarranty` - Asset warranties
- `AssetDepreciation` - Asset depreciation tracking

### Asset Allocation
- `Allocation` - Asset allocations
- `AllocationHistory` - Allocation history
- `Transfer` - Asset transfers
- `TransferApproval` - Transfer approvals
- `AllocationConflict` - Allocation conflict tracking

### Resource Booking
- `BookableResource` - Bookable resources (rooms, equipment)
- `Booking` - Resource bookings
- `BookingHistory` - Booking history
- `BookingAttendee` - Booking attendees
- `ResourceAvailability` - Resource availability rules
- `BookingBlackout` - Booking blackout periods

### Maintenance
- `MaintenanceRequest` - Maintenance requests
- `MaintenanceActivity` - Maintenance activities
- `MaintenanceTechnician` - Technician assignments
- `Vendor` - Vendor information
- `MaintenanceSchedule` - Scheduled maintenance
- `MaintenanceApproval` - Maintenance approvals
- `MaintenanceCost` - Maintenance cost tracking

### Audit
- `AuditCycle` - Audit cycles
- `AuditAssignment` - Auditor assignments
- `AuditItem` - Individual asset audits
- `AuditDiscrepancy` - Audit discrepancies
- `AuditHistory` - Audit history
- `AuditChecklist` - Audit checklists
- `AuditChecklistItem` - Checklist items

### Reports
- `Report` - Report definitions
- `ReportSchedule` - Report schedules
- `ReportSubscription` - Report subscriptions

### Notifications
- `Notification` - User notifications
- `NotificationTemplate` - Notification templates
- `NotificationPreference` - User notification preferences
- `NotificationRule` - Notification rules
- `NotificationLog` - Notification delivery logs

### Activity Logs
- `ActivityLog` - System activity logs
- `ActivityLogDetail` - Activity log details

### Dashboard
- `DashboardConfig` - User dashboard configurations
- `DashboardWidget` - Dashboard widgets
- `KpiMetric` - KPI metrics storage

### System
- `Setting` - System settings
- `FeatureFlag` - Feature flags
- `SystemLog` - System logs

## Enums

The schema includes numerous enums for type safety:
- `UserRoleLevel`, `PermissionModule`, `ActionType`
- `EmploymentStatus`, `LocationType`
- `AssetStatus`, `AssetCondition`, `OwnershipType`, `DepreciationMethod`, `DocumentType`
- `AllocationStatus`, `AllocationTargetType`, `TransferPriority`, `TransferStatus`, `ApprovalStatus`, `ConflictType`
- `ResourceType`, `BookingStatus`, `AttendeeStatus`
- `MaintenanceType`, `MaintenancePriority`, `MaintenanceStatus`, `MaintenanceActivityType`, `CostType`
- `AuditStatus`, `AuditItemStatus`, `DiscrepancyType`, `DiscrepancySeverity`, `ResolutionStatus`
- `ReportType`, `ScheduleType`
- `NotificationType`, `NotificationPriority`, `NotificationChannel`, `NotificationStatus`
- `WidgetType`
- `SettingValueType`, `LogLevel`

## SQL Constraints Not Representable in Prisma

The following SQL constraints exist in the migration files but cannot be represented in Prisma:

### CHECK Constraints
- All CHECK constraints from the SQL files (e.g., positive values, date comparisons)
- These are enforced at the database level

### EXCLUSION Constraints
- `ex_booking_overlap` - Prevent overlapping bookings for the same resource
- `ex_allocation_double_active` - Prevent double active allocation for the same asset
- These use GIST indexes and cannot be represented in Prisma

### Partial Indexes
- Many partial indexes with WHERE clauses exist in the SQL
- Prisma does not support partial indexes

### Composite CHECK Constraints
- `chk_allocation_target_specified`
- `chk_transfer_target_specified`
- `chk_booking_attendee_identifier`
- These complex CHECK constraints cannot be represented in Prisma

### Partial Unique Constraints
- `uq_settings_global_key` (WHERE organization_id IS NULL)
- `uq_feature_flags_global_name` (WHERE organization_id IS NULL)
- `uq_allocations_asset_active` (WHERE status = 'active')
- These use WHERE clauses and cannot be represented in Prisma

**Important:** These constraints remain in the SQL migration files and are enforced by PostgreSQL. The Prisma schema includes comments noting where these constraints exist.

## Using Prisma Client

After generating the Prisma Client, you can use it in your application:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Example: Create a new asset
const asset = await prisma.asset.create({
  data: {
    organizationId: 'org-id',
    categoryId: 'category-id',
    assetTag: 'AST-001',
    name: 'Laptop',
    status: 'available',
  },
})

// Example: Query assets with relations
const assets = await prisma.asset.findMany({
  include: {
    category: true,
    location: true,
    assignedToEmployee: true,
  },
})

// Example: Update an asset
const updatedAsset = await prisma.asset.update({
  where: { id: 'asset-id' },
  data: { status: 'allocated' },
})
```

## Troubleshooting

### Prisma Client Generation Fails

If `npx prisma generate` fails:
1. Ensure the schema is valid: `npx prisma validate`
2. Check for syntax errors in `schema.prisma`
3. Ensure all relation names are unique and properly defined

### Database Connection Issues

If you cannot connect to the database:
1. Verify your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Check that the database exists
4. Verify the database user has the necessary permissions

### Seed File Fails

If the seed file fails:
1. Ensure the database is initialized with SQL scripts first
2. Check that the Prisma Client is generated: `npx prisma generate`
3. Verify the seed data doesn't conflict with existing data

### Schema Validation Errors

If `npx prisma validate` reports errors:
1. Check for duplicate relation names
2. Ensure all foreign key references point to existing models
3. Verify enum names are unique
4. Check for circular dependencies in relations

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Notes

- The SQL files in `database/` are the primary source of truth for the database schema
- When making schema changes, update both the SQL files and `schema.prisma`
- Always run SQL migrations first, then regenerate Prisma Client
- The Prisma schema is designed to work with the existing PostgreSQL database, not to replace it
