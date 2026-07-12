# AssetFlow - Enterprise Asset & Resource Management System
## Production-Grade Database Schema Design

---

## 1. Complete List of Entities (Tables)

### Authentication & RBAC
1. **organizations** - Multi-tenant organization management
2. **users** - User accounts
3. **roles** - Role definitions
4. **permissions** - Permission definitions
5. **role_permissions** - Role-Permission junction table
6. **user_roles** - User-Role junction table
7. **sessions** - User session management
8. **password_reset_tokens** - Password reset tokens

### Organization Setup
9. **departments** - Department management
10. **employees** - Employee records
11. **asset_categories** - Asset categorization
12. **locations** - Physical locations hierarchy
13. **location_hierarchy** - Location parent-child relationships

### Asset Management
14. **assets** - Asset records
15. **asset_status_history** - Asset status change tracking
16. **asset_photos** - Asset image storage
17. **asset_documents** - Asset document storage
18. **asset_qr_codes** - QR code generation and tracking
19. **asset_specifications** - Asset technical specifications
20. **asset_warranties** - Asset warranty information
21. **asset_depreciation** - Asset depreciation tracking

### Asset Allocation
22. **allocations** - Asset allocation records
23. **allocation_history** - Allocation change tracking
24. **transfers** - Asset transfer requests
25. **transfer_approvals** - Transfer approval workflow
26. **allocation_conflicts** - Conflict detection records

### Resource Booking
27. **bookable_resources** - Bookable resource definitions
28. **bookings** - Booking records
29. **booking_history** - Booking change tracking
30. **booking_attendees** - Meeting attendees
31. **resource_availability** - Resource availability schedules
32. **booking_blackouts** - Blackout periods for resources

### Maintenance
33. **maintenance_requests** - Maintenance request records
34. **maintenance_activities** - Maintenance activity logs
35. **maintenance_technicians** - Technician assignments
36. **vendors** - External maintenance vendors
37. **maintenance_schedules** - Scheduled maintenance
38. **maintenance_approvals** - Maintenance approval workflow
39. **maintenance_costs** - Cost tracking

### Audit
40. **audit_cycles** - Audit cycle definitions
41. **audit_assignments** - Auditor assignments
42. **audit_items** - Items to be audited
43. **audit_discrepancies** - Discrepancy records
44. **audit_history** - Audit change tracking
45. **audit_checklists** - Audit checklist templates
46. **audit_checklist_items** - Checklist item definitions

### Reports
47. **reports** - Saved report configurations
48. **report_schedules** - Scheduled report generation
49. **report_subscriptions** - Report subscriptions

### Notifications
50. **notifications** - Notification records
51. **notification_templates** - Notification templates
52. **notification_preferences** - User notification preferences
53. **notification_rules** - Automated notification rules
54. **notification_logs** - Notification delivery logs

### Activity Logs
55. **activity_logs** - System activity tracking
56. **activity_log_details** - Detailed activity information

### Dashboard
57. **dashboard_configs** - User dashboard configurations
58. **dashboard_widgets** - Widget definitions
59. **kpi_metrics** - KPI metric storage

### System
60. **settings** - System-wide settings
61. **feature_flags** - Feature toggle management
62. **system_logs** - System-level logging

---

## 2. Table Schemas

### 2.1 Authentication & RBAC

#### organizations
**Purpose**: Multi-tenant organization management for SaaS deployment

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| name | VARCHAR(255) | NO | - | NO | - |
| slug | VARCHAR(100) | NO | - | YES | - |
| domain | VARCHAR(255) | YES | NULL | YES | - |
| logo_url | VARCHAR(500) | YES | NULL | NO | - |
| primary_color | VARCHAR(7) | YES | NULL | NO | - |
| secondary_color | VARCHAR(7) | YES | NULL | NO | - |
| timezone | VARCHAR(50) | NO | 'UTC' | NO | - |
| locale | VARCHAR(10) | NO | 'en-US' | NO | - |
| address | TEXT | YES | NULL | NO | - |
| phone | VARCHAR(20) | YES | NULL | NO | - |
| email | VARCHAR(255) | NO | - | YES | - |
| max_users | INTEGER | NO | 100 | NO | - |
| max_assets | INTEGER | NO | 1000 | NO | - |
| subscription_plan | VARCHAR(50) | NO | 'basic' | NO | - |
| subscription_status | VARCHAR(20) | NO | 'active' | NO | - |
| subscription_start | TIMESTAMP | NO | NOW() | NO | - |
| subscription_end | TIMESTAMP | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

---

#### users
**Purpose**: User account management with organization association

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| employee_id | UUID | YES | NULL | NO | employees.id |
| email | VARCHAR(255) | NO | - | YES | - |
| password_hash | VARCHAR(255) | NO | - | NO | - |
| first_name | VARCHAR(100) | NO | - | NO | - |
| last_name | VARCHAR(100) | NO | - | NO | - |
| display_name | VARCHAR(200) | YES | NULL | NO | - |
| avatar_url | VARCHAR(500) | YES | NULL | NO | - |
| phone | VARCHAR(20) | YES | NULL | NO | - |
| department_id | UUID | YES | NULL | NO | departments.id |
| job_title | VARCHAR(100) | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| is_verified | BOOLEAN | NO | FALSE | NO | - |
| last_login_at | TIMESTAMP | YES | NULL | NO | - |
| last_login_ip | VARCHAR(45) | YES | NULL | NO | - |
| failed_login_attempts | INTEGER | NO | 0 | NO | - |
| locked_until | TIMESTAMP | YES | NULL | NO | - |
| password_changed_at | TIMESTAMP | NO | NOW() | NO | - |
| must_change_password | BOOLEAN | NO | FALSE | NO | - |
| two_factor_enabled | BOOLEAN | NO | FALSE | NO | - |
| two_factor_secret | VARCHAR(255) | YES | NULL | NO | - |
| preferences | JSONB | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (email), (organization_id, email)

