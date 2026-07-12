-- AssetFlow Database Schema
-- Maintenance Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- maintenance_requests
CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    request_number VARCHAR(50) NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    type maintenance_type NOT NULL,
    priority maintenance_priority NOT NULL DEFAULT 'normal',
    status maintenance_status NOT NULL DEFAULT 'pending',
    requested_date TIMESTAMP NOT NULL DEFAULT NOW(),
    target_completion_date DATE,
    actual_completion_date TIMESTAMP,
    description TEXT NOT NULL,
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_maintenance_requests_target_after_requested CHECK (target_completion_date IS NULL OR target_completion_date >= requested_date),
    CONSTRAINT chk_maintenance_requests_actual_after_target CHECK (actual_completion_date IS NULL OR target_completion_date IS NULL OR actual_completion_date >= target_completion_date),
    CONSTRAINT chk_maintenance_requests_estimated_cost_non_negative CHECK (estimated_cost IS NULL OR estimated_cost >= 0),
    CONSTRAINT chk_maintenance_requests_actual_cost_non_negative CHECK (actual_cost IS NULL OR actual_cost >= 0),
    CONSTRAINT uq_maintenance_requests_org_number UNIQUE (organization_id, request_number)
);

-- maintenance_activities
CREATE TABLE maintenance_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    activity_type maintenance_activity_type NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    cost DECIMAL(15,2),
    performed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_maintenance_activities_duration_non_negative CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
    CONSTRAINT chk_maintenance_activities_cost_non_negative CHECK (cost IS NULL OR cost >= 0)
);

-- maintenance_technicians
CREATE TABLE maintenance_technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    rating DECIMAL(3,2),
    contract_start DATE,
    contract_end DATE,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT chk_vendors_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    CONSTRAINT chk_vendors_contract_dates CHECK (contract_end IS NULL OR contract_start IS NULL OR contract_end >= contract_start),
    CONSTRAINT uq_vendors_org_code UNIQUE (organization_id, code)
);

-- maintenance_schedules
CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type maintenance_type NOT NULL,
    schedule_type schedule_type NOT NULL,
    interval_value INTEGER,
    start_date DATE NOT NULL,
    end_date DATE,
    next_due_date DATE NOT NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT chk_maintenance_schedules_end_after_start CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_maintenance_schedules_next_due_after_start CHECK (next_due_date >= start_date)
);

-- maintenance_approvals
CREATE TABLE maintenance_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approval_level INTEGER NOT NULL DEFAULT 1,
    status approval_status NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_maintenance_approvals UNIQUE (maintenance_request_id, approver_id)
);

-- maintenance_costs
CREATE TABLE maintenance_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    cost_type cost_type NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    incurred_at DATE NOT NULL,
    invoice_number VARCHAR(100),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_maintenance_costs_amount_non_negative CHECK (amount >= 0)
);
