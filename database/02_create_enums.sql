-- AssetFlow Database Schema
-- Enum Type Definitions
-- PostgreSQL 15+

-- Set search path
SET search_path TO assetflow, public;

-- Authentication & RBAC Enums
CREATE TYPE user_role_level AS ENUM (
    'super_admin',
    'org_admin',
    'department_admin',
    'manager',
    'supervisor',
    'employee',
    'viewer'
);

CREATE TYPE permission_module AS ENUM (
    'organizations',
    'users',
    'roles',
    'permissions',
    'departments',
    'employees',
    'asset_categories',
    'locations',
    'assets',
    'allocations',
    'transfers',
    'bookable_resources',
    'bookings',
    'maintenance',
    'vendors',
    'audit',
    'reports',
    'notifications',
    'dashboard',
    'settings',
    'system'
);

CREATE TYPE action_type AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'list',
    'export',
    'import',
    'approve',
    'reject',
    'assign',
    'unassign',
    'archive',
    'restore'
);

-- Organization Setup Enums
CREATE TYPE employment_status AS ENUM (
    'active',
    'on_leave',
    'terminated',
    'resigned',
    'retired',
    'contractor',
    'intern'
);

CREATE TYPE location_type AS ENUM (
    'building',
    'floor',
    'room',
    'desk',
    'warehouse',
    'vehicle',
    'remote',
    'other'
);

-- Asset Management Enums
CREATE TYPE asset_status AS ENUM (
    'available',
    'allocated',
    'in_maintenance',
    'reserved',
    'retired',
    'lost',
    'stolen',
    'damaged',
    'disposed',
    'in_transit'
);

CREATE TYPE asset_condition AS ENUM (
    'excellent',
    'good',
    'fair',
    'poor',
    'damaged',
    'non_functional'
);

CREATE TYPE ownership_type AS ENUM (
    'owned',
    'leased',
    'rented',
    'borrowed',
    'loaned'
);

CREATE TYPE depreciation_method AS ENUM (
    'straight_line',
    'declining_balance',
    'units_of_production',
    'none'
);

CREATE TYPE document_type AS ENUM (
    'manual',
    'warranty',
    'invoice',
    'receipt',
    'certificate',
    'license',
    'insurance',
    'other'
);

-- Asset Allocation Enums
CREATE TYPE allocation_status AS ENUM (
    'active',
    'returned',
    'overdue',
    'cancelled',
    'pending_approval',
    'rejected'
);

CREATE TYPE allocation_target_type AS ENUM (
    'employee',
    'department',
    'project',
    'vendor'
);

CREATE TYPE transfer_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);

CREATE TYPE transfer_status AS ENUM (
    'pending',
    'approved',
    'in_transit',
    'completed',
    'rejected',
    'cancelled'
);

CREATE TYPE approval_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);

CREATE TYPE conflict_type AS ENUM (
    'double_allocation',
    'location_mismatch',
    'status_conflict',
    'permission_conflict'
);

-- Resource Booking Enums
CREATE TYPE resource_type AS ENUM (
    'room',
    'equipment',
    'vehicle',
    'facility',
    'other'
);

CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'no_show',
    'cancelled'
);

CREATE TYPE attendee_status AS ENUM (
    'invited',
    'accepted',
    'declined',
    'tentative'
);

-- Maintenance Enums
CREATE TYPE maintenance_type AS ENUM (
    'preventive',
    'corrective',
    'predictive',
    'emergency',
    'calibration',
    'upgrade'
);

CREATE TYPE maintenance_priority AS ENUM (
    'low',
    'normal',
    'high',
    'critical',
    'emergency'
);

CREATE TYPE maintenance_status AS ENUM (
    'pending',
    'approved',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled',
    'rejected'
);

CREATE TYPE maintenance_activity_type AS ENUM (
    'diagnosis',
    'repair',
    'replacement',
    'inspection',
    'calibration',
    'upgrade',
    'cleaning',
    'testing'
);

CREATE TYPE cost_type AS ENUM (
    'labor',
    'parts',
    'materials',
    'travel',
    'other'
);

-- Audit Enums
CREATE TYPE audit_status AS ENUM (
    'planned',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled'
);

CREATE TYPE audit_item_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'skipped',
    'discrepancy_found'
);

CREATE TYPE discrepancy_type AS ENUM (
    'missing',
    'extra',
    'location_mismatch',
    'condition_mismatch',
    'tag_mismatch',
    'data_inconsistency'
);

CREATE TYPE discrepancy_severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE resolution_status AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed',
    'escalated'
);

-- Reports Enums
CREATE TYPE report_type AS ENUM (
    'asset_inventory',
    'allocation_summary',
    'utilization',
    'maintenance',
    'audit',
    'financial',
    'custom'
);

CREATE TYPE schedule_type AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'yearly',
    'custom'
);

-- Notifications Enums
CREATE TYPE notification_type AS ENUM (
    'allocation',
    'transfer',
    'maintenance',
    'audit',
    'booking',
    'system',
    'approval',
    'reminder',
    'alert'
);

CREATE TYPE notification_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);

CREATE TYPE notification_channel AS ENUM (
    'email',
    'sms',
    'push',
    'in_app',
    'webhook'
);

CREATE TYPE notification_status AS ENUM (
    'pending',
    'sent',
    'delivered',
    'read',
    'failed'
);

-- Dashboard Enums
CREATE TYPE widget_type AS ENUM (
    'chart',
    'metric',
    'table',
    'list',
    'calendar',
    'gauge',
    'map',
    'custom'
);

-- System Enums
CREATE TYPE setting_value_type AS ENUM (
    'string',
    'number',
    'boolean',
    'json',
    'encrypted'
);

CREATE TYPE log_level AS ENUM (
    'debug',
    'info',
    'notice',
    'warning',
    'error',
    'critical',
    'fatal',
    'panic'
);
