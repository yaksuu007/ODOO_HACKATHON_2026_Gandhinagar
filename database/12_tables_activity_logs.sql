-- AssetFlow Database Schema
-- Activity Logs Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- activity_logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action action_type NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- activity_log_details
CREATE TABLE activity_log_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
    detail_key VARCHAR(255) NOT NULL,
    detail_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