---

#### roles
**Purpose**: Role definitions for RBAC

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(100) | NO | - | NO | - |
| slug | VARCHAR(100) | NO | - | YES | - |
| description | TEXT | YES | NULL | NO | - |
| is_system | BOOLEAN | NO | FALSE | NO | - |
| is_default | BOOLEAN | NO | FALSE | NO | - |
| level | INTEGER | NO | 0 | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, slug)

---

#### permissions
**Purpose**: Granular permission definitions

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| name | VARCHAR(100) | NO | - | YES | - |
| slug | VARCHAR(100) | NO | - | YES | - |
| module | VARCHAR(50) | NO | - | NO | - |
| action | VARCHAR(50) | NO | - | NO | - |
| description | TEXT | YES | NULL | NO | - |
| is_system | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (slug)

---

#### role_permissions
**Purpose**: Junction table for Role-Permission many-to-many relationship

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| role_id | UUID | NO | - | NO | roles.id |
| permission_id | UUID | NO | - | NO | permissions.id |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

**Unique Constraints**: (role_id, permission_id)

---

#### user_roles
**Purpose**: Junction table for User-Role many-to-many relationship

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| user_id | UUID | NO | - | NO | users.id |
| role_id | UUID | NO | - | NO | roles.id |
| assigned_at | TIMESTAMP | NO | NOW() | NO | - |
| assigned_by | UUID | YES | NULL | NO | users.id |
| expires_at | TIMESTAMP | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

**Unique Constraints**: (user_id, role_id)

---

#### sessions
**Purpose**: User session management

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| user_id | UUID | NO | - | NO | users.id |
| token | VARCHAR(255) | NO | - | YES | - |
| ip_address | VARCHAR(45) | YES | NULL | NO | - |
| user_agent | TEXT | YES | NULL | NO | - |
| device_type | VARCHAR(50) | YES | NULL | NO | - |
| location | JSONB | YES | NULL | NO | - |
| last_activity | TIMESTAMP | NO | NOW() | NO | - |
| expires_at | TIMESTAMP | NO | - | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (token)

---

#### password_reset_tokens
**Purpose**: Password reset token management

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| user_id | UUID | NO | - | NO | users.id |
| token | VARCHAR(255) | NO | - | YES | - |
| expires_at | TIMESTAMP | NO | - | NO | - |
| used_at | TIMESTAMP | YES | NULL | NO | - |
| ip_address | VARCHAR(45) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (token)

---

### 2.2 Organization Setup

#### departments
**Purpose**: Department management with hierarchy support

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| parent_id | UUID | YES | NULL | NO | departments.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| description | TEXT | YES | NULL | NO | - |
| manager_id | UUID | YES | NULL | NO | employees.id |
| location_id | UUID | YES | NULL | NO | locations.id |
| budget | DECIMAL(15,2) | YES | NULL | NO | - |
| employee_count | INTEGER | NO | 0 | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| level | INTEGER | NO | 0 | NO | - |
| path | VARCHAR(1000) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### employees
**Purpose**: Employee records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| department_id | UUID | YES | NULL | NO | departments.id |
| employee_number | VARCHAR(50) | NO | - | YES | - |
| first_name | VARCHAR(100) | NO | - | NO | - |
| last_name | VARCHAR(100) | NO | - | NO | - |
| display_name | VARCHAR(200) | YES | NULL | NO | - |
| email | VARCHAR(255) | NO | - | YES | - |
| phone | VARCHAR(20) | YES | NULL | NO | - |
| job_title | VARCHAR(100) | YES | NULL | NO | - |
| manager_id | UUID | YES | NULL | NO | employees.id |
| location_id | UUID | YES | NULL | NO | locations.id |
| hire_date | DATE | NO | - | NO | - |
| termination_date | DATE | YES | NULL | NO | - |
| employment_status | VARCHAR(20) | NO | 'active' | NO | - |
| avatar_url | VARCHAR(500) | YES | NULL | NO | - |
| address | JSONB | YES | NULL | NO | - |
| emergency_contact | JSONB | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, employee_number), (organization_id, email)

---

#### asset_categories
**Purpose**: Asset categorization hierarchy

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| parent_id | UUID | YES | NULL | NO | asset_categories.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| description | TEXT | YES | NULL | NO | - |
| icon | VARCHAR(100) | YES | NULL | NO | - |
| color | VARCHAR(7) | YES | NULL | NO | - |
| depreciation_method | VARCHAR(50) | YES | NULL | NO | - |
| depreciation_rate | DECIMAL(5,2) | YES | NULL | NO | - |
| useful_life_years | INTEGER | YES | NULL | NO | - |
| requires_maintenance | BOOLEAN | NO | TRUE | NO | - |
| maintenance_interval_days | INTEGER | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| level | INTEGER | NO | 0 | NO | - |
| path | VARCHAR(1000) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### locations
**Purpose**: Physical location management

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| parent_id | UUID | YES | NULL | NO | locations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| type | VARCHAR(50) | NO | 'building' | NO | - |
| address | JSONB | YES | NULL | NO | - |
| coordinates | JSONB | YES | NULL | NO | - |
| floor | VARCHAR(50) | YES | NULL | NO | - |
| room | VARCHAR(50) | YES | NULL | NO | - |
| capacity | INTEGER | YES | NULL | NO | - |
| manager_id | UUID | YES | NULL | NO | employees.id |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| level | INTEGER | NO | 0 | NO | - |
| path | VARCHAR(1000) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### location_hierarchy
**Purpose**: Explicit location parent-child relationships for hierarchy queries

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| ancestor_id | UUID | NO | - | NO | locations.id |
| descendant_id | UUID | NO | - | NO | locations.id |
| depth | INTEGER | NO | 0 | NO | - |

