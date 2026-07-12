-- AssetFlow Database Schema
-- Seed Data
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- Insert default organization
INSERT INTO organizations (id, name, slug, email, max_users, max_assets, subscription_plan, subscription_status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Organization',
    'default',
    'admin@default.com',
    100,
    1000,
    'enterprise',
    'active'
) ON CONFLICT (slug) DO NOTHING;

-- Insert default admin user
-- Note: Password hash is for 'Admin123!' - change in production
INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, is_active, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM organizations WHERE slug = 'default'),
    'admin@default.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYlW5QhWq5i',
    'System',
    'Administrator',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert default roles
INSERT INTO roles (id, organization_id, name, slug, description, is_system, level)
VALUES 
    ('00000000-0000-0000-0000-000000000003', (SELECT id FROM organizations WHERE slug = 'default'), 'Super Admin', 'super_admin', 'Full system access', true, 100),
    ('00000000-0000-0000-0000-000000000004', (SELECT id FROM organizations WHERE slug = 'default'), 'Admin', 'admin', 'Organization administrator', true, 90),
    ('00000000-0000-0000-0000-000000000005', (SELECT id FROM organizations WHERE slug = 'default'), 'Manager', 'manager', 'Department manager', true, 70),
    ('00000000-0000-0000-0000-000000000006', (SELECT id FROM organizations WHERE slug = 'default'), 'Employee', 'employee', 'Regular employee', true, 50),
    ('00000000-0000-0000-0000-000000000007', (SELECT id FROM organizations WHERE slug = 'default'), 'Viewer', 'viewer', 'Read-only access', true, 10)
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Assign super admin role to admin user
INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@default.com'),
    (SELECT id FROM roles WHERE slug = 'super_admin' AND organization_id = (SELECT id FROM organizations WHERE slug = 'default')),
    (SELECT id FROM users WHERE email = 'admin@default.com'),
    true
) ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (id, name, slug, module, action, description, is_system)
VALUES 
    ('00000000-0000-0000-0000-000000000008', 'View Organizations', 'organizations.read', 'organizations', 'read', 'View organization details', true),
    ('00000000-0000-0000-0000-000000000009', 'Manage Organizations', 'organizations.manage', 'organizations', 'update', 'Manage organization settings', true),
    ('00000000-0000-0000-0000-00000000000a', 'View Users', 'users.read', 'users', 'read', 'View user accounts', true),
    ('00000000-0000-0000-0000-00000000000b', 'Manage Users', 'users.manage', 'users', 'update', 'Manage user accounts', true),
    ('00000000-0000-0000-0000-00000000000c', 'View Assets', 'assets.read', 'assets', 'read', 'View asset inventory', true),
    ('00000000-0000-0000-0000-00000000000d', 'Manage Assets', 'assets.manage', 'assets', 'update', 'Manage asset records', true),
    ('00000000-0000-0000-0000-00000000000e', 'Allocate Assets', 'assets.allocate', 'assets', 'assign', 'Allocate assets to users', true),
    ('00000000-0000-0000-0000-00000000000f', 'View Allocations', 'allocations.read', 'allocations', 'read', 'View asset allocations', true),
    ('00000000-0000-0000-0000-000000000010', 'Manage Allocations', 'allocations.manage', 'allocations', 'update', 'Manage asset allocations', true),
    ('00000000-0000-0000-0000-000000000011', 'View Maintenance', 'maintenance.read', 'maintenance', 'read', 'View maintenance requests', true),
    ('00000000-0000-0000-0000-000000000012', 'Manage Maintenance', 'maintenance.manage', 'maintenance', 'update', 'Manage maintenance requests', true),
    ('00000000-0000-0000-0000-000000000013', 'View Reports', 'reports.read', 'reports', 'read', 'View reports', true),
    ('00000000-0000-0000-0000-000000000014', 'Manage Reports', 'reports.manage', 'reports', 'update', 'Manage reports', true),
    ('00000000-0000-0000-0000-000000000015', 'View Audit', 'audit.read', 'audit', 'read', 'View audit cycles', true),
    ('00000000-0000-0000-0000-000000000016', 'Manage Audit', 'audit.manage', 'audit', 'update', 'Manage audit cycles', true)
ON CONFLICT (slug) DO NOTHING;

-- Assign all permissions to super admin role
INSERT INTO role_permissions (role_id, permission_id, created_by)
SELECT 
    (SELECT id FROM roles WHERE slug = 'super_admin' AND organization_id = (SELECT id FROM organizations WHERE slug = 'default')),
    id,
    (SELECT id FROM users WHERE email = 'admin@default.com')
FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert default department
INSERT INTO departments (id, organization_id, name, code, description, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000017',
    (SELECT id FROM organizations WHERE slug = 'default'),
    'IT Department',
    'IT',
    'Information Technology Department',
    true
) ON CONFLICT (organization_id, code) DO NOTHING;

-- Insert default location
INSERT INTO locations (id, organization_id, name, code, type, address, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000018',
    (SELECT id FROM organizations WHERE slug = 'default'),
    'Main Office',
    'MAIN',
    'building',
    '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94105"}'::jsonb,
    true
) ON CONFLICT (organization_id, code) DO NOTHING;

