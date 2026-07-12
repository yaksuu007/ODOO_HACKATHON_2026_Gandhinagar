-- AssetFlow Database Schema
-- Audit Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- audit_cycles
CREATE TABLE audit_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    checklist_id UUID REFERENCES audit_checklists(id) ON DELETE SET NULL,
    lead_auditor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    status audit_status NOT NULL DEFAULT 'planned',
    total_assets INTEGER NOT NULL DEFAULT 0,
    audited_assets INTEGER NOT NULL DEFAULT 0,
    discrepancy_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT chk_audit_cycles_end_after_start CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_audit_cycles_planned_end_after_start CHECK (planned_end_date >= planned_start_date),
    CONSTRAINT chk_audit_cycles_total_non_negative CHECK (total_assets >= 0),
    CONSTRAINT chk_audit_cycles_audited_non_negative CHECK (audited_assets >= 0),
    CONSTRAINT chk_audit_cycles_audited_not_exceed_total CHECK (audited_assets <= total_assets),
    CONSTRAINT chk_audit_cycles_discrepancy_non_negative CHECK (discrepancy_count >= 0),
    CONSTRAINT uq_audit_cycles_org_code UNIQUE (organization_id, code)
);

-- audit_assignments
CREATE TABLE audit_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_cycle_id UUID NOT NULL REFERENCES audit_cycles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL,
    asset_count INTEGER NOT NULL DEFAULT 0,
    completed_count INTEGER NOT NULL DEFAULT 0,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_audit_assignments_asset_count_non_negative CHECK (asset_count >= 0),
    CONSTRAINT chk_audit_assignments_completed_non_negative CHECK (completed_count >= 0),
    CONSTRAINT chk_audit_assignments_completed_not_exceed CHECK (completed_count <= asset_count),
    CONSTRAINT uq_audit_assignments UNIQUE (audit_cycle_id, user_id)
);

-- audit_items
CREATE TABLE audit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_cycle_id UUID NOT NULL REFERENCES audit_cycles(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    assigned_auditor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    expected_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    actual_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    status audit_item_status NOT NULL DEFAULT 'pending',
    audited_at TIMESTAMP,
    audited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    has_discrepancy BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_audit_items UNIQUE (audit_cycle_id, asset_id)
);

-- audit_discrepancies
CREATE TABLE audit_discrepancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_item_id UUID NOT NULL REFERENCES audit_items(id) ON DELETE CASCADE,
    discrepancy_type discrepancy_type NOT NULL,
    description TEXT NOT NULL,
    severity discrepancy_severity NOT NULL DEFAULT 'medium',
    resolution_status resolution_status NOT NULL DEFAULT 'open',
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- audit_history
CREATE TABLE audit_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_cycle_id UUID NOT NULL REFERENCES audit_cycles(id) ON DELETE CASCADE,
    action action_type NOT NULL,
    from_status audit_status,
    to_status audit_status NOT NULL,
    changes JSONB,
    performed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- audit_checklists
CREATE TABLE audit_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES asset_categories(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_audit_checklists_org_code UNIQUE (organization_id, code)
);

-- audit_checklist_items
CREATE TABLE audit_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID NOT NULL REFERENCES audit_checklists(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL,
    item_type VARCHAR(50) NOT NULL DEFAULT 'checkbox',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_audit_checklist_items_order_non_negative CHECK (order_index >= 0)
);