**Primary Key**: id

**Unique Constraints**: (ancestor_id, descendant_id)

---

### 2.3 Asset Management

#### assets
**Purpose**: Core asset records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|-----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| category_id | UUID | NO | - | NO | asset_categories.id |
| location_id | UUID | YES | NULL | NO | locations.id |
| asset_tag | VARCHAR(50) | NO | - | YES | - |
| serial_number | VARCHAR(100) | YES | NULL | YES | - |
| name | VARCHAR(255) | NO | - | NO | - |
| description | TEXT | YES | NULL | NO | - |
| brand | VARCHAR(100) | YES | NULL | NO | - |
| model | VARCHAR(100) | YES | NULL | NO | - |
| manufacturer | VARCHAR(100) | YES | NULL | NO | - |
| purchase_date | DATE | YES | NULL | NO | - |
| purchase_cost | DECIMAL(15,2) | YES | NULL | NO | - |
| purchase_order | VARCHAR(100) | YES | NULL | NO | - |
| supplier | VARCHAR(255) | YES | NULL | NO | - |
| current_value | DECIMAL(15,2) | YES | NULL | NO | - |
| status | VARCHAR(50) | NO | 'available' | NO | - |
| condition | VARCHAR(50) | YES | NULL | NO | - |
| ownership_type | VARCHAR(50) | NO | 'owned' | NO | - |
| assigned_to | UUID | YES | NULL | NO | employees.id |
| assigned_department_id | UUID | YES | NULL | NO | departments.id |
| expected_return_date | DATE | YES | NULL | NO | - |
| warranty_expiry | DATE | YES | NULL | NO | - |
| last_maintenance_date | DATE | YES | NULL | NO | - |
| next_maintenance_date | DATE | YES | NULL | NO | - |
| qr_code | VARCHAR(255) | YES | NULL | YES | - |
| barcode | VARCHAR(100) | YES | NULL | YES | - |
| is_bookable | BOOLEAN | NO | FALSE | NO | - |
| is_maintainable | BOOLEAN | NO | TRUE | NO | - |
| is_auditable | BOOLEAN | NO | TRUE | NO | - |
| notes | TEXT | YES | NULL | NO | - |
| custom_fields | JSONB | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, asset_tag), (organization_id, serial_number), (organization_id, qr_code), (organization_id, barcode)

---

#### asset_status_history
**Purpose**: Track all asset status changes

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | NO | assets.id |
| from_status | VARCHAR(50) | YES | NULL | NO | - |
| to_status | VARCHAR(50) | NO | - | NO | - |
| reason | TEXT | YES | NULL | NO | - |
| changed_at | TIMESTAMP | NO | NOW() | NO | - |
| changed_by | UUID | YES | NULL | NO | users.id |
| related_allocation_id | UUID | YES | NULL | NO | allocations.id |
| related_maintenance_id | UUID | YES | NULL | NO | maintenance_requests.id |

**Primary Key**: id

---

#### asset_photos
**Purpose**: Asset image storage

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | NO | assets.id |
| url | VARCHAR(500) | NO | - | NO | - |
| thumbnail_url | VARCHAR(500) | YES | NULL | NO | - |
| caption | VARCHAR(255) | YES | NULL | NO | - |
| is_primary | BOOLEAN | NO | FALSE | NO | - |
| file_size | INTEGER | YES | NULL | NO | - |
| file_type | VARCHAR(50) | YES | NULL | NO | - |
| uploaded_at | TIMESTAMP | NO | NOW() | NO | - |
| uploaded_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

---

#### asset_documents
**Purpose**: Asset document storage

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | NO | assets.id |
| title | VARCHAR(255) | NO | - | NO | - |
| description | TEXT | YES | NULL | NO | - |
| url | VARCHAR(500) | NO | - | NO | - |
| file_size | INTEGER | YES | NULL | NO | - |
| file_type | VARCHAR(50) | YES | NULL | NO | - |
| document_type | VARCHAR(50) | YES | NULL | NO | - |
| uploaded_at | TIMESTAMP | NO | NOW() | NO | - |
| uploaded_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

---

#### asset_qr_codes
**Purpose**: QR code generation and tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | YES | assets.id |
| qr_code | VARCHAR(255) | NO | - | YES | - |
| generated_at | TIMESTAMP | NO | NOW() | NO | - |
| generated_by | UUID | YES | NULL | NO | users.id |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| scan_count | INTEGER | NO | 0 | NO | - |
| last_scanned_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (asset_id), (qr_code)

---

#### asset_specifications
**Purpose**: Asset technical specifications

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | YES | assets.id |
| specifications | JSONB | NO | - | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

**Unique Constraints**: (asset_id)

---

#### asset_warranties
**Purpose**: Asset warranty information

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | NO | assets.id |
| provider | VARCHAR(255) | NO | - | NO | - |
| warranty_number | VARCHAR(100) | YES | NULL | NO | - |
| start_date | DATE | NO | - | NO | - |
| end_date | DATE | NO | - | NO | - |
| coverage_details | TEXT | YES | NULL | NO | - |
| contact_info | JSONB | YES | NULL | NO | - |
| document_url | VARCHAR(500) | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

---