-- Insert default asset category
INSERT INTO asset_categories (id, organization_id, name, code, description, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000019',
    (SELECT id FROM organizations WHERE slug = 'default'),
    'Computers',
    'COMPUTERS',
    'Computer equipment',
    true
) ON CONFLICT (organization_id, code) DO NOTHING;

-- Insert default bookable resource
INSERT INTO bookable_resources (id, organization_id, location_id, name, code, type, description, capacity, is_active)
VALUES (
    '00000000-0000-0000-0000-00000000001a',
    (SELECT id FROM organizations WHERE slug = 'default'),
    (SELECT id FROM locations WHERE code = 'MAIN'),
    'Conference Room A',
    'CONF-A',
    'room',
    'Main conference room',
    20,
    true
) ON CONFLICT (organization_id, code) DO NOTHING;

-- Insert default settings
INSERT INTO settings (organization_id, key, value, value_type, description, is_public)
VALUES 
    (NULL, 'app.name', 'AssetFlow', 'string', 'Application name', true),
    (NULL, 'app.version', '1.0.0', 'string', 'Application version', true),
    (NULL, 'app.support_email', 'support@assetflow.com', 'string', 'Support email address', true),
    (NULL, 'session.timeout_minutes', '60', 'number', 'Session timeout in minutes', false),
    (NULL, 'password.min_length', '8', 'number', 'Minimum password length', false),
    (NULL, 'password.require_special_char', 'true', 'boolean', 'Require special character in password', false),
    (NULL, 'password.require_number', 'true', 'boolean', 'Require number in password', false),
    (NULL, 'password.require_uppercase', 'true', 'boolean', 'Require uppercase in password', false),
    (NULL, 'maintenance.retention_days', '365', 'number', 'Maintenance log retention days', false),
    (NULL, 'audit.retention_days', '1825', 'number', 'Audit log retention days (5 years)', false)
ON CONFLICT (organization_id, key) DO NOTHING;

-- Insert default feature flags
INSERT INTO feature_flags (organization_id, feature_name, is_enabled, description, rollout_percentage)
VALUES 
    (NULL, 'dark_mode', true, 'Enable dark mode UI', 100),
    (NULL, 'advanced_analytics', true, 'Enable advanced analytics features', 100),
    (NULL, 'mobile_app', false, 'Enable mobile application', 0),
    (NULL, 'api_v2', false, 'Enable API v2 endpoints', 0),
    (NULL, 'real_time_notifications', true, 'Enable real-time notifications', 100)
ON CONFLICT (organization_id, feature_name) DO NOTHING;

-- Insert sample notification templates
INSERT INTO notification_templates (id, organization_id, type, name, slug, subject_template, body_template, is_active)
VALUES 
    ('00000000-0000-0000-0000-00000000001b', (SELECT id FROM organizations WHERE slug = 'default'), 'allocation', 'Asset Allocated', 'asset_allocated', 'Asset Allocated: {{asset_name}}', 'You have been allocated the asset {{asset_name}}. Please return it by {{return_date}}.', true),
    ('00000000-0000-0000-0000-00000000001c', (SELECT id FROM organizations WHERE slug = 'default'), 'maintenance', 'Maintenance Due', 'maintenance_due', 'Maintenance Due: {{asset_name}}', 'The asset {{asset_name}} is due for maintenance on {{due_date}}.', true),
    ('00000000-0000-0000-0000-00000000001d', (SELECT id FROM organizations WHERE slug = 'default'), 'audit', 'Audit Assignment', 'audit_assignment', 'Audit Assignment', 'You have been assigned to audit {{location_name}} for cycle {{audit_cycle_name}}.', true)
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Insert sample dashboard widgets
INSERT INTO dashboard_widgets (id, organization_id, name, slug, widget_type, description, config, is_active, is_system)
VALUES 
    ('00000000-0000-0000-0000-00000000001e', (SELECT id FROM organizations WHERE slug = 'default'), 'Asset Overview', 'asset_overview', 'metric', 'Overview of asset inventory', '{"metric": "total_assets", "label": "Total Assets"}'::jsonb, true, true),
    ('00000000-0000-0000-0000-00000000001f', (SELECT id FROM organizations WHERE slug = 'default'), 'Active Allocations', 'active_allocations', 'metric', 'Currently allocated assets', '{"metric": "active_allocations", "label": "Active Allocations"}'::jsonb, true, true),
    ('00000000-0000-0000-0000-000000000020', (SELECT id FROM organizations WHERE slug = 'default'), 'Pending Maintenance', 'pending_maintenance', 'list', 'Assets requiring maintenance', '{"limit": 5}'::jsonb, true, true)
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Insert sample report
INSERT INTO reports (id, organization_id, name, slug, report_type, query_config, is_public, is_system)
VALUES 
    ('00000000-0000-0000-0000-000000000021', (SELECT id FROM organizations WHERE slug = 'default'), 'Asset Inventory Report', 'asset_inventory', 'asset_inventory', '{"columns": ["asset_tag", "name", "category", "location", "status"]}'::jsonb, true, true)
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Commit the transaction
COMMIT;
