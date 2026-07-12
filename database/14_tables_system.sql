-- AssetFlow Database Schema
-- System Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- settings
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    value_type setting_value_type NOT NULL DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_settings_org_key UNIQUE (organization_id, key),
    CONSTRAINT uq_settings_global_key UNIQUE (key) WHERE organization_id IS NULL
);

-- feature_flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    rollout_percentage INTEGER NOT NULL DEFAULT 0,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_feature_flags_rollout CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    CONSTRAINT uq_feature_flags_org_name UNIQUE (organization_id, feature_name),
    CONSTRAINT uq_feature_flags_global_name UNIQUE (feature_name) WHERE organization_id IS NULL
);

-- system_logs
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level log_level NOT NULL,
    service VARCHAR(100),
    message TEXT NOT NULL,
    context JSONB,
    trace_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