#### asset_depreciation
**Purpose**: Asset depreciation tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | YES | assets.id |
| method | VARCHAR(50) | NO | 'straight_line' | NO | - |
| useful_life_years | INTEGER | NO | 5 | NO | - |
| salvage_value | DECIMAL(15,2) | YES | NULL | NO | - |
| annual_depreciation | DECIMAL(15,2) | YES | NULL | NO | - |
| accumulated_depreciation | DECIMAL(15,2) | NO | 0 | NO | - |
| book_value | DECIMAL(15,2) | YES | NULL | NO | - |
| last_calculated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (asset_id)

---

### 2.4 Asset Allocation

#### allocations
**Purpose**: Asset allocation records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| asset_id | UUID | NO | - | NO | assets.id |
| allocated_to_type | VARCHAR(50) | NO | 'employee' | NO | - |
| allocated_to_employee_id | UUID | YES | NULL | NO | employees.id |
| allocated_to_department_id | UUID | YES | NULL | NO | departments.id |
| allocated_by | UUID | NO | - | NO | users.id |
| allocation_date | DATE | NO | NOW() | NO | - |
| expected_return_date | DATE | YES | NULL | NO | - |
| actual_return_date | DATE | YES | NULL | NO | - |
| return_condition | VARCHAR(50) | YES | NULL | NO | - |
| return_notes | TEXT | YES | NULL | NO | - |
| purpose | TEXT | YES | NULL | NO | - |
| status | VARCHAR(50) | NO | 'active' | NO | - |
| is_transfer | BOOLEAN | NO | FALSE | NO | - |
| transfer_from_allocation_id | UUID | YES | NULL | NO | allocations.id |
| approved_by | UUID | YES | NULL | NO | users.id |
| approved_at | TIMESTAMP | YES | NULL | NO | - |
| rejected_by | UUID | YES | NULL | NO | users.id |
| rejected_at | TIMESTAMP | YES | NULL | NO | - |
| rejection_reason | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (asset_id, status) WHERE status = 'active'

---

#### allocation_history
**Purpose**: Allocation change tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| allocation_id | UUID | NO | - | NO | allocations.id |
| action | VARCHAR(50) | NO | - | NO | - |
| from_status | VARCHAR(50) | YES | NULL | NO | - |
| to_status | VARCHAR(50) | NO | - | NO | - |
| changes | JSONB | YES | NULL | NO | - |
| performed_at | TIMESTAMP | NO | NOW() | NO | - |
| performed_by | UUID | YES | NULL | NO | users.id |
| notes | TEXT | YES | NULL | NO | - |

**Primary Key**: id

---

#### transfers
**Purpose**: Asset transfer requests

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| asset_id | UUID | NO | - | NO | assets.id |
| from_employee_id | UUID | YES | NULL | NO | employees.id |
| from_department_id | UUID | YES | NULL | NO | departments.id |
| to_employee_id | UUID | YES | NULL | NO | employees.id |
| to_department_id | UUID | YES | NULL | NO | departments.id |
| requested_by | UUID | NO | - | NO | users.id |
| requested_at | TIMESTAMP | NO | NOW() | NO | - |
| reason | TEXT | YES | NULL | NO | - |
| priority | VARCHAR(20) | NO | 'normal' | NO | - |
| expected_date | DATE | YES | NULL | NO | - |
| status | VARCHAR(50) | NO | 'pending' | NO | - |
| approved_by | UUID | YES | NULL | NO | users.id |
| approved_at | TIMESTAMP | YES | NULL | NO | - |
| rejected_by | UUID | YES | NULL | NO | users.id |
| rejected_at | TIMESTAMP | YES | NULL | NO | - |
| rejection_reason | TEXT | YES | NULL | NO | - |
| completed_at | TIMESTAMP | YES | NULL | NO | - |
| completed_by | UUID | YES | NULL | NO | users.id |
| notes | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

---

#### transfer_approvals
**Purpose**: Transfer approval workflow

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| transfer_id | UUID | NO | - | NO | transfers.id |
| approver_id | UUID | NO | - | NO | users.id |
| approval_level | INTEGER | NO | 1 | NO | - |
| status | VARCHAR(50) | NO | 'pending' | NO | - |
| approved_at | TIMESTAMP | YES | NULL | NO | - |
| rejected_at | TIMESTAMP | YES | NULL | NO | - |
| comments | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (transfer_id, approver_id)

---

#### allocation_conflicts
**Purpose**: Conflict detection records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| asset_id | UUID | NO | - | NO | assets.id |
| existing_allocation_id | UUID | NO | - | NO | allocations.id |
| conflicting_allocation_id | UUID | YES | NULL | NO | allocations.id |
| conflict_type | VARCHAR(50) | NO | - | NO | - |
| detected_at | TIMESTAMP | NO | NOW() | NO | - |
| resolved_at | TIMESTAMP | YES | NULL | NO | - |
| resolved_by | UUID | YES | NULL | NO | users.id |
| resolution_notes | TEXT | YES | NULL | NO | - |
| status | VARCHAR(50) | NO | 'unresolved' | NO | - |

**Primary Key**: id

---

### 2.5 Resource Booking

