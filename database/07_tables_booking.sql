-- AssetFlow Database Schema
-- Resource Booking Tables
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- bookable_resources
CREATE TABLE bookable_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type resource_type NOT NULL DEFAULT 'room',
    description TEXT,
    capacity INTEGER,
    facilities JSONB,
    specifications JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    advance_booking_days INTEGER NOT NULL DEFAULT 30,
    min_booking_duration_minutes INTEGER NOT NULL DEFAULT 15,
    max_booking_duration_minutes INTEGER NOT NULL DEFAULT 480,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT chk_bookable_resources_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT chk_bookable_resources_advance_positive CHECK (advance_booking_days > 0),
    CONSTRAINT chk_bookable_resources_min_duration_positive CHECK (min_booking_duration_minutes > 0),
    CONSTRAINT chk_bookable_resources_max_duration_positive CHECK (max_booking_duration_minutes > 0),
    CONSTRAINT chk_bookable_resources_duration_order CHECK (max_booking_duration_minutes >= min_booking_duration_minutes),
    CONSTRAINT uq_bookable_resources_org_code UNIQUE (organization_id, code)
);

-- bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES bookable_resources(id) ON DELETE CASCADE,
    booked_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    all_day BOOLEAN NOT NULL DEFAULT FALSE,
    status booking_status NOT NULL DEFAULT 'confirmed',
    recurrence_rule TEXT,
    recurrence_end_date DATE,
    attendee_count INTEGER NOT NULL DEFAULT 0,
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id) ON DELETE SET NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT chk_bookings_end_after_start CHECK (end_datetime >= start_datetime),
    CONSTRAINT chk_bookings_attendee_count_non_negative CHECK (attendee_count >= 0)
);

-- booking_history
CREATE TABLE booking_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    action action_type NOT NULL,
    from_status booking_status,
    to_status booking_status NOT NULL,
    changes JSONB,
    performed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- booking_attendees
CREATE TABLE booking_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    email VARCHAR(255),
    status attendee_status NOT NULL DEFAULT 'invited',
    response_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_booking_attendee_identifier CHECK (user_id IS NOT NULL OR employee_id IS NOT NULL OR email IS NOT NULL),
    CONSTRAINT uq_booking_attendees_user UNIQUE (booking_id, user_id),
    CONSTRAINT uq_booking_attendees_employee UNIQUE (booking_id, employee_id),
    CONSTRAINT uq_booking_attendees_email UNIQUE (booking_id, email)
);

-- resource_availability
CREATE TABLE resource_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES bookable_resources(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_resource_availability_end_after_start CHECK (end_time >= start_time),
    CONSTRAINT chk_resource_availability_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6),
    CONSTRAINT uq_resource_availability UNIQUE (resource_id, day_of_week, start_time)
);

-- booking_blackouts
CREATE TABLE booking_blackouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES bookable_resources(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    reason TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_booking_blackouts_end_after_start CHECK (end_datetime >= start_datetime)
);
