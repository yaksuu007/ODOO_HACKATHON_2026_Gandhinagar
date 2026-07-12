#!/bin/bash

# AssetFlow Database Initialization Script
# This script runs all SQL files in the correct order to set up the database

set -e  # Exit on error

# Database configuration
DB_NAME="assetflow"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Directory containing SQL files
SQL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}AssetFlow Database Initialization${NC}"
echo "================================"
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c '\q' 2>/dev/null; then
    echo -e "${RED}Error: Cannot connect to PostgreSQL${NC}"
    echo "Please ensure PostgreSQL is running and credentials are correct"
    exit 1
fi
echo -e "${GREEN}PostgreSQL connection successful${NC}"
echo ""

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    
    echo -e "${YELLOW}Running: $description${NC}"
    echo "File: $file"
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"; then
        echo -e "${GREEN}✓ $description completed${NC}"
    else
        echo -e "${RED}✗ $description failed${NC}"
        exit 1
    fi
    echo ""
}

# Run SQL files in order
run_sql_file "$SQL_DIR/01_create_database.sql" "Create Database"
run_sql_file "$SQL_DIR/02_create_enums.sql" "Create Enum Types"
run_sql_file "$SQL_DIR/03_tables_auth_rbac.sql" "Create Authentication & RBAC Tables"
run_sql_file "$SQL_DIR/04_tables_org_setup.sql" "Create Organization Setup Tables"
run_sql_file "$SQL_DIR/05_tables_asset_management.sql" "Create Asset Management Tables"
run_sql_file "$SQL_DIR/06_tables_allocation.sql" "Create Asset Allocation Tables"
run_sql_file "$SQL_DIR/07_tables_booking.sql" "Create Resource Booking Tables"
run_sql_file "$SQL_DIR/08_tables_maintenance.sql" "Create Maintenance Tables"
run_sql_file "$SQL_DIR/09_tables_audit.sql" "Create Audit Tables"
run_sql_file "$SQL_DIR/10_tables_reports.sql" "Create Reports Tables"
run_sql_file "$SQL_DIR/11_tables_notifications.sql" "Create Notifications Tables"
run_sql_file "$SQL_DIR/12_tables_activity_logs.sql" "Create Activity Logs Tables"
run_sql_file "$SQL_DIR/13_tables_dashboard.sql" "Create Dashboard Tables"
run_sql_file "$SQL_DIR/14_tables_system.sql" "Create System Tables"
run_sql_file "$SQL_DIR/15_create_indexes.sql" "Create Performance Indexes"
run_sql_file "$SQL_DIR/16_create_constraints.sql" "Create Additional Constraints"
run_sql_file "$SQL_DIR/17_create_permissions.sql" "Create Permissions and Grants"
run_sql_file "$SQL_DIR/18_seed_data.sql" "Insert Seed Data"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Database initialization completed successfully!${NC}"
echo ""
echo "Default credentials:"
echo "  Database: $DB_NAME"
echo "  Admin User: admin@default.com"
echo "  Admin Password: Admin123!"
echo ""
echo "⚠️  IMPORTANT: Change the default passwords in production!"
echo ""
echo "Application users created:"
echo "  - assetflow_app (full access)"
echo "  - assetflow_readonly (read-only)"
echo ""
echo "Update passwords with:"
echo "  ALTER ROLE assetflow_app WITH PASSWORD 'your_secure_password';"
echo "  ALTER ROLE assetflow_readonly WITH PASSWORD 'your_secure_password';"