#### bookable_resources
**Purpose**: Bookable resource definitions

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| location_id | UUID | YES | NULL | NO | locations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| type | VARCHAR(50) | NO | 'room' | NO | - |
| description | TEXT | YES | NULL | NO | - |
| capacity | INTEGER | YES | NULL | NO | - |
| facilities | JSONB | YES | NULL | NO | - |
| specifications | JSONB | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| requires_approval | BOOLEAN | NO | FALSE | NO | - |
| advance_booking_days | INTEGER | NO | 30 | NO | - |
| min_booking_duration_minutes | INTEGER | NO | 15 | NO | - |
| max_booking_duration_minutes | INTEGER | NO | 480 | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### bookings
**Purpose**: Booking records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| resource_id | UUID | NO | - | NO | bookable_resources.id |
| booked_by | UUID | NO | - | NO | users.id |
| title | VARCHAR(255) | NO | - | NO | - |
| description | TEXT | YES | NULL | NO | - |
| start_datetime | TIMESTAMP | NO | - | NO | - |
| end_datetime | TIMESTAMP | NO | - | NO | - |
| all_day | BOOLEAN | NO | FALSE | NO | - |
| status | VARCHAR(50) | NO | 'confirmed' | NO | - |
| recurrence_rule | TEXT | YES | NULL | NO | - |
| recurrence_end_date | DATE | YES | NULL | NO | - |
| attendee_count | INTEGER | NO | 0 | NO | - |
| requires_approval | BOOLEAN | NO | FALSE | NO | - |
| approved_by | UUID | YES | NULL | NO | users.id |
| approved_at | TIMESTAMP | YES | NULL | NO | - |
| rejected_by | UUID | YES | NULL | NO | users.id |
| rejected_at | TIMESTAMP | YES | NULL | NO | - |
| rejection_reason | TEXT | YES | NULL | NO | - |
| checked_in_at | TIMESTAMP | YES | NULL | NO | - |
| checked_out_at | TIMESTAMP | YES | NULL | NO | - |
| cancelled_at | TIMESTAMP | YES | NULL | NO | - |
| cancelled_by | UUID | YES | NULL | NO | users.id |
| cancellation_reason | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (resource_id, start_datetime, end_datetime) WHERE deleted_at IS NULL

---

#### booking_history
**Purpose**: Booking change tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| booking_id | UUID | NO | - | NO | bookings.id |
| action | VARCHAR(50) | NO | - | NO | - |
| from_status | VARCHAR(50) | YES | NULL | NO | - |
| to_status | VARCHAR(50) | NO | - | NO | - |
| changes | JSONB | YES | NULL | NO | - |
| performed_at | TIMESTAMP | NO | NOW() | NO | - |
| performed_by | UUID | YES | NULL | NO | users.id |
| notes | TEXT | YES | NULL | NO | - |

**Primary Key**: id

---

#### booking_attendees
**Purpose**: Meeting attendees

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| booking_id | UUID | NO | - | NO | bookings.id |
| user_id | UUID | YES | NULL | NO | users.id |
| employee_id | UUID | YES | NULL | NO | employees.id |
| name | VARCHAR(255) | YES | NULL | NO | - |
| email | VARCHAR(255) | YES | NULL | NO | - |
| status | VARCHAR(50) | NO | 'accepted' | NO | - |
| responded_at | TIMESTAMP | YES | NULL | NO | - |
| is_optional | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (booking_id, user_id), (booking_id, employee_id), (booking_id, email)

---

#### resource_availability
**Purpose**: Resource availability schedules

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| resource_id | UUID | NO | - | NO | bookable_resources.id |
| day_of_week | INTEGER | NO | - | NO | - |
| start_time | TIME | NO | - | NO | - |
| end_time | TIME | NO | - | NO | - |
| is_available | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (resource_id, day_of_week, start_time)

---

#### booking_blackouts
**Purpose**: Blackout periods for resources

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| resource_id | UUID | NO | - | NO | bookable_resources.id |
| start_datetime | TIMESTAMP | NO | - | NO | - |
| end_datetime | TIMESTAMP | NO | - | NO | - |
| reason | TEXT | YES | NULL | NO | - |
| created_by | UUID | NO | - | NO | users.id |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

### 2.6 Maintenance

#### maintenance_requests
**Purpose**: Maintenance request records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| asset_id | UUID | NO | - | NO | assets.id |
| request_number | VARCHAR(50) | NO | - | YES | - |
| requested_by | UUID | NO | - | NO | users.id |
| assigned_to | UUID | YES | NULL | NO | users.id |
| priority | VARCHAR(20) | NO | 'normal' | NO | - |
| type | VARCHAR(50) | NO | 'corrective' | NO | - |
| title | VARCHAR(255) | NO | - | NO | - |
| description | TEXT | NO | - | NO | - |
| reported_issue | TEXT | YES | NULL | NO | - |
| status | VARCHAR(50) | NO | 'pending' | NO | - |
| requested_date | DATE | NO | NOW() | NO | - |
| target_completion_date | DATE | YES | NULL | NO | - |
| actual_completion_date | DATE | YES | NULL | NO | - |
| estimated_cost | DECIMAL(15,2) | YES | NULL | NO | - |
| actual_cost | DECIMAL(15,2) | YES | NULL | NO | - |
| vendor_id | UUID | YES | NULL | NO | vendors.id |
| requires_approval | BOOLEAN | NO | FALSE | NO | - |
| approved_by | UUID | YES | NULL | NO | users.id |
| approved_at | TIMESTAMP | YES | NULL | NO | - |
| rejected_by | UUID | YES | NULL | NO | users.id |
| rejected_at | TIMESTAMP | YES | NULL | NO | - |
| rejection_reason | TEXT | YES | NULL | NO | - |
| completed_by | UUID | YES | NULL | NO | users.id |
| completion_notes | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, request_number)

---

#### maintenance_activities
**Purpose**: Maintenance activity logs

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| maintenance_request_id | UUID | NO | - | NO | maintenance_requests.id |
| activity_type | VARCHAR(50) | NO | - | NO | - |
| description | TEXT | NO | - | NO | - |
| performed_by | UUID | YES | NULL | NO | users.id |
| performed_at | TIMESTAMP | NO | NOW() | NO | - |
| duration_minutes | INTEGER | YES | NULL | NO | - |
| cost | DECIMAL(15,2) | YES | NULL | NO | - |
| notes | TEXT | YES | NULL | NO | - |
| attachments | JSONB | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

