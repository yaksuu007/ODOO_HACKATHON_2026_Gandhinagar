-- AssetFlow Database Schema
-- Performance Indexes
-- PostgreSQL 15+

SET search_path TO assetflow, public;

-- Authentication & RBAC Indexes
CREATE INDEX idx_organizations_slug ON organizations(slug) WHERE is_active = TRUE;
CREATE INDEX idx_organizations_domain ON organizations(domain) WHERE domain IS NOT NULL;
CREATE INDEX idx_organizations_subscription_status ON organizations(subscription_status, subscription_end);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_organization_id ON users(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_is_active ON users(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_employee_id ON users(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_users_department_id ON users(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX idx_users_last_login_at ON users(last_login_at DESC);

CREATE INDEX idx_roles_slug ON roles(organization_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_level ON roles(organization_id, level) WHERE deleted_at IS NULL;

CREATE INDEX idx_permissions_module ON permissions(module, action);
CREATE INDEX idx_permissions_slug ON permissions(slug);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id) WHERE is_active = TRUE;
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at) WHERE is_active = TRUE;

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at) WHERE used_at IS NULL;

-- Organization Setup Indexes
CREATE INDEX idx_departments_code ON departments(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_parent_id ON departments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_departments_is_active ON departments(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_manager_id ON departments(manager_id) WHERE manager_id IS NOT NULL;

CREATE INDEX idx_employees_employee_number ON employees(organization_id, employee_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_email ON employees(organization_id, email) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_department_id ON employees(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_manager_id ON employees(manager_id) WHERE manager_id IS NOT NULL;
CREATE INDEX idx_employees_location_id ON employees(location_id) WHERE location_id IS NOT NULL;
CREATE INDEX idx_employees_employment_status ON employees(organization_id, employment_status) WHERE deleted_at IS NULL;

CREATE INDEX idx_asset_categories_code ON asset_categories(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_asset_categories_parent_id ON asset_categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_asset_categories_is_active ON asset_categories(organization_id, is_active) WHERE deleted_at IS NULL;

CREATE INDEX idx_locations_code ON locations(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_parent_id ON locations(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_locations_type ON locations(organization_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_manager_id ON locations(manager_id) WHERE manager_id IS NOT NULL;

CREATE INDEX idx_location_hierarchy_ancestor_id ON location_hierarchy(ancestor_id);
CREATE INDEX idx_location_hierarchy_descendant_id ON location_hierarchy(descendant_id);
CREATE INDEX idx_location_hierarchy_depth ON location_hierarchy(depth);

-- Asset Management Indexes
CREATE INDEX idx_assets_asset_tag ON assets(organization_id, asset_tag) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_serial_number ON assets(organization_id, serial_number) WHERE serial_number IS NOT NULL;
CREATE INDEX idx_assets_category_id ON assets(organization_id, category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_location_id ON assets(organization_id, location_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_status ON assets(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_assigned_to ON assets(organization_id, assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_assets_assigned_department_id ON assets(organization_id, assigned_department_id) WHERE assigned_to_department_id IS NOT NULL;
CREATE INDEX idx_assets_is_bookable ON assets(organization_id, is_bookable) WHERE is_bookable = TRUE;
CREATE INDEX idx_assets_qr_code ON assets(organization_id, qr_code) WHERE qr_code IS NOT NULL;
CREATE INDEX idx_assets_barcode ON assets(organization_id, barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_assets_purchase_date ON assets(organization_id, purchase_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_warranty_expiry ON assets(warranty_expiry) WHERE warranty_expiry IS NOT NULL;
CREATE INDEX idx_assets_next_maintenance_date ON assets(next_maintenance_date) WHERE next_maintenance_date IS NOT NULL;

CREATE INDEX idx_asset_status_history_asset_id ON asset_status_history(asset_id, changed_at DESC);
CREATE INDEX idx_asset_status_history_to_status ON asset_status_history(to_status, changed_at DESC);

CREATE INDEX idx_asset_photos_asset_id ON asset_photos(asset_id);
CREATE INDEX idx_asset_photos_is_primary ON asset_photos(asset_id) WHERE is_primary = TRUE;

CREATE INDEX idx_asset_documents_asset_id ON asset_documents(asset_id);
CREATE INDEX idx_asset_documents_document_type ON asset_documents(document_type);

CREATE INDEX idx_asset_qr_codes_qr_code ON asset_qr_codes(qr_code) WHERE is_active = TRUE;
CREATE INDEX idx_asset_qr_codes_asset_id ON asset_qr_codes(asset_id) WHERE is_active = TRUE;

CREATE INDEX idx_asset_specifications_asset_id ON asset_specifications(asset_id);

CREATE INDEX idx_asset_warranties_asset_id ON asset_warranties(asset_id);
CREATE INDEX idx_asset_warranties_is_active ON asset_warranties(asset_id) WHERE is_active = TRUE;
CREATE INDEX idx_asset_warranties_end_date ON asset_warranties(end_date) WHERE is_active = TRUE;

CREATE INDEX idx_asset_depreciation_asset_id ON asset_depreciation(asset_id);
CREATE INDEX idx_asset_depreciation_last_calculated_at ON asset_depreciation(last_calculated_at);

-- Asset Allocation Indexes
CREATE INDEX idx_allocations_organization_id ON allocations(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_allocations_asset_id ON allocations(asset_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_allocations_allocated_to_employee_id ON allocations(allocated_to_employee_id) WHERE allocated_to_employee_id IS NOT NULL;
CREATE INDEX idx_allocations_allocated_to_department_id ON allocations(allocated_to_department_id) WHERE allocated_to_department_id IS NOT NULL;
CREATE INDEX idx_allocations_status ON allocations(organization_id, status) WHERE status = 'active';
CREATE UNIQUE INDEX uq_allocations_asset_active ON allocations(asset_id) WHERE status = 'active';
CREATE INDEX idx_allocations_expected_return_date ON allocations(expected_return_date) WHERE status = 'active';
CREATE INDEX idx_allocations_overdue ON allocations(expected_return_date, status) WHERE status = 'active';

CREATE INDEX idx_allocation_history_allocation_id ON allocation_history(allocation_id, performed_at DESC);

CREATE INDEX idx_transfers_organization_id ON transfers(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transfers_asset_id ON transfers(asset_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transfers_from_employee_id ON transfers(from_employee_id) WHERE from_employee_id IS NOT NULL;
CREATE INDEX idx_transfers_to_employee_id ON transfers(to_employee_id) WHERE to_employee_id IS NOT NULL;
CREATE INDEX idx_transfers_status ON transfers(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_transfers_priority ON transfers(organization_id, priority, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_transfers_requested_by ON transfers(requested_by) WHERE deleted_at IS NULL;

CREATE INDEX idx_transfer_approvals_transfer_id ON transfer_approvals(transfer_id);
CREATE INDEX idx_transfer_approvals_approver_id ON transfer_approvals(approver_id);
CREATE INDEX idx_transfer_approvals_status ON transfer_approvals(status);

CREATE INDEX idx_allocation_conflicts_asset_id ON allocation_conflicts(asset_id);
CREATE INDEX idx_allocation_conflicts_status ON allocation_conflicts(status) WHERE status = 'unresolved';

-- Resource Booking Indexes
CREATE INDEX idx_bookable_resources_code ON bookable_resources(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookable_resources_location_id ON bookable_resources(location_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookable_resources_type ON bookable_resources(organization_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookable_resources_is_active ON bookable_resources(organization_id, is_active) WHERE deleted_at IS NULL;

CREATE INDEX idx_bookings_organization_id ON bookings(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_resource_id ON bookings(resource_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_booked_by ON bookings(booked_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_resource_time ON bookings(resource_id, start_datetime, end_datetime) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_status ON bookings(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookings_start_datetime ON bookings(start_datetime) WHERE status = 'confirmed';
CREATE INDEX idx_bookings_checked_in_at ON bookings(checked_in_at) WHERE checked_in_at IS NOT NULL;

CREATE INDEX idx_booking_history_booking_id ON booking_history(booking_id, performed_at DESC);

CREATE INDEX idx_booking_attendees_booking_id ON booking_attendees(booking_id);
CREATE INDEX idx_booking_attendees_user_id ON booking_attendees(user_id);
CREATE INDEX idx_booking_attendees_employee_id ON booking_attendees(employee_id);
CREATE INDEX idx_booking_attendees_email ON booking_attendees(email);
CREATE INDEX idx_booking_attendees_status ON booking_attendees(status);

CREATE INDEX idx_resource_availability_resource_id ON resource_availability(resource_id);
CREATE INDEX idx_resource_availability_day_of_week ON resource_availability(day_of_week, is_available);

CREATE INDEX idx_booking_blackouts_resource_id ON booking_blackouts(resource_id);
CREATE INDEX idx_booking_blackouts_time ON booking_blackouts(resource_id, start_datetime, end_datetime);

-- Maintenance Indexes
CREATE INDEX idx_maintenance_requests_request_number ON maintenance_requests(organization_id, request_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_organization_id ON maintenance_requests(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_asset_id ON maintenance_requests(asset_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_assigned_to ON maintenance_requests(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_maintenance_requests_requested_by ON maintenance_requests(requested_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_priority ON maintenance_requests(organization_id, priority, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_type ON maintenance_requests(organization_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_requests_target_completion_date ON maintenance_requests(target_completion_date) WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_maintenance_requests_vendor_id ON maintenance_requests(vendor_id) WHERE vendor_id IS NOT NULL;

CREATE INDEX idx_maintenance_activities_maintenance_request_id ON maintenance_activities(maintenance_request_id, performed_at DESC);
CREATE INDEX idx_maintenance_activities_activity_type ON maintenance_activities(activity_type);

CREATE INDEX idx_maintenance_technicians_maintenance_request_id ON maintenance_technicians(maintenance_request_id);
CREATE INDEX idx_maintenance_technicians_user_id ON maintenance_technicians(user_id);
CREATE INDEX idx_maintenance_technicians_is_primary ON maintenance_technicians(maintenance_request_id) WHERE is_primary = TRUE;

CREATE INDEX idx_vendors_code ON vendors(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_is_active ON vendors(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_rating ON vendors(rating) WHERE rating IS NOT NULL;

CREATE INDEX idx_maintenance_schedules_organization_id ON maintenance_schedules(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_schedules_asset_id ON maintenance_schedules(asset_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_schedules_is_active ON maintenance_schedules(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_maintenance_schedules_next_due_date ON maintenance_schedules(next_due_date) WHERE is_active = TRUE;
CREATE INDEX idx_maintenance_schedules_assigned_to ON maintenance_schedules(assigned_to) WHERE assigned_to IS NOT NULL;

CREATE INDEX idx_maintenance_approvals_maintenance_request_id ON maintenance_approvals(maintenance_request_id);
CREATE INDEX idx_maintenance_approvals_approver_id ON maintenance_approvals(approver_id);
CREATE INDEX idx_maintenance_approvals_status ON maintenance_approvals(status);

CREATE INDEX idx_maintenance_costs_maintenance_request_id ON maintenance_costs(maintenance_request_id);
CREATE INDEX idx_maintenance_costs_cost_type ON maintenance_costs(cost_type);
CREATE INDEX idx_maintenance_costs_vendor_id ON maintenance_costs(vendor_id) WHERE vendor_id IS NOT NULL;
CREATE INDEX idx_maintenance_costs_incurred_at ON maintenance_costs(incurred_at);

-- Audit Indexes
CREATE INDEX idx_audit_cycles_code ON audit_cycles(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_cycles_organization_id ON audit_cycles(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_cycles_status ON audit_cycles(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_cycles_dates ON audit_cycles(organization_id, start_date, end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_cycles_lead_auditor_id ON audit_cycles(lead_auditor_id) WHERE lead_auditor_id IS NOT NULL;
CREATE INDEX idx_audit_cycles_checklist_id ON audit_cycles(checklist_id) WHERE checklist_id IS NOT NULL;

CREATE INDEX idx_audit_assignments_audit_cycle_id ON audit_assignments(audit_cycle_id);
CREATE INDEX idx_audit_assignments_user_id ON audit_assignments(user_id);
CREATE INDEX idx_audit_assignments_assigned_location_id ON audit_assignments(assigned_location_id) WHERE assigned_location_id IS NOT NULL;
CREATE INDEX idx_audit_assignments_assigned_department_id ON audit_assignments(assigned_department_id) WHERE assigned_department_id IS NOT NULL;
CREATE INDEX idx_audit_assignments_role ON audit_assignments(role);

CREATE INDEX idx_audit_items_audit_cycle_id ON audit_items(audit_cycle_id);
CREATE INDEX idx_audit_items_asset_id ON audit_items(asset_id);
CREATE INDEX idx_audit_items_assigned_auditor_id ON audit_items(assigned_auditor_id) WHERE assigned_auditor_id IS NOT NULL;
CREATE INDEX idx_audit_items_expected_location_id ON audit_items(expected_location_id) WHERE expected_location_id IS NOT NULL;
CREATE INDEX idx_audit_items_status ON audit_items(audit_cycle_id, status);
CREATE INDEX idx_audit_items_has_discrepancy ON audit_items(has_discrepancy) WHERE has_discrepancy = TRUE;

CREATE INDEX idx_audit_discrepancies_audit_item_id ON audit_discrepancies(audit_item_id);
CREATE INDEX idx_audit_discrepancies_discrepancy_type ON audit_discrepancies(discrepancy_type);
CREATE INDEX idx_audit_discrepancies_severity ON audit_discrepancies(severity);
CREATE INDEX idx_audit_discrepancies_resolution_status ON audit_discrepancies(resolution_status) WHERE resolution_status != 'closed';

CREATE INDEX idx_audit_history_audit_cycle_id ON audit_history(audit_cycle_id, performed_at DESC);

CREATE INDEX idx_audit_checklists_code ON audit_checklists(organization_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_checklists_organization_id ON audit_checklists(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_checklists_is_active ON audit_checklists(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_checklists_category_id ON audit_checklists(category_id) WHERE category_id IS NOT NULL;

CREATE INDEX idx_audit_checklist_items_checklist_id ON audit_checklist_items(checklist_id);
CREATE INDEX idx_audit_checklist_items_order ON audit_checklist_items(checklist_id, order_index);

-- Reports Indexes
CREATE INDEX idx_reports_slug ON reports(organization_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_reports_organization_id ON reports(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_reports_report_type ON reports(organization_id, report_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_reports_is_public ON reports(organization_id, is_public) WHERE is_public = TRUE;
CREATE INDEX idx_reports_is_system ON reports(is_system) WHERE is_system = TRUE;

CREATE INDEX idx_report_schedules_report_id ON report_schedules(report_id);
CREATE INDEX idx_report_schedules_is_active ON report_schedules(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_report_schedules_next_run_at ON report_schedules(next_run_at) WHERE is_active = TRUE;

CREATE INDEX idx_report_subscriptions_report_id ON report_subscriptions(report_id);
CREATE INDEX idx_report_subscriptions_user_id ON report_subscriptions(user_id);
CREATE INDEX idx_report_subscriptions_is_active ON report_subscriptions(is_active) WHERE is_active = TRUE;

-- Notifications Indexes
CREATE INDEX idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(organization_id, type);
CREATE INDEX idx_notifications_priority ON notifications(user_id, priority) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_notifications_related_entity ON notifications(related_entity_type, related_entity_id) WHERE related_entity_id IS NOT NULL;

CREATE INDEX idx_notification_templates_slug ON notification_templates(organization_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_templates_organization_id ON notification_templates(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_templates_type ON notification_templates(organization_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_templates_is_active ON notification_templates(organization_id, is_active) WHERE deleted_at IS NULL;

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_notification_preferences_notification_type ON notification_preferences(user_id, notification_type);

CREATE INDEX idx_notification_rules_organization_id ON notification_rules(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_rules_is_active ON notification_rules(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_rules_trigger_event ON notification_rules(trigger_event) WHERE is_active = TRUE;

CREATE INDEX idx_notification_logs_notification_id ON notification_logs(notification_id);
CREATE INDEX idx_notification_logs_channel ON notification_logs(channel);
CREATE INDEX idx_notification_logs_status ON notification_logs(status) WHERE status = 'failed';
CREATE INDEX idx_notification_logs_retry_count ON notification_logs(retry_count) WHERE status = 'failed';

-- Activity Logs Indexes
CREATE INDEX idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_activity_logs_action ON activity_logs(organization_id, action);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id) WHERE entity_id IS NOT NULL;
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

CREATE INDEX idx_activity_log_details_activity_log_id ON activity_log_details(activity_log_id);

-- Dashboard Indexes
CREATE INDEX idx_dashboard_configs_user_id ON dashboard_configs(user_id);
CREATE INDEX idx_dashboard_configs_is_default ON dashboard_configs(user_id) WHERE is_default = TRUE;

CREATE INDEX idx_dashboard_widgets_slug ON dashboard_widgets(organization_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_dashboard_widgets_organization_id ON dashboard_widgets(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dashboard_widgets_is_active ON dashboard_widgets(organization_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_dashboard_widgets_widget_type ON dashboard_widgets(organization_id, widget_type) WHERE deleted_at IS NULL;

CREATE INDEX idx_kpi_metrics_organization_id ON kpi_metrics(organization_id);
CREATE INDEX idx_kpi_metrics_metric_name ON kpi_metrics(organization_id, metric_name);
CREATE INDEX idx_kpi_metrics_period ON kpi_metrics(organization_id, period_start, period_end);

-- System Indexes
CREATE INDEX idx_settings_organization_id ON settings(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_settings_global ON settings(key) WHERE organization_id IS NULL;
CREATE INDEX idx_settings_key ON settings(organization_id, key);

CREATE INDEX idx_feature_flags_organization_id ON feature_flags(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_feature_flags_global ON feature_flags(feature_name) WHERE organization_id IS NULL;
CREATE INDEX idx_feature_flags_feature_name ON feature_flags(organization_id, feature_name);
CREATE INDEX idx_feature_flags_is_enabled ON feature_flags(organization_id, is_enabled) WHERE is_enabled = TRUE;

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_service ON system_logs(service) WHERE service IS NOT NULL;
CREATE INDEX idx_system_logs_trace_id ON system_logs(trace_id) WHERE trace_id IS NOT NULL;
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX idx_system_logs_errors ON system_logs(level, created_at) WHERE level IN ('error', 'critical', 'fatal');
