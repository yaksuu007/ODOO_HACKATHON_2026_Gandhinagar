-- AssetFlow Database Schema
-- Asset Management Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES asset_categories(id) ON DELETE RESTRICT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    asset_tag VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    purchase_order VARCHAR(100),
    supplier VARCHAR(255),
    current_value DECIMAL(15,2),
    status asset_status NOT NULL DEFAULT 'available',
    condition asset_condition,
    ownership_type ownership_type NOT NULL DEFAULT 'owned',
    assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
    assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    expected_return_date DATE,
    warranty_expiry DATE,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    qr_code VARCHAR(255),
    barcode VARCHAR(100),
    is_bookable BOOLEAN NOT NULL DEFAULT FALSE,
    is_maintainable BOOLEAN NOT NULL DEFAULT TRUE,
    is_auditable BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    custom_fields JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_assets_purchase_cost_positive CHECK (purchase_cost IS NULL OR purchase_cost >= 0),
    CONSTRAINT chk_assets_current_value_positive CHECK (current_value IS NULL OR current_value >= 0),
    CONSTRAINT chk_assets_expected_return_after_allocation CHECK (expected_return_date IS NULL OR expected_return_date >= allocation_date),
    CONSTRAINT chk_assets_warranty_after_purchase CHECK (warranty_expiry IS NULL OR warranty_expiry >= purchase_date),
    CONSTRAINT chk_assets_next_maintenance_after_last CHECK (next_maintenance_date IS NULL OR last_maintenance_date IS NULL OR next_maintenance_date >= last_maintenance_date),
    CONSTRAINT uq_assets_org_tag UNIQUE (organization_id, asset_tag),
    CONSTRAINT uq_assets_org_serial UNIQUE (organization_id, serial_number),
    CONSTRAINT uq_assets_org_qr UNIQUE (organization_id, qr_code),
    CONSTRAINT uq_assets_org_barcode UNIQUE (organization_id, barcode)
);

-- asset_status_history
CREATE TABLE asset_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    from_status asset_status,
    to_status asset_status NOT NULL,
    reason TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    related_allocation_id UUID REFERENCES allocations(id) ON DELETE SET NULL,
    related_maintenance_id UUID REFERENCES maintenance_requests(id) ON DELETE SET NULL
);

-- asset_photos
CREATE TABLE asset_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    caption VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    file_size INTEGER,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_asset_photos_file_size_positive CHECK (file_size IS NULL OR file_size > 0)
);

-- asset_documents
CREATE TABLE asset_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    document_type document_type,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_asset_documents_file_size_positive CHECK (file_size IS NULL OR file_size > 0)
);

-- asset_qr_codes
CREATE TABLE asset_qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    qr_code VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    scan_count INTEGER NOT NULL DEFAULT 0,
    last_scanned_at TIMESTAMP,
    CONSTRAINT chk_asset_qr_codes_scan_count_non_negative CHECK (scan_count >= 0),
    CONSTRAINT uq_asset_qr_codes_asset UNIQUE (asset_id),
    CONSTRAINT uq_asset_qr_codes_qr UNIQUE (qr_code)
);

-- asset_specifications
CREATE TABLE asset_specifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    specifications JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uq_asset_specifications_asset UNIQUE (asset_id)
);

-- asset_warranties
CREATE TABLE asset_warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    provider VARCHAR(255) NOT NULL,
    warranty_number VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    coverage_details TEXT,
    contact_info JSONB,
    document_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_asset_warranties_end_after_start CHECK (end_date >= start_date)
);

-- asset_depreciation
CREATE TABLE asset_depreciation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    method depreciation_method NOT NULL DEFAULT 'straight_line',
    useful_life_years INTEGER NOT NULL DEFAULT 5,
    salvage_value DECIMAL(15,2),
    annual_depreciation DECIMAL(15,2),
    accumulated_depreciation DECIMAL(15,2) NOT NULL DEFAULT 0,
    book_value DECIMAL(15,2),
    last_calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_asset_depreciation_useful_life_positive CHECK (useful_life_years > 0),
    CONSTRAINT chk_asset_depreciation_salvage_non_negative CHECK (salvage_value IS NULL OR salvage_value >= 0),
    CONSTRAINT chk_asset_depreciation_accumulated_non_negative CHECK (accumulated_depreciation >= 0),
    CONSTRAINT uq_asset_depreciation_asset UNIQUE (asset_id)
);