#### maintenance_technicians
**Purpose**: Technician assignments

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| maintenance_request_id | UUID | NO | - | NO | maintenance_requests.id |
| user_id | UUID | NO | - | NO | users.id |
| assigned_at | TIMESTAMP | NO | NOW() | NO | - |
| assigned_by | UUID | YES | NULL | NO | users.id |
| role | VARCHAR(50) | NO | 'technician' | NO | - |
| is_primary | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (maintenance_request_id, user_id)

---

#### vendors
**Purpose**: External maintenance vendors

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| contact_person | VARCHAR(255) | YES | NULL | NO | - |
| email | VARCHAR(255) | YES | NULL | NO | - |
| phone | VARCHAR(20) | YES | NULL | NO | - |
| address | JSONB | YES | NULL | NO | - |
| services | JSONB | YES | NULL | NO | - |
| rating | DECIMAL(3,2) | YES | NULL | NO | - |
| contract_start | DATE | YES | NULL | NO | - |
| contract_end | DATE | YES | NULL | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| notes | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### maintenance_schedules
**Purpose**: Scheduled maintenance

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| asset_id | UUID | NO | - | NO | assets.id |
| name | VARCHAR(255) | NO | - | NO | - |
| description | TEXT | YES | NULL | NO | - |
| schedule_type | VARCHAR(50) | NO | 'recurring' | NO | - |
| frequency | VARCHAR(50) | YES | NULL | NO | - |
| interval_value | INTEGER | YES | NULL | NO | - |
| start_date | DATE | NO | - | NO | - |
| end_date | DATE | YES | NULL | NO | - |
| last_performed_date | DATE | YES | NULL | NO | - |
| next_due_date | DATE | NO | - | NO | - |
| assigned_to | UUID | YES | NULL | NO | users.id |
| priority | VARCHAR(20) | NO | 'normal' | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

---

#### maintenance_approvals
**Purpose**: Maintenance approval workflow

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| maintenance_request_id | UUID | NO | - | NO | maintenance_requests.id |
| approver_id | UUID | NO | - | NO | users.id |
| approval_level | INTEGER | NO | 1 | NO | - |
| status | VARCHAR(50) | NO | 'pending' | NO | - |
| approved_at | TIMESTAMP | YES | NULL | NO | - |
| rejected_at | TIMESTAMP | YES | NULL | NO | - |
| comments | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (maintenance_request_id, approver_id)

---

#### maintenance_costs
**Purpose**: Cost tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| maintenance_request_id | UUID | NO | - | NO | maintenance_requests.id |
| cost_type | VARCHAR(50) | NO | - | NO | - |
| description | VARCHAR(255) | YES | NULL | NO | - |
| amount | DECIMAL(15,2) | NO | 0 | NO | - |
| currency | VARCHAR(3) | NO | 'USD' | NO | - |
| incurred_at | DATE | NO | NOW() | NO | - |
| vendor_id | UUID | YES | NULL | NO | vendors.id |
| invoice_number | VARCHAR(100) | YES | NULL | NO | - |
| receipt_url | VARCHAR(500) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

---

### 2.7 Audit

#### audit_cycles
**Purpose**: Audit cycle definitions

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| description | TEXT | YES | NULL | NO | - |
| audit_type | VARCHAR(50) | NO | 'physical' | NO | - |
| start_date | DATE | NO | - | NO | - |
| end_date | DATE | YES | NULL | NO | - |
| planned_start_date | DATE | NO | - | NO | - |
| planned_end_date | DATE | NO | - | NO | - |
| status | VARCHAR(50) | NO | 'planned' | NO | - |
| scope | JSONB | YES | NULL | NO | - |
| checklist_id | UUID | YES | NULL | NO | audit_checklists.id |
| lead_auditor_id | UUID | YES | NULL | NO | users.id |
| total_assets | INTEGER | NO | 0 | NO | - |
| audited_assets | INTEGER | NO | 0 | NO | - |
| discrepancy_count | INTEGER | NO | 0 | NO | - |
| is_locked | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### audit_assignments
**Purpose**: Auditor assignments

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| audit_cycle_id | UUID | NO | - | NO | audit_cycles.id |
| user_id | UUID | NO | - | NO | users.id |
| role | VARCHAR(50) | NO | 'auditor' | NO | - |
| assigned_at | TIMESTAMP | NO | NOW() | NO | - |
| assigned_by | UUID | YES | NULL | NO | users.id |
| assigned_location_id | UUID | YES | NULL | NO | locations.id |
| assigned_department_id | UUID | YES | NULL | NO | departments.id |
| asset_count | INTEGER | NO | 0 | NO | - |
| completed_count | INTEGER | NO | 0 | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (audit_cycle_id, user_id)

---

#### audit_items
**Purpose**: Items to be audited

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| audit_cycle_id | UUID | NO | - | NO | audit_cycles.id |
| asset_id | UUID | NO | - | NO | assets.id |
| assigned_auditor_id | UUID | YES | NULL | NO | users.id |
| assigned_location_id | UUID | YES | NULL | NO | locations.id |
| expected_location_id | UUID | YES | NULL | NO | locations.id |
| status | VARCHAR(50) | NO | 'pending' | NO | - |
| actual_location_id | UUID | YES | NULL | NO | locations.id |
| actual_condition | VARCHAR(50) | YES | NULL | NO | - |
| notes | TEXT | YES | NULL | NO | - |
| audited_at | TIMESTAMP | YES | NULL | NO | - |
| audited_by | UUID | YES | NULL | NO | users.id |
| photo_url | VARCHAR(500) | YES | NULL | NO | - |
| has_discrepancy | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (audit_cycle_id, asset_id)

