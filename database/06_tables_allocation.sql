-- AssetFlow Database Schema
-- Asset Allocation Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- allocations
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    allocated_to_type allocation_target_type NOT NULL DEFAULT 'employee',
    allocated_to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    allocated_to_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    allocated_by UUID NOT NULL REFERENCES users(id),
    allocation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    actual_return_date DATE,
    return_condition asset_condition,
    return_notes TEXT,
    purpose TEXT,
    status allocation_status NOT NULL DEFAULT 'active',
    is_transfer BOOLEAN NOT NULL DEFAULT FALSE,
    transfer_from_allocation_id UUID REFERENCES allocations(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_allocations_return_after_allocation CHECK (actual_return_date IS NULL OR actual_return_date >= allocation_date),
    CONSTRAINT chk_allocations_expected_after_allocation CHECK (expected_return_date IS NULL OR expected_return_date >= allocation_date),
    CONSTRAINT chk_allocation_target_specified CHECK (
        (allocated_to_type = 'employee' AND allocated_to_employee_id IS NOT NULL) OR
        (allocated_to_type = 'department' AND allocated_to_department_id IS NOT NULL) OR
        (allocated_to_type = 'project' AND (allocated_to_employee_id IS NOT NULL OR allocated_to_department_id IS NOT NULL)) OR
        (allocated_to_type = 'vendor' AND allocated_to_employee_id IS NOT NULL)
    )
);

-- allocation_history
CREATE TABLE allocation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    allocation_id UUID NOT NULL REFERENCES allocations(id) ON DELETE CASCADE,
    action action_type NOT NULL,
    from_status allocation_status,
    to_status allocation_status NOT NULL,
    changes JSONB,
    performed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- transfers
CREATE TABLE transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    from_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    from_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    to_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reason TEXT,
    priority transfer_priority NOT NULL DEFAULT 'normal',
    expected_date DATE,
    status transfer_status NOT NULL DEFAULT 'pending',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    completed_at TIMESTAMP,
    completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_transfers_expected_after_requested CHECK (expected_date IS NULL OR expected_date >= requested_at),
    CONSTRAINT chk_transfer_target_specified CHECK (
        (from_employee_id IS NOT NULL OR from_department_id IS NOT NULL) AND
        (to_employee_id IS NOT NULL OR to_department_id IS NOT NULL)
    )
);

-- transfer_approvals
CREATE TABLE transfer_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_id UUID NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approval_level INTEGER NOT NULL DEFAULT 1,
    status approval_status NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_transfer_approvals UNIQUE (transfer_id, approver_id)
);

-- allocation_conflicts
CREATE TABLE allocation_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    existing_allocation_id UUID NOT NULL REFERENCES allocations(id) ON DELETE CASCADE,
    conflicting_allocation_id UUID REFERENCES allocations(id) ON DELETE SET NULL,
    conflict_type conflict_type NOT NULL,
    detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    status approval_status NOT NULL DEFAULT 'pending'
);
