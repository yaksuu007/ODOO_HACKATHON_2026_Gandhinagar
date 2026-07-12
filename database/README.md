# AssetFlow Database Setup

This directory contains the complete database schema and initialization scripts for the AssetFlow Enterprise Asset & Resource Management System.

## Prerequisites

- PostgreSQL 15 or higher
- psql command-line tool
- Bash shell (for running the initialization script)

## File Structure

```
database/
├── README.md                          # This file
├── 00_init_database.sh               # Master initialization script
├── 01_create_database.sql            # Database creation
├── 02_create_enums.sql               # Enum type definitions
├── 03_tables_auth_rbac.sql           # Authentication & RBAC tables
├── 04_tables_org_setup.sql           # Organization setup tables
├── 05_tables_asset_management.sql    # Asset management tables
├── 06_tables_allocation.sql          # Asset allocation tables
├── 07_tables_booking.sql             # Resource booking tables
├── 08_tables_maintenance.sql         # Maintenance tables
├── 09_tables_audit.sql               # Audit tables
├── 10_tables_reports.sql             # Reports tables
├── 11_tables_notifications.sql       # Notifications tables
├── 12_tables_activity_logs.sql       # Activity logs tables
├── 13_tables_dashboard.sql           # Dashboard tables
├── 14_tables_system.sql              # System tables
├── 15_create_indexes.sql             # Performance indexes
├── 16_create_constraints.sql         # Additional constraints
├── 17_create_permissions.sql         # Permissions and grants
└── 18_seed_data.sql                  # Seed data
```

## Quick Start

### Using the Master Script (Recommended)

1. Make the script executable:
   ```bash
   chmod +x 00_init_database.sh
   ```

2. Run the script:
   ```bash
   ./00_init_database.sh
   ```

The script will:
- Create the `assetflow` database
- Create all required extensions
- Create all enum types
- Create all tables in dependency order
- Create performance indexes
- Create constraints
- Set up permissions
- Insert seed data

### Manual Execution

If you prefer to run the SQL files manually, execute them in numerical order:

```bash
psql -U postgres -f 01_create_database.sql
psql -U postgres -d assetflow -f 02_create_enums.sql
psql -U postgres -d assetflow -f 03_tables_auth_rbac.sql
# ... continue with remaining files in order
```

## Default Credentials

After initialization, the following credentials are created:

### Admin User
- **Email**: admin@default.com
- **Password**: Admin123!
- **Role**: Super Admin

### Database Users
- **assetflow_app**: Full access (application user)
- **assetflow_readonly**: Read-only access (reporting user)

⚠️ **IMPORTANT**: Change all default passwords in production!

### Changing Passwords

```sql
-- Change admin user password (via application)
-- This should be done through the application interface

-- Change database user passwords
ALTER ROLE assetflow_app WITH PASSWORD 'your_secure_password';
ALTER ROLE assetflow_readonly WITH PASSWORD 'your_secure_password';
```

## Database Schema Overview

### Tables by Domain

**Authentication & RBAC** (8 tables)
- organizations, users, roles, permissions, role_permissions, user_roles, sessions, password_reset_tokens

**Organization Setup** (5 tables)
- departments, employees, asset_categories, locations, location_hierarchy

**Asset Management** (8 tables)
- assets, asset_status_history, asset_photos, asset_documents, asset_qr_codes, asset_specifications, asset_warranties, asset_depreciation

**Asset Allocation** (4 tables)
- allocations, allocation_history, transfers, transfer_approvals, allocation_conflicts

**Resource Booking** (5 tables)
- bookable_resources, bookings, booking_history, booking_attendees, resource_availability, booking_blackouts

**Maintenance** (7 tables)
- maintenance_requests, maintenance_activities, maintenance_technicians, vendors, maintenance_schedules, maintenance_approvals, maintenance_costs

**Audit** (6 tables)
- audit_cycles, audit_assignments, audit_items, audit_discrepancies, audit_history, audit_checklists, audit_checklist_items

**Reports** (3 tables)
- reports, report_schedules, report_subscriptions

**Notifications** (5 tables)
- notifications, notification_templates, notification_preferences, notification_rules, notification_logs

**Activity Logs** (2 tables)
- activity_logs, activity_log_details

**Dashboard** (3 tables)
- dashboard_configs, dashboard_widgets, kpi_metrics

**System** (3 tables)
- settings, feature_flags, system_logs

**Total**: 62 tables

## Key Features

### Multi-Tenant Architecture
- Row-level isolation via `organization_id`
- Soft delete pattern with `deleted_at` timestamps
- Comprehensive audit trails

### Performance Optimization
- Strategic partial indexes
- Composite indexes for common query patterns
- Exclusion constraints for preventing overlaps
- GIST indexes for time-range queries

### Data Integrity
- Foreign key constraints
- Unique constraints on business keys
- Check constraints for data validation
- Exclusion constraints for business rules

## Extensions Required

- `uuid-ossp` - UUID generation
- `btree_gist` - Exclusion constraints
- `pg_trgm` - Text search (optional)
- `pgcrypto` - Encryption (optional)

## Backup & Restore

### Backup
```bash
pg_dump -U postgres assetflow > assetflow_backup.sql
```

### Restore
```bash
psql -U postgres assetflow < assetflow_backup.sql
```

## Troubleshooting

### Connection Issues
If you encounter connection errors, verify:
1. PostgreSQL is running
2. Connection parameters in the script match your setup
3. User has necessary permissions

### Permission Errors
If you encounter permission errors:
1. Ensure you're running as a PostgreSQL superuser
2. Check that the database user exists
3. Verify the user has CREATE DATABASE privileges

### Extension Errors
If extension installation fails:
1. Ensure PostgreSQL extensions are installed
2. Check if extensions are available in your PostgreSQL installation
3. Run `CREATE EXTENSION IF NOT EXISTS` individually to identify the issue

## Development vs Production

### Development
- Use the default seed data
- Use default passwords (change them locally if needed)
- Enable all logging for debugging

### Production
- Remove all seed data except system defaults
- Change all default passwords
- Configure connection pooling (PgBouncer)
- Set up read replicas
- Configure backup automation
- Enable SSL/TLS for connections
- Implement Row-Level Security policies

## Maintenance

### Regular Tasks
- Run `VACUUM ANALYZE` weekly
- Monitor index usage with `pg_stat_user_indexes`
- Archive old activity logs and system logs
- Update statistics after bulk data loads
- Monitor table bloat

### Index Maintenance
```sql
-- Check index bloat
SELECT * FROM pg_stat_user_indexes;

-- Reindex if needed
REINDEX TABLE table_name;

-- Analyze tables
ANALYZE table_name;
```

## Schema Documentation

For detailed schema documentation, refer to `DATABASE_SCHEMA.md` in the project root, which includes:
- Complete entity list
- Detailed table schemas
- Relationship documentation
- Enum definitions
- Performance indexes
- Constraints
- Database optimization strategy
- ER diagrams

## Support

For issues or questions about the database schema:
1. Check the DATABASE_SCHEMA.md documentation
2. Review the SQL file comments
3. Consult the PostgreSQL documentation
4. Contact the database team

## Version History

- **v1.0** - Initial schema creation
  - 62 tables
  - 30+ enum types
  - Comprehensive indexing strategy
  - Multi-tenant architecture
  - Complete audit trails