---

#### audit_discrepancies
**Purpose**: Discrepancy records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| audit_item_id | UUID | NO | - | NO | audit_items.id |
| discrepancy_type | VARCHAR(50) | NO | - | NO | - |
| description | TEXT | NO | - | NO | - |
| expected_value | VARCHAR(255) | YES | NULL | NO | - |
| actual_value | VARCHAR(255) | YES | NULL | NO | - |
| severity | VARCHAR(20) | NO | 'medium' | NO | - |
| resolution_status | VARCHAR(50) | NO | 'open' | NO | - |
| resolution_notes | TEXT | YES | NULL | NO | - |
| resolved_by | UUID | YES | NULL | NO | users.id |
| resolved_at | TIMESTAMP | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

#### audit_history
**Purpose**: Audit change tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| audit_cycle_id | UUID | NO | - | NO | audit_cycles.id |
| action | VARCHAR(50) | NO | - | NO | - |
| from_status | VARCHAR(50) | YES | NULL | NO | - |
| to_status | VARCHAR(50) | NO | - | NO | - |
| changes | JSONB | YES | NULL | NO | - |
| performed_at | TIMESTAMP | NO | NOW() | NO | - |
| performed_by | UUID | YES | NULL | NO | users.id |
| notes | TEXT | YES | NULL | NO | - |

**Primary Key**: id

---

#### audit_checklists
**Purpose**: Audit checklist templates

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| code | VARCHAR(50) | NO | - | YES | - |
| description | TEXT | YES | NULL | NO | - |
| category_id | UUID | YES | NULL | NO | asset_categories.id |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, code)

---

#### audit_checklist_items
**Purpose**: Checklist item definitions

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| checklist_id | UUID | NO | - | NO | audit_checklists.id |
| item_text | TEXT | NO | - | NO | - |
| item_type | VARCHAR(50) | NO | 'checkbox' | NO | - |
| options | JSONB | YES | NULL | NO | - |
| required | BOOLEAN | NO | TRUE | NO | - |
| order | INTEGER | NO | 0 | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

### 2.8 Reports

#### reports
**Purpose**: Saved report configurations

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| slug | VARCHAR(100) | NO | - | YES | - |
| description | TEXT | YES | NULL | NO | - |
| report_type | VARCHAR(50) | NO | - | NO | - |
| query_config | JSONB | NO | - | NO | - |
| filters | JSONB | YES | NULL | NO | - |
| columns | JSONB | NO | - | NO | - |
| group_by | JSONB | YES | NULL | NO | - |
| sort_by | JSONB | YES | NULL | NO | - |
| chart_config | JSONB | YES | NULL | NO | - |
| is_public | BOOLEAN | NO | FALSE | NO | - |
| is_system | BOOLEAN | NO | FALSE | NO | - |
| created_by | UUID | NO | - | NO | users.id |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, slug)

---

#### report_schedules
**Purpose**: Scheduled report generation

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| report_id | UUID | NO | - | NO | reports.id |
| name | VARCHAR(255) | NO | - | NO | - |
| schedule_type | VARCHAR(50) | NO | 'recurring' | NO | - |
| frequency | VARCHAR(50) | YES | NULL | NO | - |
| interval_value | INTEGER | YES | NULL | NO | - |
| day_of_week | INTEGER | YES | NULL | NO | - |
| day_of_month | INTEGER | YES | NULL | NO | - |
| time | TIME | NO | '09:00:00' | NO | - |
| timezone | VARCHAR(50) | NO | 'UTC' | NO | - |
| recipients | JSONB | NO | - | NO | - |
| format | VARCHAR(20) | NO | 'pdf' | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| last_run_at | TIMESTAMP | YES | NULL | NO | - |
| next_run_at | TIMESTAMP | NO | - | NO | - |
| created_by | UUID | NO | - | NO | users.id |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

---

#### report_subscriptions
**Purpose**: Report subscriptions

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| report_id | UUID | NO | - | NO | reports.id |
| user_id | UUID | NO | - | NO | users.id |
| subscribed_at | TIMESTAMP | NO | NOW() | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |

**Primary Key**: id

**Unique Constraints**: (report_id, user_id)

---

### 2.9 Notifications

#### notifications
**Purpose**: Notification records

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| user_id | UUID | NO | - | NO | users.id |
| type | VARCHAR(50) | NO | - | NO | - |
| title | VARCHAR(255) | NO | - | NO | - |
| message | TEXT | NO | - | NO | - |
| data | JSONB | YES | NULL | NO | - |
| priority | VARCHAR(20) | NO | 'normal' | NO | - |
| channels | JSONB | NO | - | NO | - |
| is_read | BOOLEAN | NO | FALSE | NO | - |
| read_at | TIMESTAMP | YES | NULL | NO | - |
| expires_at | TIMESTAMP | YES | NULL | NO | - |
| related_entity_type | VARCHAR(50) | YES | NULL | NO | - |
| related_entity_id | UUID | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

#### notification_templates
**Purpose**: Notification templates

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| slug | VARCHAR(100) | NO | - | YES | - |
| type | VARCHAR(50) | NO | - | NO | - |
| subject | VARCHAR(255) | YES | NULL | NO | - |
| body | TEXT | NO | - | NO | - |
| variables | JSONB | YES | NULL | NO | - |
| channels | JSONB | NO | - | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| is_system | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, slug)

---

