-- AssetFlow Database Schema
-- Organization Setup Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    budget DECIMAL(15,2),
    employee_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    level INTEGER NOT NULL DEFAULT 0,
    path VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_departments_employee_count_non_negative CHECK (employee_count >= 0),
    CONSTRAINT chk_departments_level_non_negative CHECK (level >= 0),
    CONSTRAINT chk_departments_budget_positive CHECK (budget IS NULL OR budget >= 0),
    CONSTRAINT uq_departments_org_code UNIQUE (organization_id, code)
);

-- employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    employee_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    job_title VARCHAR(100),
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    hire_date DATE NOT NULL,
    termination_date DATE,
    employment_status employment_status NOT NULL DEFAULT 'active',
    avatar_url VARCHAR(500),
    address JSONB,
    emergency_contact JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_employees_termination_after_hire CHECK (termination_date IS NULL OR termination_date >= hire_date),
    CONSTRAINT uq_employees_org_number UNIQUE (organization_id, employee_number),
    CONSTRAINT uq_employees_org_email UNIQUE (organization_id, email)
);

-- asset_categories
CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES asset_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    depreciation_method depreciation_method,
    depreciation_rate DECIMAL(5,2),
    useful_life_years INTEGER,
    requires_maintenance BOOLEAN NOT NULL DEFAULT TRUE,
    maintenance_interval_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    level INTEGER NOT NULL DEFAULT 0,
    path VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_asset_categories_depreciation_rate CHECK (depreciation_rate IS NULL OR (depreciation_rate >= 0 AND depreciation_rate <= 100)),
    CONSTRAINT chk_asset_categories_useful_life_positive CHECK (useful_life_years IS NULL OR useful_life_years > 0),
    CONSTRAINT chk_asset_categories_maintenance_interval_positive CHECK (maintenance_interval_days IS NULL OR maintenance_interval_days > 0),
    CONSTRAINT uq_asset_categories_org_code UNIQUE (organization_id, code)
);

-- locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type location_type NOT NULL DEFAULT 'building',
    address JSONB,
    coordinates JSONB,
    floor VARCHAR(50),
    room VARCHAR(50),
    capacity INTEGER,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    level INTEGER NOT NULL DEFAULT 0,
    path VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_locations_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT chk_locations_level_non_negative CHECK (level >= 0),
    CONSTRAINT uq_locations_org_code UNIQUE (organization_id, code)
);

-- location_hierarchy (closure table for hierarchy queries)
CREATE TABLE location_hierarchy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ancestor_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    descendant_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    depth INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_location_hierarchy UNIQUE (ancestor_id, descendant_id)
);
