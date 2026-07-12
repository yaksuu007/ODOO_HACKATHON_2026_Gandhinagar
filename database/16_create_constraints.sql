-- AssetFlow Database Schema
-- Additional Constraints (Exclusion & Composite)
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- Exclusion Constraints

-- Resource Booking - Prevent Overlapping Bookings
ALTER TABLE bookings ADD CONSTRAINT ex_booking_overlap
EXCLUDE USING GIST (
    resource_id WITH =,
    tsrange(start_datetime, end_datetime) WITH &&
) WHERE (deleted_at IS NULL AND status NOT IN ('cancelled', 'no_show'));

-- Asset Allocation - Prevent Double Active Allocation
ALTER TABLE allocations ADD CONSTRAINT ex_allocation_double_active
EXCLUDE USING GIST (
    asset_id WITH =,
    daterange(allocation_date, COALESCE(actual_return_date, expected_return_date, 'infinity'::date)) WITH &&
) WHERE (status = 'active' AND deleted_at IS NULL);

-- Composite Constraints (Additional Check Constraints)

-- Ensure at least one allocation target is specified
ALTER TABLE allocations ADD CONSTRAINT chk_allocation_target_specified
CHECK (
    (allocated_to_type = 'employee' AND allocated_to_employee_id IS NOT NULL) OR
    (allocated_to_type = 'department' AND allocated_to_department_id IS NOT NULL) OR
    (allocated_to_type = 'project' AND (allocated_to_employee_id IS NOT NULL OR allocated_to_department_id IS NOT NULL)) OR
    (allocated_to_type = 'vendor' AND allocated_to_employee_id IS NOT NULL)
);

-- Ensure at least one transfer target is specified
ALTER TABLE transfers ADD CONSTRAINT chk_transfer_target_specified
CHECK (
    (from_employee_id IS NOT NULL OR from_department_id IS NOT NULL) AND
    (to_employee_id IS NOT NULL OR to_department_id IS NOT NULL)
);

-- Ensure booking attendee has at least one identifier
ALTER TABLE booking_attendees ADD CONSTRAINT chk_booking_attendee_identifier
CHECK (user_id IS NOT NULL OR employee_id IS NOT NULL OR email IS NOT NULL);