#### notification_preferences
**Purpose**: User notification preferences

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| user_id | UUID | NO | - | YES | users.id |
| notification_type | VARCHAR(50) | NO | - | NO | - |
| email_enabled | BOOLEAN | NO | TRUE | NO | - |
| push_enabled | BOOLEAN | NO | TRUE | NO | - |
| sms_enabled | BOOLEAN | NO | FALSE | NO | - |
| in_app_enabled | BOOLEAN | NO | TRUE | NO | - |
| digest_mode | BOOLEAN | NO | FALSE | NO | - |
| digest_frequency | VARCHAR(50) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (user_id, notification_type)

---

#### notification_rules
**Purpose**: Automated notification rules

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| trigger_event | VARCHAR(50) | NO | - | NO | - |
| trigger_conditions | JSONB | NO | - | NO | - |
| template_id | UUID | NO | - | NO | notification_templates.id |
| recipients | JSONB | NO | - | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

---

#### notification_logs
**Purpose**: Notification delivery logs

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| notification_id | UUID | NO | - | NO | notifications.id |
| channel | VARCHAR(50) | NO | - | NO | - |
| status | VARCHAR(50) | NO | 'pending' | NO | - |
| sent_at | TIMESTAMP | YES | NULL | NO | - |
| delivered_at | TIMESTAMP | YES | NULL | NO | - |
| failed_at | TIMESTAMP | YES | NULL | NO | - |
| error_message | TEXT | YES | NULL | NO | - |
| retry_count | INTEGER | NO | 0 | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

### 2.10 Activity Logs

#### activity_logs
**Purpose**: System activity tracking

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| user_id | UUID | YES | NULL | NO | users.id |
| action | VARCHAR(50) | NO | - | NO | - |
| entity_type | VARCHAR(50) | NO | - | NO | - |
| entity_id | UUID | YES | NULL | NO | - |
| ip_address | VARCHAR(45) | YES | NULL | NO | - |
| user_agent | TEXT | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

#### activity_log_details
**Purpose**: Detailed activity information

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| activity_log_id | UUID | NO | - | NO | activity_logs.id |
| key | VARCHAR(100) | NO | - | NO | - |
| value | TEXT | YES | NULL | NO | - |
| value_type | VARCHAR(50) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

### 2.11 Dashboard

#### dashboard_configs
**Purpose**: User dashboard configurations

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| user_id | UUID | NO | - | YES | users.id |
| name | VARCHAR(255) | NO | - | NO | - |
| layout | JSONB | NO | - | NO | - |
| widgets | JSONB | NO | - | NO | - |
| filters | JSONB | YES | NULL | NO | - |
| is_default | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

**Unique Constraints**: (user_id)

---

#### dashboard_widgets
**Purpose**: Widget definitions

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| name | VARCHAR(255) | NO | - | NO | - |
| slug | VARCHAR(100) | NO | - | YES | - |
| widget_type | VARCHAR(50) | NO | - | NO | - |
| config | JSONB | NO | - | NO | - |
| data_source | JSONB | NO | - | NO | - |
| refresh_interval | INTEGER | YES | NULL | NO | - |
| is_system | BOOLEAN | NO | FALSE | NO | - |
| is_active | BOOLEAN | NO | TRUE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| created_by | UUID | YES | NULL | NO | users.id |
| updated_by | UUID | YES | NULL | NO | users.id |
| deleted_at | TIMESTAMP | YES | NULL | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, slug)

---

#### kpi_metrics
**Purpose**: KPI metric storage

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | NO | - | NO | organizations.id |
| metric_name | VARCHAR(100) | NO | - | NO | - |
| metric_value | DECIMAL(20,2) | NO | 0 | NO | - |
| metric_type | VARCHAR(50) | NO | 'count' | NO | - |
| dimensions | JSONB | YES | NULL | NO | - |
| recorded_at | TIMESTAMP | NO | NOW() | NO | - |
| period_start | TIMESTAMP | NO | - | NO | - |
| period_end | TIMESTAMP | NO | - | NO | - |

**Primary Key**: id

**Unique Constraints**: (organization_id, metric_name, period_start, period_end)

---

### 2.12 System

#### settings
**Purpose**: System-wide settings

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | YES | NULL | YES | organizations.id |
| key | VARCHAR(100) | NO | - | NO | - |
| value | TEXT | YES | NULL | NO | - |
| value_type | VARCHAR(50) | NO | 'string' | NO | - |
| description | TEXT | YES | NULL | NO | - |
| is_public | BOOLEAN | NO | FALSE | NO | - |
| is_encrypted | BOOLEAN | NO | FALSE | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

**Unique Constraints**: (organization_id, key), (key) WHERE organization_id IS NULL

---

#### feature_flags
**Purpose**: Feature toggle management

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| organization_id | UUID | YES | NULL | YES | organizations.id |
| feature_name | VARCHAR(100) | NO | - | NO | - |
| is_enabled | BOOLEAN | NO | FALSE | NO | - |
| description | TEXT | YES | NULL | NO | - |
| rollout_percentage | INTEGER | NO | 100 | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_at | TIMESTAMP | NO | NOW() | NO | - |
| updated_by | UUID | YES | NULL | NO | users.id |

**Primary Key**: id

**Unique Constraints**: (organization_id, feature_name), (feature_name) WHERE organization_id IS NULL

---

#### system_logs
**Purpose**: System-level logging

| Column | Data Type | Nullable | Default | Unique | Foreign Key |
|--------|-----------|----------|---------|--------|-------------|
| id | UUID | NO | - | YES | - |
| level | VARCHAR(20) | NO | 'info' | NO | - |
| message | TEXT | NO | - | NO | - |
| context | JSONB | YES | NULL | NO | - |
| service | VARCHAR(50) | YES | NULL | NO | - |
| trace_id | VARCHAR(100) | YES | NULL | NO | - |
| created_at | TIMESTAMP | NO | NOW() | NO | - |

**Primary Key**: id

---

