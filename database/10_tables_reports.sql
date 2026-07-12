-- AssetFlow Database Schema
-- Reports Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    report_type report_type NOT NULL,
    query_config JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT uq_reports_org_slug UNIQUE (organization_id, slug)
);

-- report_schedules
CREATE TABLE report_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    schedule_type schedule_type NOT NULL,
    interval_value INTEGER,
    day_of_week INTEGER,
    day_of_month INTEGER,
    time TIME NOT NULL DEFAULT '00:00',
    next_run_at TIMESTAMP NOT NULL,
    last_run_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    recipients JSONB,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_report_schedules_day_of_week CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
    CONSTRAINT chk_report_schedules_day_of_month CHECK (day_of_month IS NULL OR (day_of_month >= 1 AND day_of_month <= 31)),
    CONSTRAINT chk_report_schedules_interval_positive CHECK (interval_value IS NULL OR interval_value > 0)
);

-- report_subscriptions
CREATE TABLE report_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delivery_method notification_channel NOT NULL DEFAULT 'email',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_report_subscriptions UNIQUE (report_id, user_id)
);
