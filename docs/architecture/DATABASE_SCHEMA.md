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

## 3. Relationships

### 3.1 Authentication & RBAC

#### One-to-One
- **users ↔ employees**: A user account can be linked to one employee record (optional)
- **users ↔ sessions**: Each session belongs to one user
- **password_reset_tokens ↔ users**: Each reset token belongs to one user

#### One-to-Many
- **organizations → users**: One organization has many users
- **organizations → roles**: One organization has many roles
- **users → sessions**: One user has many sessions
- **users → password_reset_tokens**: One user can have many reset tokens
- **roles → role_permissions**: One role has many permissions
- **roles → user_roles**: One role can be assigned to many users
- **users → user_roles**: One user can have many roles
- **permissions → role_permissions**: One permission can be assigned to many roles

#### Many-to-Many
- **users ↔ roles**: Via `user_roles` junction table
- **roles ↔ permissions**: Via `role_permissions` junction table

### 3.2 Organization Setup

#### One-to-One
- **departments ↔ locations**: A department can be assigned to one location (optional)

#### One-to-Many
- **organizations → departments**: One organization has many departments
- **organizations → employees**: One organization has many employees
- **organizations → asset_categories**: One organization has many asset categories
- **organizations → locations**: One organization has many locations
- **departments → departments**: Self-referencing for hierarchy (parent_id)
- **departments → employees**: One department has many employees
- **employees → employees**: Self-referencing for management hierarchy (manager_id)
- **asset_categories → asset_categories**: Self-referencing for hierarchy (parent_id)
- **locations → locations**: Self-referencing for hierarchy (parent_id)
- **locations → location_hierarchy**: One location has many hierarchy records

#### Many-to-Many
- **locations ↔ locations**: Via `location_hierarchy` closure table for ancestor/descendant queries

### 3.3 Asset Management

#### One-to-One
- **assets ↔ asset_specifications**: One asset has one specification record
- **assets ↔ asset_depreciation**: One asset has one depreciation record
- **asset_qr_codes ↔ assets**: One QR code belongs to one asset (1:1 unique)

#### One-to-Many
- **organizations → assets**: One organization has many assets
- **asset_categories → assets**: One category has many assets
- **locations → assets**: One location has many assets
- **employees → assets**: One employee can be assigned many assets (assigned_to)
- **departments → assets**: One department can be assigned many assets (assigned_department_id)
- **assets → asset_status_history**: One asset has many status history records
- **assets → asset_photos**: One asset has many photos
- **assets → asset_documents**: One asset has many documents
- **assets → asset_qr_codes**: One asset can have multiple QR codes over time
- **assets → asset_warranties**: One asset can have multiple warranties
- **assets → asset_specifications**: One asset has specifications
- **assets → asset_depreciation**: One asset has depreciation tracking

### 3.4 Asset Allocation

#### One-to-One
- **allocations ↔ assets**: One asset can have one active allocation (enforced by unique constraint)

#### One-to-Many
- **organizations → allocations**: One organization has many allocations
- **assets → allocations**: One asset can have many allocation records over time
- **employees → allocations**: One employee can have many allocations
- **departments → allocations**: One department can have many allocations
- **users → allocations**: One user can create many allocations
- **allocations → allocation_history**: One allocation has many history records
- **organizations → transfers**: One organization has many transfer requests
- **assets → transfers**: One asset can have many transfer requests
- **employees → transfers**: One employee can be involved in many transfers (from/to)
- **departments → transfers**: One department can be involved in many transfers (from/to)
- **transfers → transfer_approvals**: One transfer has many approval records
- **allocations → allocation_conflicts**: One allocation can have conflict records

#### Many-to-Many
- **transfers ↔ users**: Via `transfer_approvals` for approval workflow

### 3.5 Resource Booking

#### One-to-Many
- **organizations → bookable_resources**: One organization has many bookable resources
- **locations → bookable_resources**: One location can have many resources
- **bookable_resources → bookings**: One resource has many bookings
- **organizations → bookings**: One organization has many bookings
- **users → bookings**: One user can create many bookings
- **bookings → booking_history**: One booking has many history records
- **bookings → booking_attendees**: One booking has many attendees
- **bookable_resources → resource_availability**: One resource has many availability schedules
- **bookable_resources → booking_blackouts**: One resource has many blackout periods

#### Many-to-Many
- **bookings ↔ users**: Via `booking_attendees` for meeting attendees
- **bookings ↔ employees**: Via `booking_attendees` for employee attendees

### 3.6 Maintenance

#### One-to-Many
- **organizations → maintenance_requests**: One organization has many maintenance requests
- **assets → maintenance_requests**: One asset can have many maintenance requests
- **users → maintenance_requests**: One user can create many maintenance requests
- **maintenance_requests → maintenance_activities**: One request has many activity logs
- **maintenance_requests → maintenance_technicians**: One request can have many technicians assigned
- **organizations → vendors**: One organization has many vendors
- **maintenance_requests → vendors**: One request can be assigned to one vendor
- **vendors → maintenance_requests**: One vendor can handle many requests
- **organizations → maintenance_schedules**: One organization has many maintenance schedules
- **assets → maintenance_schedules**: One asset can have many maintenance schedules
- **maintenance_requests → maintenance_approvals**: One request has many approval records
- **maintenance_requests → maintenance_costs**: One request has many cost records

#### Many-to-Many
- **maintenance_requests ↔ users**: Via `maintenance_technicians` for technician assignments
- **maintenance_requests ↔ users**: Via `maintenance_approvals` for approval workflow

### 3.7 Audit

#### One-to-Many
- **organizations → audit_cycles**: One organization has many audit cycles
- **audit_cycles → audit_assignments**: One audit cycle has many auditor assignments
- **audit_cycles → audit_items**: One audit cycle has many audit items
- **audit_cycles → audit_history**: One audit cycle has many history records
- **audit_cycles → audit_checklists**: One organization can have many checklists
- **audit_items → audit_discrepancies**: One audit item can have many discrepancies
- **audit_checklists → audit_checklist_items**: One checklist has many items
- **users → audit_assignments**: One user can be assigned to many audit cycles
- **locations → audit_assignments**: One location can be assigned to many auditors
- **departments → audit_assignments**: One department can be assigned to many auditors
- **assets → audit_items**: One asset can be in many audit cycles
- **users → audit_items**: One user can be assigned many audit items
- **locations → audit_items**: One location can have many audit items

#### Many-to-Many
- **audit_cycles ↔ users**: Via `audit_assignments` for auditor assignments
- **audit_cycles ↔ locations**: Via `audit_assignments` for location assignments
- **audit_cycles ↔ departments**: Via `audit_assignments` for department assignments

### 3.8 Reports

#### One-to-Many
- **organizations → reports**: One organization has many saved reports
- **reports → report_schedules**: One report can have many schedules
- **reports → report_subscriptions**: One report can have many subscriptions
- **users → reports**: One user can create many reports
- **users → report_subscriptions**: One user can subscribe to many reports

#### Many-to-Many
- **reports ↔ users**: Via `report_subscriptions` for user subscriptions

### 3.9 Notifications

#### One-to-Many
- **organizations → notifications**: One organization has many notifications
- **organizations → notification_templates**: One organization has many notification templates
- **organizations → notification_rules**: One organization has many notification rules
- **users → notifications**: One user receives many notifications
- **users → notification_preferences**: One user has many preference records
- **notifications → notification_logs**: One notification has many delivery logs
- **notification_templates → notification_rules**: One template can be used by many rules

#### Many-to-Many
- **notifications ↔ users**: Direct relationship (user_id foreign key)

### 3.10 Activity Logs

#### One-to-Many
- **organizations → activity_logs**: One organization has many activity logs
- **users → activity_logs**: One user generates many activity logs
- **activity_logs → activity_log_details**: One activity log has many detail records

### 3.11 Dashboard

#### One-to-One
- **dashboard_configs ↔ users**: One user has one default dashboard configuration

#### One-to-Many
- **organizations → dashboard_widgets**: One organization has many widget definitions
- **users → dashboard_configs**: One user can have multiple dashboard configurations
- **organizations → kpi_metrics**: One organization has many KPI metric records

### 3.12 System

#### One-to-Many
- **organizations → settings**: One organization has many settings
- **organizations → feature_flags**: One organization has many feature flags
- **settings → settings**: Global settings (organization_id IS NULL)

---

## 4. Enums

### 4.1 Authentication & RBAC

#### UserRoleLevel
```sql
CREATE TYPE user_role_level AS ENUM (
    'super_admin',
    'org_admin',
    'department_admin',
    'manager',
    'supervisor',
    'employee',
    'viewer'
);
```

#### PermissionModule
```sql
CREATE TYPE permission_module AS ENUM (
    'assets',
    'allocations',
    'bookings',
    'maintenance',
    'audits',
    'reports',
    'users',
    'roles',
    'departments',
    'locations',
    'categories',
    'vendors',
    'notifications',
    'settings',
    'system'
);
```

#### PermissionAction
```sql
CREATE TYPE permission_action AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'approve',
    'reject',
    'export',
    'import',
    'manage'
);
```

#### SubscriptionPlan
```sql
CREATE TYPE subscription_plan AS ENUM (
    'basic',
    'professional',
    'enterprise',
    'custom'
);
```

#### SubscriptionStatus
```sql
CREATE TYPE subscription_status AS ENUM (
    'active',
    'trial',
    'past_due',
    'cancelled',
    'expired',
    'suspended'
);
```

### 4.2 Organization Setup

#### EmploymentStatus
```sql
CREATE TYPE employment_status AS ENUM (
    'active',
    'on_leave',
    'terminated',
    'resigned',
    'retired',
    'probation'
);
```

#### LocationType
```sql
CREATE TYPE location_type AS ENUM (
    'building',
    'floor',
    'room',
    'desk',
    'warehouse',
    'vehicle',
    'outdoor',
    'virtual'
);
```

#### DepreciationMethod
```sql
CREATE TYPE depreciation_method AS ENUM (
    'straight_line',
    'declining_balance',
    'units_of_production',
    'sum_of_years',
    'none'
);
```

### 4.3 Asset Management

#### AssetStatus
```sql
CREATE TYPE asset_status AS ENUM (
    'available',
    'allocated',
    'in_maintenance',
    'retired',
    'lost',
    'stolen',
    'damaged',
    'disposed',
    'in_transit',
    'reserved',
    'under_audit'
);
```

#### AssetCondition
```sql
CREATE TYPE asset_condition AS ENUM (
    'new',
    'excellent',
    'good',
    'fair',
    'poor',
    'damaged',
    'non_functional'
);
```

#### OwnershipType
```sql
CREATE TYPE ownership_type AS ENUM (
    'owned',
    'leased',
    'rented',
    'borrowed',
    'loaned'
);
```

#### DocumentType
```sql
CREATE TYPE document_type AS ENUM (
    'invoice',
    'receipt',
    'warranty',
    'manual',
    'certificate',
    'insurance',
    'license',
    'contract',
    'other'
);
```

### 4.4 Asset Allocation

#### AllocationStatus
```sql
CREATE TYPE allocation_status AS ENUM (
    'pending',
    'active',
    'returned',
    'cancelled',
    'expired',
    'overdue'
);
```

#### AllocationToType
```sql
CREATE TYPE allocation_to_type AS ENUM (
    'employee',
    'department',
    'project',
    'vendor'
);
```

#### TransferPriority
```sql
CREATE TYPE transfer_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);
```

#### TransferStatus
```sql
CREATE TYPE transfer_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'in_progress',
    'completed',
    'cancelled'
);
```

#### ConflictType
```sql
CREATE TYPE conflict_type AS ENUM (
    'double_allocation',
    'location_mismatch',
    'status_conflict',
    'quantity_conflict',
    'time_conflict'
);
```

### 4.5 Resource Booking

#### ResourceType
```sql
CREATE TYPE resource_type AS ENUM (
    'room',
    'equipment',
    'vehicle',
    'facility',
    'workspace'
);
```

#### BookingStatus
```sql
CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'no_show',
    'completed'
);
```

#### AttendeeStatus
```sql
CREATE TYPE attendee_status AS ENUM (
    'pending',
    'accepted',
    'declined',
    'tentative'
);
```

#### ScheduleType
```sql
CREATE TYPE schedule_type AS ENUM (
    'recurring',
    'one_time',
    'on_demand'
);
```

#### Frequency
```sql
CREATE TYPE frequency AS ENUM (
    'daily',
    'weekly',
    'bi_weekly',
    'monthly',
    'quarterly',
    'yearly',
    'custom'
);
```

### 4.6 Maintenance

#### MaintenancePriority
```sql
CREATE TYPE maintenance_priority AS ENUM (
    'low',
    'normal',
    'high',
    'critical',
    'emergency'
);
```

#### MaintenanceType
```sql
CREATE TYPE maintenance_type AS ENUM (
    'corrective',
    'preventive',
    'predictive',
    'emergency',
    'upgrade',
    'calibration'
);
```

#### MaintenanceStatus
```sql
CREATE TYPE maintenance_status AS ENUM (
    'pending',
    'assigned',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled',
    'rejected'
);
```

#### ActivityType
```sql
CREATE TYPE activity_type AS ENUM (
    'diagnosis',
    'repair',
    'replacement',
    'inspection',
    'cleaning',
    'calibration',
    'upgrade',
    'testing',
    'documentation'
);
```

#### TechnicianRole
```sql
CREATE TYPE technician_role AS ENUM (
    'lead_technician',
    'technician',
    'assistant',
    'contractor',
    'vendor'
);
```

#### CostType
```sql
CREATE TYPE cost_type AS ENUM (
    'labor',
    'parts',
    'materials',
    'travel',
    'equipment',
    'overhead',
    'other'
);
```

### 4.7 Audit

#### AuditType
```sql
CREATE TYPE audit_type AS ENUM (
    'physical',
    'digital',
    'hybrid',
    'spot_check',
    'full_inventory'
);
```

#### AuditStatus
```sql
CREATE TYPE audit_status AS ENUM (
    'planned',
    'in_progress',
    'paused',
    'completed',
    'cancelled',
    'locked'
);
```

#### AuditItemStatus
```sql
CREATE TYPE audit_item_status AS ENUM (
    'pending',
    'in_progress',
    'verified',
    'discrepancy',
    'skipped'
);
```

#### DiscrepancyType
```sql
CREATE TYPE discrepancy_type AS ENUM (
    'missing',
    'extra',
    'location_mismatch',
    'condition_mismatch',
    'tag_mismatch',
    'quantity_mismatch',
    'data_inaccuracy'
);
```

#### Severity
```sql
CREATE TYPE severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);
```

#### ResolutionStatus
```sql
CREATE TYPE resolution_status AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'escalated',
    'closed'
);
```

#### AuditorRole
```sql
CREATE TYPE auditor_role AS ENUM (
    'lead_auditor',
    'auditor',
    'observer',
    'supervisor'
);
```

#### ChecklistItemType
```sql
CREATE TYPE checklist_item_type AS ENUM (
    'checkbox',
    'text_input',
    'number_input',
    'date_input',
    'dropdown',
    'photo_upload',
    'signature'
);
```

### 4.8 Reports

#### ReportType
```sql
CREATE TYPE report_type AS ENUM (
    'asset_inventory',
    'allocation_summary',
    'maintenance_report',
    'audit_report',
    'utilization_report',
    'cost_report',
    'depreciation_report',
    'custom'
);
```

#### ReportFormat
```sql
CREATE TYPE report_format AS ENUM (
    'pdf',
    'excel',
    'csv',
    'html',
    'json'
);
```

### 4.9 Notifications

#### NotificationType
```sql
CREATE TYPE notification_type AS ENUM (
    'allocation',
    'transfer',
    'booking',
    'maintenance',
    'audit',
    'system',
    'reminder',
    'alert',
    'approval',
    'info'
);
```

#### NotificationPriority
```sql
CREATE TYPE notification_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);
```

#### NotificationChannel
```sql
CREATE TYPE notification_channel AS ENUM (
    'email',
    'push',
    'sms',
    'in_app',
    'webhook'
);
```

#### NotificationStatus
```sql
CREATE TYPE notification_status AS ENUM (
    'pending',
    'sent',
    'delivered',
    'failed',
    'cancelled'
);
```

#### DigestFrequency
```sql
CREATE TYPE digest_frequency AS ENUM (
    'immediate',
    'hourly',
    'daily',
    'weekly',
    'monthly'
);
```

### 4.10 Activity Logs

#### ActionType
```sql
CREATE TYPE action_type AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'export',
    'import',
    'approve',
    'reject',
    'assign',
    'transfer',
    'audit',
    'configure'
);
```

#### EntityType
```sql
CREATE TYPE entity_type AS ENUM (
    'asset',
    'allocation',
    'booking',
    'maintenance',
    'audit',
    'user',
    'role',
    'department',
    'location',
    'category',
    'vendor',
    'report',
    'notification',
    'setting'
);
```

### 4.11 Dashboard

#### WidgetType
```sql
CREATE TYPE widget_type AS ENUM (
    'chart',
    'metric_card',
    'table',
    'list',
    'calendar',
    'gauge',
    'heatmap',
    'timeline'
);
```

#### MetricType
```sql
CREATE TYPE metric_type AS ENUM (
    'count',
    'sum',
    'average',
    'percentage',
    'ratio',
    'duration'
);
```

### 4.12 System

#### LogLevel
```sql
CREATE TYPE log_level AS ENUM (
    'debug',
    'info',
    'warning',
    'error',
    'critical',
    'fatal'
);
```

#### SettingValueType
```sql
CREATE TYPE setting_value_type AS ENUM (
    'string',
    'number',
    'boolean',
    'json',
    'encrypted'
);
```

---

## 5. Performance Indexes

### 5.1 Authentication & RBAC

#### organizations
```sql
-- Organization lookup by slug (for subdomain routing)
CREATE INDEX idx_organizations_slug ON organizations(slug) WHERE is_active = TRUE;

-- Organization lookup by domain
CREATE INDEX idx_organizations_domain ON organizations(domain) WHERE domain IS NOT NULL;

-- Subscription status queries
CREATE INDEX idx_organizations_subscription_status ON organizations(subscription_status, subscription_end);
```

#### users
```sql
-- User authentication by email
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;

-- Organization user listing
CREATE INDEX idx_users_organization_id ON users(organization_id) WHERE deleted_at IS NULL;

-- Active users filter
CREATE INDEX idx_users_is_active ON users(organization_id, is_active) WHERE deleted_at IS NULL;

-- Employee lookup
CREATE INDEX idx_users_employee_id ON users(employee_id) WHERE employee_id IS NOT NULL;

-- Department users
CREATE INDEX idx_users_department_id ON users(department_id) WHERE department_id IS NOT NULL;

-- Last login tracking
CREATE INDEX idx_users_last_login_at ON users(last_login_at DESC);
```

#### roles
```sql
-- Role lookup by slug
CREATE INDEX idx_roles_slug ON roles(organization_id, slug) WHERE deleted_at IS NULL;

-- Role hierarchy queries
CREATE INDEX idx_roles_level ON roles(organization_id, level) WHERE deleted_at IS NULL;
```

#### permissions
```sql
-- Permission lookup by module
CREATE INDEX idx_permissions_module ON permissions(module, action);

-- Permission lookup by slug
CREATE INDEX idx_permissions_slug ON permissions(slug);
```

#### role_permissions
```sql
-- Junction table lookup
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
```

#### user_roles
```sql
-- User role lookup
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id) WHERE is_active = TRUE;

-- Expiring roles
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at) WHERE expires_at IS NOT NULL;
```

#### sessions
```sql
-- Session lookup by token
CREATE INDEX idx_sessions_token ON sessions(token);

-- Active sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id) WHERE is_active = TRUE;

-- Session cleanup
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at) WHERE is_active = TRUE;
```

#### password_reset_tokens
```sql
-- Token lookup
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Unused tokens cleanup
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at) WHERE used_at IS NULL;
```

### 5.2 Organization Setup

#### departments
```sql
-- Department lookup by code
CREATE INDEX idx_departments_code ON departments(organization_id, code) WHERE deleted_at IS NULL;

-- Hierarchy queries
CREATE INDEX idx_departments_parent_id ON departments(parent_id) WHERE parent_id IS NOT NULL;

-- Active departments
CREATE INDEX idx_departments_is_active ON departments(organization_id, is_active) WHERE deleted_at IS NULL;

-- Manager lookup
CREATE INDEX idx_departments_manager_id ON departments(manager_id) WHERE manager_id IS NOT NULL;
```

#### employees
```sql
-- Employee lookup by number
CREATE INDEX idx_employees_employee_number ON employees(organization_id, employee_number) WHERE deleted_at IS NULL;

-- Employee lookup by email
CREATE INDEX idx_employees_email ON employees(organization_id, email) WHERE deleted_at IS NULL;

-- Department employees
CREATE INDEX idx_employees_department_id ON employees(department_id) WHERE deleted_at IS NULL;

-- Management hierarchy
CREATE INDEX idx_employees_manager_id ON employees(manager_id) WHERE manager_id IS NOT NULL;

-- Location lookup
CREATE INDEX idx_employees_location_id ON employees(location_id) WHERE location_id IS NOT NULL;

-- Employment status
CREATE INDEX idx_employees_employment_status ON employees(organization_id, employment_status) WHERE deleted_at IS NULL;
```

#### asset_categories
```sql
-- Category lookup by code
CREATE INDEX idx Asset_categories_code ON asset_categories(organization_id, code) WHERE deleted_at IS NULL;

-- Hierarchy queries
CREATE INDEX idx_asset_categories_parent_id ON asset_categories(parent_id) WHERE parent_id IS NOT NULL;

-- Active categories
CREATE INDEX idx_asset_categories_is_active ON asset_categories(organization_id, is_active) WHERE deleted_at IS NULL;
```

#### locations
```sql
-- Location lookup by code
CREATE INDEX idx_locations_code ON locations(organization_id, code) WHERE deleted_at IS NULL;

-- Hierarchy queries
CREATE INDEX idx_locations_parent_id ON locations(parent_id) WHERE parent_id IS NOT NULL;

-- Location type filter
CREATE INDEX idx_locations_type ON locations(organization_id, type) WHERE deleted_at IS NULL;

-- Manager lookup
CREATE INDEX idx_locations_manager_id ON locations(manager_id) WHERE manager_id IS NOT NULL;
```

#### location_hierarchy
```sql
-- Ancestor queries (get all descendants)
CREATE INDEX idx_location_hierarchy_ancestor_id ON location_hierarchy(ancestor_id);

-- Descendant queries (get all ancestors)
CREATE INDEX idx_location_hierarchy_descendant_id ON location_hierarchy(descendant_id);

-- Depth-based queries
CREATE INDEX idx_location_hierarchy_depth ON location_hierarchy(depth);
```

### 5.3 Asset Management

#### assets
```sql
-- Asset lookup by tag
CREATE INDEX idx_assets_asset_tag ON assets(organization_id, asset_tag) WHERE deleted_at IS NULL;

-- Asset lookup by serial number
CREATE INDEX idx_assets_serial_number ON assets(organization_id, serial_number) WHERE serial_number IS NOT NULL;

-- Category filtering
CREATE INDEX idx_assets_category_id ON assets(organization_id, category_id) WHERE deleted_at IS NULL;

-- Location filtering
CREATE INDEX idx_assets_location_id ON assets(organization_id, location_id) WHERE deleted_at IS NULL;

-- Status filtering
CREATE INDEX idx_assets_status ON assets(organization_id, status) WHERE deleted_at IS NULL;

-- Assigned assets
CREATE INDEX idx_assets_assigned_to ON assets(organization_id, assigned_to) WHERE assigned_to IS NOT NULL;

-- Department assets
CREATE INDEX idx_assets_assigned_department_id ON assets(organization_id, assigned_department_id) WHERE assigned_department_id IS NOT NULL;

-- Bookable assets
CREATE INDEX idx_assets_is_bookable ON assets(organization_id, is_bookable) WHERE is_bookable = TRUE;

-- QR code lookup
CREATE INDEX idx_assets_qr_code ON assets(organization_id, qr_code) WHERE qr_code IS NOT NULL;

-- Barcode lookup
CREATE INDEX idx_assets_barcode ON assets(organization_id, barcode) WHERE barcode IS NOT NULL;

-- Purchase date range queries
CREATE INDEX idx_assets_purchase_date ON assets(organization_id, purchase_date) WHERE deleted_at IS NULL;

-- Warranty expiry alerts
CREATE INDEX idx_assets_warranty_expiry ON assets(warranty_expiry) WHERE warranty_expiry IS NOT NULL;

-- Next maintenance date
CREATE INDEX idx_assets_next_maintenance_date ON assets(next_maintenance_date) WHERE next_maintenance_date IS NOT NULL;
```

#### asset_status_history
```sql
-- Asset status timeline
CREATE INDEX idx_asset_status_history_asset_id ON asset_status_history(asset_id, changed_at DESC);

-- Status change queries
CREATE INDEX idx_asset_status_history_to_status ON asset_status_history(to_status, changed_at DESC);
```

#### asset_photos
```sql
-- Asset photos lookup
CREATE INDEX idx_asset_photos_asset_id ON asset_photos(asset_id);

-- Primary photo lookup
CREATE INDEX idx_asset_photos_is_primary ON asset_photos(asset_id) WHERE is_primary = TRUE;
```

#### asset_documents
```sql
-- Asset documents lookup
CREATE INDEX idx_asset_documents_asset_id ON asset_documents(asset_id);

-- Document type filter
CREATE INDEX idx_asset_documents_document_type ON asset_documents(document_type);
```

#### asset_qr_codes
```sql
-- QR code lookup
CREATE INDEX idx_asset_qr_codes_qr_code ON asset_qr_codes(qr_code) WHERE is_active = TRUE;

-- Active QR codes
CREATE INDEX idx_asset_qr_codes_asset_id ON asset_qr_codes(asset_id) WHERE is_active = TRUE;
```

#### asset_specifications
```sql
-- Asset specifications lookup
CREATE INDEX idx_asset_specifications_asset_id ON asset_specifications(asset_id);
```

#### asset_warranties
```sql
-- Asset warranties lookup
CREATE INDEX idx_asset_warranties_asset_id ON asset_warranties(asset_id);

-- Active warranties
CREATE INDEX idx_asset_warranties_is_active ON asset_warranties(asset_id) WHERE is_active = TRUE;

-- Warranty expiry
CREATE INDEX idx_asset_warranties_end_date ON asset_warranties(end_date) WHERE is_active = TRUE;
```

#### asset_depreciation
```sql
-- Asset depreciation lookup
CREATE INDEX idx_asset_depreciation_asset_id ON asset_depreciation(asset_id);

-- Last calculated tracking
CREATE INDEX idx_asset_depreciation_last_calculated_at ON asset_depreciation(last_calculated_at);
```

### 5.4 Asset Allocation

#### allocations
```sql
-- Organization allocations
CREATE INDEX idx_allocations_organization_id ON allocations(organization_id) WHERE deleted_at IS NULL;

-- Asset allocations
CREATE INDEX idx_allocations_asset_id ON allocations(asset_id) WHERE deleted_at IS NULL;

-- Employee allocations
CREATE INDEX idx_allocations_allocated_to_employee_id ON allocations(allocated_to_employee_id) WHERE allocated_to_employee_id IS NOT NULL;

-- Department allocations
CREATE INDEX idx_allocations_allocated_to_department_id ON allocations(allocated_to_department_id) WHERE allocated_to_department_id IS NOT NULL;

-- Active allocations
CREATE INDEX idx_allocations_status ON allocations(organization_id, status) WHERE status = 'active';

-- Unique active allocation per asset (partial unique index)
CREATE UNIQUE INDEX uq_allocations_asset_active ON allocations(asset_id) WHERE status = 'active';

-- Return date tracking
CREATE INDEX idx_allocations_expected_return_date ON allocations(expected_return_date) WHERE status = 'active';

-- Overdue allocations
CREATE INDEX idx_allocations_overdue ON allocations(expected_return_date, status) WHERE status = 'active';
```

#### allocation_history
```sql
-- Allocation history lookup
CREATE INDEX idx_allocation_history_allocation_id ON allocation_history(allocation_id, performed_at DESC);
```

#### transfers
```sql
-- Organization transfers
CREATE INDEX idx_transfers_organization_id ON transfers(organization_id) WHERE deleted_at IS NULL;

-- Asset transfers
CREATE INDEX idx_transfers_asset_id ON transfers(asset_id) WHERE deleted_at IS NULL;

-- From employee transfers
CREATE INDEX idx_transfers_from_employee_id ON transfers(from_employee_id) WHERE from_employee_id IS NOT NULL;

-- To employee transfers
CREATE INDEX idx_transfers_to_employee_id ON transfers(to_employee_id) WHERE to_employee_id IS NOT NULL;

-- Status filtering
CREATE INDEX idx_transfers_status ON transfers(organization_id, status) WHERE deleted_at IS NULL;

-- Priority filtering
CREATE INDEX idx_transfers_priority ON transfers(organization_id, priority, status) WHERE deleted_at IS NULL;

-- Requested by user
CREATE INDEX idx_transfers_requested_by ON transfers(requested_by) WHERE deleted_at IS NULL;
```

#### transfer_approvals
```sql
-- Transfer approvals lookup
CREATE INDEX idx_transfer_approvals_transfer_id ON transfer_approvals(transfer_id);

-- Approver lookup
CREATE INDEX idx_transfer_approvals_approver_id ON transfer_approvals(approver_id);

-- Status filtering
CREATE INDEX idx_transfer_approvals_status ON transfer_approvals(status);
```

#### allocation_conflicts
```sql
-- Asset conflicts
CREATE INDEX idx_allocation_conflicts_asset_id ON allocation_conflicts(asset_id);

-- Unresolved conflicts
CREATE INDEX idx_allocation_conflicts_status ON allocation_conflicts(status) WHERE status = 'unresolved';
```

### 5.5 Resource Booking

#### bookable_resources
```sql
-- Resource lookup by code
CREATE INDEX idx_bookable_resources_code ON bookable_resources(organization_id, code) WHERE deleted_at IS NULL;

-- Location resources
CREATE INDEX idx_bookable_resources_location_id ON bookable_resources(location_id) WHERE deleted_at IS NULL;

-- Resource type filter
CREATE INDEX idx_bookable_resources_type ON bookable_resources(organization_id, type) WHERE deleted_at IS NULL;

-- Active resources
CREATE INDEX idx_bookable_resources_is_active ON bookable_resources(organization_id, is_active) WHERE deleted_at IS NULL;
```

#### bookings
```sql
-- Organization bookings
CREATE INDEX idx_bookings_organization_id ON bookings(organization_id) WHERE deleted_at IS NULL;

-- Resource bookings
CREATE INDEX idx_bookings_resource_id ON bookings(resource_id) WHERE deleted_at IS NULL;

-- User bookings
CREATE INDEX idx_bookings_booked_by ON bookings(booked_by) WHERE deleted_at IS NULL;

-- Time range queries (for availability checking)
CREATE INDEX idx_bookings_resource_time ON bookings(resource_id, start_datetime, end_datetime) WHERE deleted_at IS NULL;

-- Status filtering
CREATE INDEX idx_bookings_status ON bookings(organization_id, status) WHERE deleted_at IS NULL;

-- Upcoming bookings
CREATE INDEX idx_bookings_start_datetime ON bookings(start_datetime) WHERE status = 'confirmed';

-- Check-in/out tracking
CREATE INDEX idx_bookings_checked_in_at ON bookings(checked_in_at) WHERE checked_in_at IS NOT NULL;
```

#### booking_history
```sql
-- Booking history lookup
CREATE INDEX idx_booking_history_booking_id ON booking_history(booking_id, performed_at DESC);
```

#### booking_attendees
```sql
-- Booking attendees lookup
CREATE INDEX idx_booking_attendees_booking_id ON booking_attendees(booking_id);

-- User attendee lookup
CREATE INDEX idx_booking_attendees_user_id ON booking_attendees(user_id);

-- Employee attendee lookup
CREATE INDEX idx_booking_attendees_employee_id ON booking_attendees(employee_id);

-- Email attendee lookup
CREATE INDEX idx_booking_attendees_email ON booking_attendees(email);

-- Status filtering
CREATE INDEX idx_booking_attendees_status ON booking_attendees(status);
```

#### resource_availability
```sql
-- Resource availability lookup
CREATE INDEX idx_resource_availability_resource_id ON resource_availability(resource_id);

-- Day of week lookup
CREATE INDEX idx_resource_availability_day_of_week ON resource_availability(day_of_week, is_available);
```

#### booking_blackouts
```sql
-- Resource blackouts lookup
CREATE INDEX idx_booking_blackouts_resource_id ON booking_blackouts(resource_id);

-- Time range queries
CREATE INDEX idx_booking_blackouts_time ON booking_blackouts(resource_id, start_datetime, end_datetime);
```

### 5.6 Maintenance

#### maintenance_requests
```sql
-- Request lookup by number
CREATE INDEX idx_maintenance_requests_request_number ON maintenance_requests(organization_id, request_number) WHERE deleted_at IS NULL;

-- Organization requests
CREATE INDEX idx_maintenance_requests_organization_id ON maintenance_requests(organization_id) WHERE deleted_at IS NULL;

-- Asset requests
CREATE INDEX idx_maintenance_requests_asset_id ON maintenance_requests(asset_id) WHERE deleted_at IS NULL;

-- Assigned technician
CREATE INDEX idx_maintenance_requests_assigned_to ON maintenance_requests(assigned_to) WHERE assigned_to IS NOT NULL;

-- Requested by user
CREATE INDEX idx_maintenance_requests_requested_by ON maintenance_requests(requested_by) WHERE deleted_at IS NULL;

-- Status filtering
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(organization_id, status) WHERE deleted_at IS NULL;

-- Priority filtering
CREATE INDEX idx_maintenance_requests_priority ON maintenance_requests(organization_id, priority, status) WHERE deleted_at IS NULL;

-- Type filtering
CREATE INDEX idx_maintenance_requests_type ON maintenance_requests(organization_id, type) WHERE deleted_at IS NULL;

-- Target completion date
CREATE INDEX idx_maintenance_requests_target_completion_date ON maintenance_requests(target_completion_date) WHERE status NOT IN ('completed', 'cancelled');

-- Vendor lookup
CREATE INDEX idx_maintenance_requests_vendor_id ON maintenance_requests(vendor_id) WHERE vendor_id IS NOT NULL;
```

#### maintenance_activities
```sql
-- Request activities lookup
CREATE INDEX idx_maintenance_activities_maintenance_request_id ON maintenance_activities(maintenance_request_id, performed_at DESC);

-- Activity type filter
CREATE INDEX idx_maintenance_activities_activity_type ON maintenance_activities(activity_type);
```

#### maintenance_technicians
```sql
-- Request technicians lookup
CREATE INDEX idx_maintenance_technicians_maintenance_request_id ON maintenance_technicians(maintenance_request_id);

-- User technician lookup
CREATE INDEX idx_maintenance_technicians_user_id ON maintenance_technicians(user_id);

-- Primary technician lookup
CREATE INDEX idx_maintenance_technicians_is_primary ON maintenance_technicians(maintenance_request_id) WHERE is_primary = TRUE;
```

#### vendors
```sql
-- Vendor lookup by code
CREATE INDEX idx_vendors_code ON vendors(organization_id, code) WHERE deleted_at IS NULL;

-- Active vendors
CREATE INDEX idx_vendors_is_active ON vendors(organization_id, is_active) WHERE deleted_at IS NULL;

-- Rating filter
CREATE INDEX idx_vendors_rating ON vendors(rating) WHERE rating IS NOT NULL;
```

#### maintenance_schedules
```sql
-- Organization schedules
CREATE INDEX idx_maintenance_schedules_organization_id ON maintenance_schedules(organization_id) WHERE deleted_at IS NULL;

-- Asset schedules
CREATE INDEX idx_maintenance_schedules_asset_id ON maintenance_schedules(asset_id) WHERE deleted_at IS NULL;

-- Active schedules
CREATE INDEX idx_maintenance_schedules_is_active ON maintenance_schedules(organization_id, is_active) WHERE deleted_at IS NULL;

-- Next due date
CREATE INDEX idx_maintenance_schedules_next_due_date ON maintenance_schedules(next_due_date) WHERE is_active = TRUE;

-- Assigned to
CREATE INDEX idx_maintenance_schedules_assigned_to ON maintenance_schedules(assigned_to) WHERE assigned_to IS NOT NULL;
```

#### maintenance_approvals
```sql
-- Request approvals lookup
CREATE INDEX idx_maintenance_approvals_maintenance_request_id ON maintenance_approvals(maintenance_request_id);

-- Approver lookup
CREATE INDEX idx_maintenance_approvals_approver_id ON maintenance_approvals(approver_id);

-- Status filtering
CREATE INDEX idx_maintenance_approvals_status ON maintenance_approvals(status);
```

#### maintenance_costs
```sql
-- Request costs lookup
CREATE INDEX idx_maintenance_costs_maintenance_request_id ON maintenance_costs(maintenance_request_id);

-- Cost type filter
CREATE INDEX idx_maintenance_costs_cost_type ON maintenance_costs(cost_type);

-- Vendor lookup
CREATE INDEX idx_maintenance_costs_vendor_id ON maintenance_costs(vendor_id) WHERE vendor_id IS NOT NULL;

-- Incurred date
CREATE INDEX idx_maintenance_costs_incurred_at ON maintenance_costs(incurred_at);
```

### 5.7 Audit

#### audit_cycles
```sql
-- Cycle lookup by code
CREATE INDEX idx_audit_cycles_code ON audit_cycles(organization_id, code) WHERE deleted_at IS NULL;

-- Organization cycles
CREATE INDEX idx_audit_cycles_organization_id ON audit_cycles(organization_id) WHERE deleted_at IS NULL;

-- Status filtering
CREATE INDEX idx_audit_cycles_status ON audit_cycles(organization_id, status) WHERE deleted_at IS NULL;

-- Date range queries
CREATE INDEX idx_audit_cycles_dates ON audit_cycles(organization_id, start_date, end_date) WHERE deleted_at IS NULL;

-- Lead auditor lookup
CREATE INDEX idx_audit_cycles_lead_auditor_id ON audit_cycles(lead_auditor_id) WHERE lead_auditor_id IS NOT NULL;

-- Checklist lookup
CREATE INDEX idx_audit_cycles_checklist_id ON audit_cycles(checklist_id) WHERE checklist_id IS NOT NULL;
```

#### audit_assignments
```sql
-- Cycle assignments lookup
CREATE INDEX idx_audit_assignments_audit_cycle_id ON audit_assignments(audit_cycle_id);

-- User assignments lookup
CREATE INDEX idx_audit_assignments_user_id ON audit_assignments(user_id);

-- Location assignments
CREATE INDEX idx_audit_assignments_assigned_location_id ON audit_assignments(assigned_location_id) WHERE assigned_location_id IS NOT NULL;

-- Department assignments
CREATE INDEX idx_audit_assignments_assigned_department_id ON audit_assignments(assigned_department_id) WHERE assigned_department_id IS NOT NULL;

-- Role filter
CREATE INDEX idx_audit_assignments_role ON audit_assignments(role);
```

#### audit_items
```sql
-- Cycle items lookup
CREATE INDEX idx_audit_items_audit_cycle_id ON audit_items(audit_cycle_id);

-- Asset lookup
CREATE INDEX idx_audit_items_asset_id ON audit_items(asset_id);

-- Assigned auditor
CREATE INDEX idx_audit_items_assigned_auditor_id ON audit_items(assigned_auditor_id) WHERE assigned_auditor_id IS NOT NULL;

-- Expected location
CREATE INDEX idx_audit_items_expected_location_id ON audit_items(expected_location_id) WHERE expected_location_id IS NOT NULL;

-- Status filtering
CREATE INDEX idx_audit_items_status ON audit_items(audit_cycle_id, status);

-- Discrepancy filter
CREATE INDEX idx_audit_items_has_discrepancy ON audit_items(has_discrepancy) WHERE has_discrepancy = TRUE;
```

#### audit_discrepancies
```sql
-- Item discrepancies lookup
CREATE INDEX idx_audit_discrepancies_audit_item_id ON audit_discrepancies(audit_item_id);

-- Discrepancy type filter
CREATE INDEX idx_audit_discrepancies_discrepancy_type ON audit_discrepancies(discrepancy_type);

-- Severity filter
CREATE INDEX idx_audit_discrepancies_severity ON audit_discrepancies(severity);

-- Resolution status
CREATE INDEX idx_audit_discrepancies_resolution_status ON audit_discrepancies(resolution_status) WHERE resolution_status != 'closed';
```

#### audit_history
```sql
-- Cycle history lookup
CREATE INDEX idx_audit_history_audit_cycle_id ON audit_history(audit_cycle_id, performed_at DESC);
```

#### audit_checklists
```sql
-- Checklist lookup by code
CREATE INDEX idx_audit_checklists_code ON audit_checklists(organization_id, code) WHERE deleted_at IS NULL;

-- Organization checklists
CREATE INDEX idx_audit_checklists_organization_id ON audit_checklists(organization_id) WHERE deleted_at IS NULL;

-- Active checklists
CREATE INDEX idx_audit_checklists_is_active ON audit_checklists(organization_id, is_active) WHERE deleted_at IS NULL;

-- Category filter
CREATE INDEX idx_audit_checklists_category_id ON audit_checklists(category_id) WHERE category_id IS NOT NULL;
```

#### audit_checklist_items
```sql
-- Checklist items lookup
CREATE INDEX idx_audit_checklist_items_checklist_id ON audit_checklist_items(checklist_id);

-- Order filter
CREATE INDEX idx_audit_checklist_items_order ON audit_checklist_items(checklist_id, order);
```

### 5.8 Reports

#### reports
```sql
-- Report lookup by slug
CREATE INDEX idx_reports_slug ON reports(organization_id, slug) WHERE deleted_at IS NULL;

-- Organization reports
CREATE INDEX idx_reports_organization_id ON reports(organization_id) WHERE deleted_at IS NULL;

-- Report type filter
CREATE INDEX idx_reports_report_type ON reports(organization_id, report_type) WHERE deleted_at IS NULL;

-- Public reports
CREATE INDEX idx_reports_is_public ON reports(organization_id, is_public) WHERE is_public = TRUE;

-- System reports
CREATE INDEX idx_reports_is_system ON reports(is_system) WHERE is_system = TRUE;
```

#### report_schedules
```sql
-- Report schedules lookup
CREATE INDEX idx_report_schedules_report_id ON report_schedules(report_id);

-- Active schedules
CREATE INDEX idx_report_schedules_is_active ON report_schedules(is_active) WHERE is_active = TRUE;

-- Next run time
CREATE INDEX idx_report_schedules_next_run_at ON report_schedules(next_run_at) WHERE is_active = TRUE;
```

#### report_subscriptions
```sql
-- Report subscriptions lookup
CREATE INDEX idx_report_subscriptions_report_id ON report_subscriptions(report_id);

-- User subscriptions
CREATE INDEX idx_report_subscriptions_user_id ON report_subscriptions(user_id);

-- Active subscriptions
CREATE INDEX idx_report_subscriptions_is_active ON report_subscriptions(is_active) WHERE is_active = TRUE;
```

### 5.9 Notifications

#### notifications
```sql
-- Organization notifications
CREATE INDEX idx_notifications_organization_id ON notifications(organization_id);

-- User notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Type filter
CREATE INDEX idx_notifications_type ON notifications(organization_id, type);

-- Priority filter
CREATE INDEX idx_notifications_priority ON notifications(user_id, priority) WHERE is_read = FALSE;

-- Read status filter
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Expiry cleanup
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Related entity lookup
CREATE INDEX idx_notifications_related_entity ON notifications(related_entity_type, related_entity_id) WHERE related_entity_id IS NOT NULL;
```

#### notification_templates
```sql
-- Template lookup by slug
CREATE INDEX idx_notification_templates_slug ON notification_templates(organization_id, slug) WHERE deleted_at IS NULL;

-- Organization templates
CREATE INDEX idx_notification_templates_organization_id ON notification_templates(organization_id) WHERE deleted_at IS NULL;

-- Type filter
CREATE INDEX idx_notification_templates_type ON notification_templates(organization_id, type) WHERE deleted_at IS NULL;

-- Active templates
CREATE INDEX idx_notification_templates_is_active ON notification_templates(organization_id, is_active) WHERE deleted_at IS NULL;
```

#### notification_preferences
```sql
-- User preferences lookup
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Type filter
CREATE INDEX idx_notification_preferences_notification_type ON notification_preferences(user_id, notification_type);
```

#### notification_rules
```sql
-- Organization rules
CREATE INDEX idx_notification_rules_organization_id ON notification_rules(organization_id) WHERE deleted_at IS NULL;

-- Active rules
CREATE INDEX idx_notification_rules_is_active ON notification_rules(organization_id, is_active) WHERE deleted_at IS NULL;

-- Trigger event filter
CREATE INDEX idx_notification_rules_trigger_event ON notification_rules(trigger_event) WHERE is_active = TRUE;
```

#### notification_logs
```sql
-- Notification logs lookup
CREATE INDEX idx_notification_logs_notification_id ON notification_logs(notification_id);

-- Channel filter
CREATE INDEX idx_notification_logs_channel ON notification_logs(channel);

-- Status filter
CREATE INDEX idx_notification_logs_status ON notification_logs(status) WHERE status = 'failed';

-- Retry tracking
CREATE INDEX idx_notification_logs_retry_count ON notification_logs(retry_count) WHERE status = 'failed';
```

### 5.10 Activity Logs

#### activity_logs
```sql
-- Organization activity logs
CREATE INDEX idx_activity_logs_organization_id ON activity_logs(organization_id);

-- User activity logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id) WHERE user_id IS NOT NULL;

-- Action filter
CREATE INDEX idx_activity_logs_action ON activity_logs(organization_id, action);

-- Entity lookup
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id) WHERE entity_id IS NOT NULL;

-- Date range queries
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

#### activity_log_details
```sql
-- Activity log details lookup
CREATE INDEX idx_activity_log_details_activity_log_id ON activity_log_details(activity_log_id);
```

### 5.11 Dashboard

#### dashboard_configs
```sql
-- User dashboard configs
CREATE INDEX idx_dashboard_configs_user_id ON dashboard_configs(user_id);

-- Default config lookup
CREATE INDEX idx_dashboard_configs_is_default ON dashboard_configs(user_id) WHERE is_default = TRUE;
```

#### dashboard_widgets
```sql
-- Widget lookup by slug
CREATE INDEX idx_dashboard_widgets_slug ON dashboard_widgets(organization_id, slug) WHERE deleted_at IS NULL;

-- Organization widgets
CREATE INDEX idx_dashboard_widgets_organization_id ON dashboard_widgets(organization_id) WHERE deleted_at IS NULL;

-- Active widgets
CREATE INDEX idx_dashboard_widgets_is_active ON dashboard_widgets(organization_id, is_active) WHERE deleted_at IS NULL;

-- Widget type filter
CREATE INDEX idx_dashboard_widgets_widget_type ON dashboard_widgets(organization_id, widget_type) WHERE deleted_at IS NULL;
```

#### kpi_metrics
```sql
-- Organization metrics
CREATE INDEX idx_kpi_metrics_organization_id ON kpi_metrics(organization_id);

-- Metric name lookup
CREATE INDEX idx_kpi_metrics_metric_name ON kpi_metrics(organization_id, metric_name);

-- Period range queries
CREATE INDEX idx_kpi_metrics_period ON kpi_metrics(organization_id, period_start, period_end);
```

### 5.12 System

#### settings
```sql
-- Organization settings
CREATE INDEX idx_settings_organization_id ON settings(organization_id) WHERE organization_id IS NOT NULL;

-- Global settings
CREATE INDEX idx_settings_global ON settings(key) WHERE organization_id IS NULL;

-- Key lookup
CREATE INDEX idx_settings_key ON settings(organization_id, key);
```

#### feature_flags
```sql
-- Organization feature flags
CREATE INDEX idx_feature_flags_organization_id ON feature_flags(organization_id) WHERE organization_id IS NOT NULL;

-- Global feature flags
CREATE INDEX idx_feature_flags_global ON feature_flags(feature_name) WHERE organization_id IS NULL;

-- Feature name lookup
CREATE INDEX idx_feature_flags_feature_name ON feature_flags(organization_id, feature_name);

-- Enabled flags
CREATE INDEX idx_feature_flags_is_enabled ON feature_flags(organization_id, is_enabled) WHERE is_enabled = TRUE;
```

#### system_logs
```sql
-- Level filter
CREATE INDEX idx_system_logs_level ON system_logs(level);

-- Service filter
CREATE INDEX idx_system_logs_service ON system_logs(service) WHERE service IS NOT NULL;

-- Trace ID lookup
CREATE INDEX idx_system_logs_trace_id ON system_logs(trace_id) WHERE trace_id IS NOT NULL;

-- Date range queries
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);

-- Error logs
CREATE INDEX idx_system_logs_errors ON system_logs(level, created_at) WHERE level IN ('error', 'critical', 'fatal');
```


---

## 6. Constraints

### 6.1 Unique Constraints

#### Authentication & RBAC
```sql
ALTER TABLE organizations ADD CONSTRAINT uq_organizations_slug UNIQUE (slug);
ALTER TABLE organizations ADD CONSTRAINT uq_organizations_domain UNIQUE (domain) WHERE domain IS NOT NULL;
ALTER TABLE organizations ADD CONSTRAINT uq_organizations_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT uq_users_org_email UNIQUE (organization_id, email);
ALTER TABLE roles ADD CONSTRAINT uq_roles_org_slug UNIQUE (organization_id, slug);
ALTER TABLE permissions ADD CONSTRAINT uq_permissions_slug UNIQUE (slug);
ALTER TABLE role_permissions ADD CONSTRAINT uq_role_permissions UNIQUE (role_id, permission_id);
ALTER TABLE user_roles ADD CONSTRAINT uq_user_roles UNIQUE (user_id, role_id);
ALTER TABLE sessions ADD CONSTRAINT uq_sessions_token UNIQUE (token);
ALTER TABLE password_reset_tokens ADD CONSTRAINT uq_password_reset_tokens_token UNIQUE (token);
```

#### Organization Setup
```sql
ALTER TABLE departments ADD CONSTRAINT uq_departments_org_code UNIQUE (organization_id, code);
ALTER TABLE employees ADD CONSTRAINT uq_employees_org_number UNIQUE (organization_id, employee_number);
ALTER TABLE employees ADD CONSTRAINT uq_employees_org_email UNIQUE (organization_id, email);
ALTER TABLE asset_categories ADD CONSTRAINT uq_asset_categories_org_code UNIQUE (organization_id, code);
ALTER TABLE locations ADD CONSTRAINT uq_locations_org_code UNIQUE (organization_id, code);
ALTER TABLE location_hierarchy ADD CONSTRAINT uq_location_hierarchy UNIQUE (ancestor_id, descendant_id);
```

#### Asset Management
```sql
ALTER TABLE assets ADD CONSTRAINT uq_assets_org_tag UNIQUE (organization_id, asset_tag);
ALTER TABLE assets ADD CONSTRAINT uq_assets_org_serial UNIQUE (organization_id, serial_number) WHERE serial_number IS NOT NULL;
ALTER TABLE assets ADD CONSTRAINT uq_assets_org_qr UNIQUE (organization_id, qr_code) WHERE qr_code IS NOT NULL;
ALTER TABLE assets ADD CONSTRAINT uq_assets_org_barcode UNIQUE (organization_id, barcode) WHERE barcode IS NOT NULL;
ALTER TABLE asset_qr_codes ADD CONSTRAINT uq_asset_qr_codes_asset UNIQUE (asset_id);
ALTER TABLE asset_qr_codes ADD CONSTRAINT uq_asset_qr_codes_qr UNIQUE (qr_code);
ALTER TABLE asset_specifications ADD CONSTRAINT uq_asset_specifications_asset UNIQUE (asset_id);
ALTER TABLE asset_depreciation ADD CONSTRAINT uq_asset_depreciation_asset UNIQUE (asset_id);
```

#### Asset Allocation
```sql
ALTER TABLE allocations ADD CONSTRAINT uq_allocations_asset_active UNIQUE (asset_id) WHERE status = 'active';
ALTER TABLE transfer_approvals ADD CONSTRAINT uq_transfer_approvals UNIQUE (transfer_id, approver_id);
```

#### Resource Booking
```sql
ALTER TABLE bookable_resources ADD CONSTRAINT uq_bookable_resources_org_code UNIQUE (organization_id, code);
ALTER TABLE bookings ADD CONSTRAINT uq_bookings_resource_time UNIQUE (resource_id, start_datetime, end_datetime) WHERE deleted_at IS NULL;
ALTER TABLE resource_availability ADD CONSTRAINT uq_resource_availability UNIQUE (resource_id, day_of_week, start_time);
ALTER TABLE booking_attendees ADD CONSTRAINT uq_booking_attendees_user UNIQUE (booking_id, user_id) WHERE user_id IS NOT NULL;
ALTER TABLE booking_attendees ADD CONSTRAINT uq_booking_attendees_employee UNIQUE (booking_id, employee_id) WHERE employee_id IS NOT NULL;
ALTER TABLE booking_attendees ADD CONSTRAINT uq_booking_attendees_email UNIQUE (booking_id, email) WHERE email IS NOT NULL;
```

#### Maintenance
```sql
ALTER TABLE maintenance_requests ADD CONSTRAINT uq_maintenance_requests_org_number UNIQUE (organization_id, request_number);
ALTER TABLE vendors ADD CONSTRAINT uq_vendors_org_code UNIQUE (organization_id, code);
ALTER TABLE maintenance_approvals ADD CONSTRAINT uq_maintenance_approvals UNIQUE (maintenance_request_id, approver_id);
ALTER TABLE maintenance_technicians ADD CONSTRAINT uq_maintenance_technicians UNIQUE (maintenance_request_id, user_id);
```

#### Audit
```sql
ALTER TABLE audit_cycles ADD CONSTRAINT uq_audit_cycles_org_code UNIQUE (organization_id, code);
ALTER TABLE audit_assignments ADD CONSTRAINT uq_audit_assignments UNIQUE (audit_cycle_id, user_id);
ALTER TABLE audit_items ADD CONSTRAINT uq_audit_items UNIQUE (audit_cycle_id, asset_id);
ALTER TABLE audit_checklists ADD CONSTRAINT uq_audit_checklists_org_code UNIQUE (organization_id, code);
```

#### Reports
```sql
ALTER TABLE reports ADD CONSTRAINT uq_reports_org_slug UNIQUE (organization_id, slug);
ALTER TABLE report_subscriptions ADD CONSTRAINT uq_report_subscriptions UNIQUE (report_id, user_id);
```

#### Notifications
```sql
ALTER TABLE notification_templates ADD CONSTRAINT uq_notification_templates_org_slug UNIQUE (organization_id, slug);
ALTER TABLE notification_preferences ADD CONSTRAINT uq_notification_preferences UNIQUE (user_id, notification_type);
```

#### Dashboard
```sql
ALTER TABLE dashboard_configs ADD CONSTRAINT uq_dashboard_configs_user UNIQUE (user_id);
ALTER TABLE dashboard_widgets ADD CONSTRAINT uq_dashboard_widgets_org_slug UNIQUE (organization_id, slug);
ALTER TABLE kpi_metrics ADD CONSTRAINT uq_kpi_metrics UNIQUE (organization_id, metric_name, period_start, period_end);
```

#### System
```sql
ALTER TABLE settings ADD CONSTRAINT uq_settings_org_key UNIQUE (organization_id, key);
ALTER TABLE settings ADD CONSTRAINT uq_settings_global_key UNIQUE (key) WHERE organization_id IS NULL;
ALTER TABLE feature_flags ADD CONSTRAINT uq_feature_flags_org_name UNIQUE (organization_id, feature_name);
ALTER TABLE feature_flags ADD CONSTRAINT uq_feature_flags_global_name UNIQUE (feature_name) WHERE organization_id IS NULL;
```

### 6.2 Check Constraints

#### Authentication & RBAC
```sql
ALTER TABLE organizations ADD CONSTRAINT chk_organizations_max_users_positive CHECK (max_users > 0);
ALTER TABLE organizations ADD CONSTRAINT chk_organizations_max_assets_positive CHECK (max_assets > 0);
ALTER TABLE organizations ADD CONSTRAINT chk_organizations_subscription_end_after_start CHECK (subscription_end IS NULL OR subscription_end >= subscription_start);
ALTER TABLE users ADD CONSTRAINT chk_users_failed_login_attempts CHECK (failed_login_attempts >= 0);
ALTER TABLE users ADD CONSTRAINT chk_users_locked_until_future CHECK (locked_until IS NULL OR locked_until >= NOW());
ALTER TABLE roles ADD CONSTRAINT chk_roles_level_non_negative CHECK (level >= 0);
ALTER TABLE sessions ADD CONSTRAINT chk_sessions_expires_after_last_activity CHECK (expires_at >= last_activity);
```

#### Organization Setup
```sql
ALTER TABLE departments ADD CONSTRAINT chk_departments_employee_count_non_negative CHECK (employee_count >= 0);
ALTER TABLE departments ADD CONSTRAINT chk_departments_level_non_negative CHECK (level >= 0);
ALTER TABLE departments ADD CONSTRAINT chk_departments_budget_positive CHECK (budget IS NULL OR budget >= 0);
ALTER TABLE employees ADD CONSTRAINT chk_employees_termination_after_hire CHECK (termination_date IS NULL OR termination_date >= hire_date);
ALTER TABLE asset_categories ADD CONSTRAINT chk_asset_categories_depreciation_rate CHECK (depreciation_rate IS NULL OR (depreciation_rate >= 0 AND depreciation_rate <= 100));
ALTER TABLE asset_categories ADD CONSTRAINT chk_asset_categories_useful_life_positive CHECK (useful_life_years IS NULL OR useful_life_years > 0);
ALTER TABLE asset_categories ADD CONSTRAINT chk_asset_categories_maintenance_interval_positive CHECK (maintenance_interval_days IS NULL OR maintenance_interval_days > 0);
ALTER TABLE locations ADD CONSTRAINT chk_locations_capacity_positive CHECK (capacity IS NULL OR capacity > 0);
ALTER TABLE locations ADD CONSTRAINT chk_locations_level_non_negative CHECK (level >= 0);
```

#### Asset Management
```sql
ALTER TABLE assets ADD CONSTRAINT chk_assets_purchase_cost_positive CHECK (purchase_cost IS NULL OR purchase_cost >= 0);
ALTER TABLE assets ADD CONSTRAINT chk_assets_current_value_positive CHECK (current_value IS NULL OR current_value >= 0);
ALTER TABLE assets ADD CONSTRAINT chk_assets_expected_return_after_allocation CHECK (expected_return_date IS NULL OR expected_return_date >= allocation_date);
ALTER TABLE assets ADD CONSTRAINT chk_assets_warranty_after_purchase CHECK (warranty_expiry IS NULL OR warranty_expiry >= purchase_date);
ALTER TABLE assets ADD CONSTRAINT chk_assets_next_maintenance_after_last CHECK (next_maintenance_date IS NULL OR last_maintenance_date IS NULL OR next_maintenance_date >= last_maintenance_date);
ALTER TABLE asset_photos ADD CONSTRAINT chk_asset_photos_file_size_positive CHECK (file_size IS NULL OR file_size > 0);
ALTER TABLE asset_documents ADD CONSTRAINT chk_asset_documents_file_size_positive CHECK (file_size IS NULL OR file_size > 0);
ALTER TABLE asset_qr_codes ADD CONSTRAINT chk_asset_qr_codes_scan_count_non_negative CHECK (scan_count >= 0);
ALTER TABLE asset_depreciation ADD CONSTRAINT chk_asset_depreciation_useful_life_positive CHECK (useful_life_years > 0);
ALTER TABLE asset_depreciation ADD CONSTRAINT chk_asset_depreciation_salvage_non_negative CHECK (salvage_value IS NULL OR salvage_value >= 0);
ALTER TABLE asset_depreciation ADD CONSTRAINT chk_asset_depreciation_accumulated_non_negative CHECK (accumulated_depreciation >= 0);
ALTER TABLE asset_warranties ADD CONSTRAINT chk_asset_warranties_end_after_start CHECK (end_date >= start_date);
```

#### Asset Allocation
```sql
ALTER TABLE allocations ADD CONSTRAINT chk_allocations_return_after_allocation CHECK (actual_return_date IS NULL OR actual_return_date >= allocation_date);
ALTER TABLE allocations ADD CONSTRAINT chk_allocations_expected_after_allocation CHECK (expected_return_date IS NULL OR expected_return_date >= allocation_date);
ALTER TABLE transfers ADD CONSTRAINT chk_transfers_expected_after_requested CHECK (expected_date IS NULL OR expected_date >= requested_at);
```

#### Resource Booking
```sql
ALTER TABLE bookable_resources ADD CONSTRAINT chk_bookable_resources_capacity_positive CHECK (capacity IS NULL OR capacity > 0);
ALTER TABLE bookable_resources ADD CONSTRAINT chk_bookable_resources_advance_positive CHECK (advance_booking_days > 0);
ALTER TABLE bookable_resources ADD CONSTRAINT chk_bookable_resources_min_duration_positive CHECK (min_booking_duration_minutes > 0);
ALTER TABLE bookable_resources ADD CONSTRAINT chk_bookable_resources_max_duration_positive CHECK (max_booking_duration_minutes > 0);
ALTER TABLE bookable_resources ADD CONSTRAINT chk_bookable_resources_duration_order CHECK (max_booking_duration_minutes >= min_booking_duration_minutes);
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_end_after_start CHECK (end_datetime >= start_datetime);
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_attendee_count_non_negative CHECK (attendee_count >= 0);
ALTER TABLE resource_availability ADD CONSTRAINT chk_resource_availability_end_after_start CHECK (end_time >= start_time);
ALTER TABLE resource_availability ADD CONSTRAINT chk_resource_availability_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6);
ALTER TABLE booking_blackouts ADD CONSTRAINT chk_booking_blackouts_end_after_start CHECK (end_datetime >= start_datetime);
```

#### Maintenance
```sql
ALTER TABLE maintenance_requests ADD CONSTRAINT chk_maintenance_requests_target_after_requested CHECK (target_completion_date IS NULL OR target_completion_date >= requested_date);
ALTER TABLE maintenance_requests ADD CONSTRAINT chk_maintenance_requests_actual_after_target CHECK (actual_completion_date IS NULL OR target_completion_date IS NULL OR actual_completion_date >= target_completion_date);
ALTER TABLE maintenance_requests ADD CONSTRAINT chk_maintenance_requests_estimated_cost_non_negative CHECK (estimated_cost IS NULL OR estimated_cost >= 0);
ALTER TABLE maintenance_requests ADD CONSTRAINT chk_maintenance_requests_actual_cost_non_negative CHECK (actual_cost IS NULL OR actual_cost >= 0);
ALTER TABLE maintenance_activities ADD CONSTRAINT chk_maintenance_activities_duration_non_negative CHECK (duration_minutes IS NULL OR duration_minutes >= 0);
ALTER TABLE maintenance_activities ADD CONSTRAINT chk_maintenance_activities_cost_non_negative CHECK (cost IS NULL OR cost >= 0);
ALTER TABLE vendors ADD CONSTRAINT chk_vendors_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));
ALTER TABLE vendors ADD CONSTRAINT chk_vendors_contract_dates CHECK (contract_end IS NULL OR contract_start IS NULL OR contract_end >= contract_start);
ALTER TABLE maintenance_schedules ADD CONSTRAINT chk_maintenance_schedules_end_after_start CHECK (end_date IS NULL OR end_date >= start_date);
ALTER TABLE maintenance_schedules ADD CONSTRAINT chk_maintenance_schedules_next_due_after_start CHECK (next_due_date >= start_date);
ALTER TABLE maintenance_costs ADD CONSTRAINT chk_maintenance_costs_amount_non_negative CHECK (amount >= 0);
```

#### Audit
```sql
ALTER TABLE audit_cycles ADD CONSTRAINT chk_audit_cycles_end_after_start CHECK (end_date IS NULL OR end_date >= start_date);
ALTER TABLE audit_cycles ADD CONSTRAINT chk_audit_cycles_planned_end_after_start CHECK (planned_end_date >= planned_start_date);
ALTER TABLE audit_cycles ADD CONSTRAINT chk_audit_cycles_total_non_negative CHECK (total_assets >= 0);
ALTER TABLE audit_cycles ADD CONSTRAINT chk_audit_cycles_audited_non_negative CHECK (audited_assets >= 0);
ALTER TABLE audit_cycles ADD CONSTRAINT chk_audit_cycles_audited_not_exceed_total CHECK (audited_assets <= total_assets);
ALTER TABLE audit_cycles ADD CONSTRAINT chk_audit_cycles_discrepancy_non_negative CHECK (discrepancy_count >= 0);
ALTER TABLE audit_assignments ADD CONSTRAINT chk_audit_assignments_asset_count_non_negative CHECK (asset_count >= 0);
ALTER TABLE audit_assignments ADD CONSTRAINT chk_audit_assignments_completed_non_negative CHECK (completed_count >= 0);
ALTER TABLE audit_assignments ADD CONSTRAINT chk_audit_assignments_completed_not_exceed CHECK (completed_count <= asset_count);
ALTER TABLE audit_checklist_items ADD CONSTRAINT chk_audit_checklist_items_order_non_negative CHECK (order >= 0);
```

#### Reports
```sql
ALTER TABLE report_schedules ADD CONSTRAINT chk_report_schedules_day_of_week CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6));
ALTER TABLE report_schedules ADD CONSTRAINT chk_report_schedules_day_of_month CHECK (day_of_month IS NULL OR (day_of_month >= 1 AND day_of_month <= 31));
ALTER TABLE report_schedules ADD CONSTRAINT chk_report_schedules_interval_positive CHECK (interval_value IS NULL OR interval_value > 0);
```

#### Dashboard
```sql
ALTER TABLE kpi_metrics ADD CONSTRAINT chk_kpi_metrics_period_end_after_start CHECK (period_end >= period_start);
```

### 6.3 Foreign Key Constraints

All foreign key relationships are defined in the table schemas. Key FKs include:

#### Authentication & RBAC
```sql
-- users.organization_id → organizations.id
-- users.employee_id → employees.id
-- users.department_id → departments.id
-- roles.organization_id → organizations.id
-- role_permissions.role_id → roles.id
-- role_permissions.permission_id → permissions.id
-- user_roles.user_id → users.id
-- user_roles.role_id → roles.id
-- sessions.user_id → users.id
-- password_reset_tokens.user_id → users.id
```

#### Organization Setup
```sql
-- departments.organization_id → organizations.id
-- departments.parent_id → departments.id
-- departments.manager_id → employees.id
-- departments.location_id → locations.id
-- employees.organization_id → organizations.id
-- employees.department_id → departments.id
-- employees.manager_id → employees.id
-- employees.location_id → locations.id
-- asset_categories.organization_id → organizations.id
-- asset_categories.parent_id → asset_categories.id
-- locations.organization_id → organizations.id
-- locations.parent_id → locations.id
-- locations.manager_id → employees.id
-- location_hierarchy.ancestor_id → locations.id
-- location_hierarchy.descendant_id → locations.id
```

#### Asset Management
```sql
-- assets.organization_id → organizations.id
-- assets.category_id → asset_categories.id
-- assets.location_id → locations.id
-- assets.assigned_to → employees.id
-- assets.assigned_department_id → departments.id
-- asset_status_history.asset_id → assets.id
-- asset_status_history.changed_by → users.id
-- asset_status_history.related_allocation_id → allocations.id
-- asset_status_history.related_maintenance_id → maintenance_requests.id
-- asset_photos.asset_id → assets.id
-- asset_photos.uploaded_by → users.id
-- asset_documents.asset_id → assets.id
-- asset_documents.uploaded_by → users.id
-- asset_qr_codes.asset_id → assets.id
-- asset_qr_codes.generated_by → users.id
-- asset_specifications.asset_id → assets.id
-- asset_specifications.created_by → users.id
-- asset_specifications.updated_by → users.id
-- asset_warranties.asset_id → assets.id
-- asset_warranties.created_by → users.id
-- asset_depreciation.asset_id → assets.id
```

#### Asset Allocation
```sql
-- allocations.organization_id → organizations.id
-- allocations.asset_id → assets.id
-- allocations.allocated_to_employee_id → employees.id
-- allocations.allocated_to_department_id → departments.id
-- allocations.allocated_by → users.id
-- allocations.approved_by → users.id
-- allocations.rejected_by → users.id
-- allocations.transfer_from_allocation_id → allocations.id
-- allocation_history.allocation_id → allocations.id
-- allocation_history.performed_by → users.id
-- transfers.organization_id → organizations.id
-- transfers.asset_id → assets.id
-- transfers.from_employee_id → employees.id
-- transfers.from_department_id → departments.id
-- transfers.to_employee_id → employees.id
-- transfers.to_department_id → departments.id
-- transfers.requested_by → users.id
-- transfers.approved_by → users.id
-- transfers.rejected_by → users.id
-- transfers.completed_by → users.id
-- transfer_approvals.transfer_id → transfers.id
-- transfer_approvals.approver_id → users.id
-- allocation_conflicts.asset_id → assets.id
-- allocation_conflicts.existing_allocation_id → allocations.id
-- allocation_conflicts.conflicting_allocation_id → allocations.id
-- allocation_conflicts.resolved_by → users.id
```

#### Resource Booking
```sql
-- bookable_resources.organization_id → organizations.id
-- bookable_resources.location_id → locations.id
-- bookings.organization_id → organizations.id
-- bookings.resource_id → bookable_resources.id
-- bookings.booked_by → users.id
-- bookings.approved_by → users.id
-- bookings.rejected_by → users.id
-- bookings.cancelled_by → users.id
-- booking_history.booking_id → bookings.id
-- booking_history.performed_by → users.id
-- booking_attendees.booking_id → bookings.id
-- booking_attendees.user_id → users.id
-- booking_attendees.employee_id → employees.id
-- resource_availability.resource_id → bookable_resources.id
-- booking_blackouts.resource_id → bookable_resources.id
-- booking_blackouts.created_by → users.id
```

#### Maintenance
```sql
-- maintenance_requests.organization_id → organizations.id
-- maintenance_requests.asset_id → assets.id
-- maintenance_requests.requested_by → users.id
-- maintenance_requests.assigned_to → users.id
-- maintenance_requests.vendor_id → vendors.id
-- maintenance_requests.approved_by → users.id
-- maintenance_requests.rejected_by → users.id
-- maintenance_requests.completed_by → users.id
-- maintenance_activities.maintenance_request_id → maintenance_requests.id
-- maintenance_activities.performed_by → users.id
-- maintenance_technicians.maintenance_request_id → maintenance_requests.id
-- maintenance_technicians.user_id → users.id
-- maintenance_technicians.assigned_by → users.id
-- vendors.organization_id → organizations.id
-- maintenance_schedules.organization_id → organizations.id
-- maintenance_schedules.asset_id → assets.id
-- maintenance_schedules.assigned_to → users.id
-- maintenance_approvals.maintenance_request_id → maintenance_requests.id
-- maintenance_approvals.approver_id → users.id
-- maintenance_costs.maintenance_request_id → maintenance_requests.id
-- maintenance_costs.vendor_id → vendors.id
-- maintenance_costs.created_by → users.id
```

#### Audit
```sql
-- audit_cycles.organization_id → organizations.id
-- audit_cycles.checklist_id → audit_checklists.id
-- audit_cycles.lead_auditor_id → users.id
-- audit_assignments.audit_cycle_id → audit_cycles.id
-- audit_assignments.user_id → users.id
-- audit_assignments.assigned_location_id → locations.id
-- audit_assignments.assigned_department_id → departments.id
-- audit_assignments.assigned_by → users.id
-- audit_items.audit_cycle_id → audit_cycles.id
-- audit_items.asset_id → assets.id
-- audit_items.assigned_auditor_id → users.id
-- audit_items.assigned_location_id → locations.id
-- audit_items.expected_location_id → locations.id
-- audit_items.actual_location_id → locations.id
-- audit_items.audited_by → users.id
-- audit_discrepancies.audit_item_id → audit_items.id
-- audit_discrepancies.resolved_by → users.id
-- audit_history.audit_cycle_id → audit_cycles.id
-- audit_history.performed_by → users.id
-- audit_checklists.organization_id → organizations.id
-- audit_checklists.category_id → asset_categories.id
-- audit_checklist_items.checklist_id → audit_checklists.id
```

#### Reports
```sql
-- reports.organization_id → organizations.id
-- reports.created_by → users.id
-- reports.updated_by → users.id
-- report_schedules.report_id → reports.id
-- report_schedules.created_by → users.id
-- report_schedules.updated_by → users.id
-- report_subscriptions.report_id → reports.id
-- report_subscriptions.user_id → users.id
```

#### Notifications
```sql
-- notifications.organization_id → organizations.id
-- notifications.user_id → users.id
-- notification_templates.organization_id → organizations.id
-- notification_templates.created_by → users.id
-- notification_templates.updated_by → users.id
-- notification_preferences.user_id → users.id
-- notification_rules.organization_id → organizations.id
-- notification_rules.template_id → notification_templates.id
-- notification_rules.created_by → users.id
-- notification_rules.updated_by → users.id
-- notification_logs.notification_id → notifications.id
```

#### Activity Logs
```sql
-- activity_logs.organization_id → organizations.id
-- activity_logs.user_id → users.id
-- activity_log_details.activity_log_id → activity_logs.id
```

#### Dashboard
```sql
-- dashboard_configs.user_id → users.id
-- dashboard_widgets.organization_id → organizations.id
-- dashboard_widgets.created_by → users.id
-- dashboard_widgets.updated_by → users.id
-- kpi_metrics.organization_id → organizations.id
```

#### System
```sql
-- settings.organization_id → organizations.id
-- settings.updated_by → users.id
-- feature_flags.organization_id → organizations.id
-- feature_flags.updated_by → users.id
```

### 6.4 Exclusion Constraints

#### Resource Booking - Prevent Overlapping Bookings
```sql
ALTER TABLE bookings ADD CONSTRAINT ex_booking_overlap
EXCLUDE USING GIST (
    resource_id WITH =,
    tsrange(start_datetime, end_datetime) WITH &&
) WHERE (deleted_at IS NULL AND status NOT IN ('cancelled', 'no_show'));
```

#### Asset Allocation - Prevent Double Active Allocation
```sql
ALTER TABLE allocations ADD CONSTRAINT ex_allocation_double_active
EXCLUDE USING GIST (
    asset_id WITH =,
    daterange(allocation_date, COALESCE(actual_return_date, expected_return_date, 'infinity'::date)) WITH &&
) WHERE (status = 'active' AND deleted_at IS NULL);
```

### 6.5 Composite Constraints

#### Multi-column Unique Constraints
```sql
-- users: organization_id + email (already defined as unique constraint)
-- departments: organization_id + code (already defined)
-- employees: organization_id + employee_number (already defined)
-- employees: organization_id + email (already defined)
-- asset_categories: organization_id + code (already defined)
-- locations: organization_id + code (already defined)
-- assets: organization_id + asset_tag (already defined)
-- assets: organization_id + serial_number (already defined)
-- bookings: resource_id + start_datetime + end_datetime (partial unique, already defined)
-- maintenance_requests: organization_id + request_number (already defined)
-- audit_cycles: organization_id + code (already defined)
-- reports: organization_id + slug (already defined)
-- notification_templates: organization_id + slug (already defined)
-- dashboard_widgets: organization_id + slug (already defined)
-- kpi_metrics: organization_id + metric_name + period_start + period_end (already defined)
```

#### Multi-column Check Constraints
```sql
ALTER TABLE allocations ADD CONSTRAINT chk_allocation_target_specified
CHECK (
    (allocated_to_type = 'employee' AND allocated_to_employee_id IS NOT NULL) OR
    (allocated_to_type = 'department' AND allocated_to_department_id IS NOT NULL) OR
    (allocated_to_type = 'project' AND (allocated_to_employee_id IS NOT NULL OR allocated_to_department_id IS NOT NULL)) OR
    (allocated_to_type = 'vendor' AND allocated_to_employee_id IS NOT NULL)
);

ALTER TABLE transfers ADD CONSTRAINT chk_transfer_target_specified
CHECK (
    (from_employee_id IS NOT NULL OR from_department_id IS NOT NULL) AND
    (to_employee_id IS NOT NULL OR to_department_id IS NOT NULL)
);

ALTER TABLE booking_attendees ADD CONSTRAINT chk_booking_attendee_identifier
CHECK (user_id IS NOT NULL OR employee_id IS NOT NULL OR email IS NOT NULL);
```

---

## 7. Database Optimization Strategy

### 7.1 Multi-Tenant Architecture

**Row-Level Security (RLS)**
- Implement PostgreSQL Row-Level Security for automatic tenant isolation
- All queries automatically filter by `organization_id` based on the current user's session
- Prevents cross-tenant data leakage at the database level

**Partitioning Strategy**
- Consider table partitioning for high-volume tables by `organization_id` or date ranges
- Prime candidates for partitioning: `activity_logs`, `system_logs`, `notifications`, `asset_status_history`
- Use list partitioning for multi-tenant isolation or range partitioning for time-based data

### 7.2 Index Optimization

**Partial Indexes**
- Extensive use of partial indexes with WHERE clauses to reduce index size
- Focus on active records (`deleted_at IS NULL`, `is_active = TRUE`)
- Index only relevant data for common query patterns

**Composite Indexes**
- Multi-column indexes for frequently filtered combinations
- Order columns by selectivity (most selective first)
- Include columns for covering indexes to avoid table lookups

**Index Maintenance**
- Regular index statistics updates via `ANALYZE`
- Monitor index usage with `pg_stat_user_indexes`
- Remove unused indexes to reduce write overhead
- Reindex fragmented indexes periodically

### 7.3 Query Optimization

**Query Patterns**
- Use prepared statements to prevent SQL injection and enable query plan caching
- Implement connection pooling (PgBouncer) to reduce connection overhead
- Use `EXPLAIN ANALYZE` for slow query analysis
- Optimize JOIN order and use appropriate JOIN types

**Materialized Views**
- Create materialized views for expensive aggregations
- Refresh materialized views on schedule (nightly for reports, hourly for dashboards)
- Examples: asset utilization reports, department asset counts, KPI aggregations

**Common Table Expressions (CTEs)**
- Use CTEs for complex hierarchical queries (location hierarchy, department hierarchy)
- Consider recursive CTEs for tree traversal operations
- Materialize CTEs when used multiple times in a query

### 7.4 Data Archival & Purging

**Soft Delete Strategy**
- Use `deleted_at` timestamp for soft deletes across all major tables
- Implement partial indexes that exclude deleted records
- Periodic archival of soft-deleted records to cold storage

**Data Retention Policies**
- `activity_logs`: Retain for 1 year, then archive
- `system_logs`: Retain for 6 months, then archive
- `notifications`: Retain for 90 days, then purge
- `sessions`: Purge expired sessions daily
- `password_reset_tokens`: Purge used/expired tokens daily

**Archival Process**
- Move old records to archive tables with same schema
- Compress archive tables using table compression
- Move archive tables to cheaper storage tier
- Implement automated archival jobs via pg_cron

### 7.5 Caching Strategy

**Application-Level Caching**
- Cache frequently accessed reference data (organizations, departments, asset_categories)
- Cache user permissions and roles with TTL
- Cache dashboard widgets and KPI metrics
- Use Redis for distributed caching

**Database-Level Caching**
- Configure PostgreSQL shared_buffers appropriately (25% of RAM)
- Tune effective_cache_size (75% of RAM)
- Use pg_prewarm to load frequently accessed tables into memory
- Consider UNLOGGED tables for ephemeral data (sessions, temporary data)

### 7.6 Connection Pooling

**PgBouncer Configuration**
- Use transaction pooling mode for high-concurrency applications
- Pool size: 2x CPU cores + number of disks
- Set appropriate timeouts (server_idle_timeout, client_idle_timeout)
- Monitor pool statistics for tuning

**Connection Limits**
- Set max_connections based on available resources
- Reserve connections for superusers and maintenance
- Implement connection limits per organization

### 7.7 Monitoring & Maintenance

**Monitoring Metrics**
- Track query performance (slow query log, pg_stat_statements)
- Monitor index usage and bloat
- Track table bloat and autovacuum effectiveness
- Monitor connection pool utilization
- Alert on replication lag (if using replicas)

**Regular Maintenance**
- Weekly VACUUM ANALYZE for all tables
- Monthly full VACUUM for heavily updated tables
- Regular index reindexing for fragmented indexes
- Update statistics after bulk data loads
- Monitor and tune autovacuum parameters

**Performance Tuning**
- Adjust work_mem based on query complexity
- Tune maintenance_work_mem for vacuum/analyze operations
- Configure random_page_cost for SSD storage
- Adjust effective_io_concurrency for parallel queries

### 7.8 High Availability & Replication

**Replication Strategy**
- Use streaming replication for read replicas
- Configure synchronous replication for critical data
- Implement logical replication for selective table replication
- Use cascading replication for multi-region deployment

**Backup Strategy**
- Continuous WAL archiving for point-in-time recovery
- Daily full database backups
- Weekly backup verification (restore test)
- Store backups in multiple locations (local + cloud)

**Failover Planning**
- Configure automatic failover with repmgr or Patroni
- Implement DNS-based failover for application transparency
- Regular failover drills to test recovery procedures
- Document failover procedures and runbooks

### 7.9 Security Hardening

**Data Encryption**
- Enable TLS for all database connections
- Use pgcrypto for sensitive data encryption at rest
- Encrypt backups using pg_dump with encryption options
- Consider TDE (Transparent Data Encryption) for full database encryption

**Access Control**
- Implement least-privilege access via database roles
- Use separate read/write roles for applications
- Rotate database credentials regularly
- Audit all privileged access

**Audit Logging**
- Enable pgaudit for comprehensive audit logging
- Log all DDL and DML changes
- Audit access to sensitive tables
- Regular review of audit logs for security incidents

### 7.10 Scalability Considerations

**Vertical Scaling**
- Increase RAM for larger buffer pools
- Add CPU cores for parallel query execution
- Use faster storage (NVMe SSDs) for I/O-intensive workloads

**Horizontal Scaling**
- Distribute read queries across multiple replicas
- Implement sharding for very large multi-tenant deployments
- Use foreign data wrappers for cross-shard queries
- Consider Citus extension for distributed PostgreSQL

**Load Distribution**
- Separate OLTP and OLAP workloads
- Use dedicated reporting databases
- Implement read-write splitting for query distribution
- Cache frequently accessed data at multiple layers

---

## 8. Entity-Relationship Diagram

### 8.1 ER Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION & RBAC                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) users
organizations (1) ────────< (N) roles
organizations (1) ────────< (N) sessions

users (N) ────────> (1) employees
users (N) ────────> (1) departments
users (N) ────────< (M) user_roles ────────< (M) roles
users (N) ────────< (M) sessions
users (N) ────────< (M) password_reset_tokens

roles (N) ────────< (M) role_permissions ────────< (M) permissions

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          ORGANIZATION SETUP                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) departments
organizations (1) ────────< (N) employees
organizations (1) ────────< (N) asset_categories
organizations (1) ────────< (N) locations

departments (1) ────────< (N) departments (self-reference)
departments (1) ────────< (N) employees
departments (1) ────────> (1) employees (manager)
departments (1) ────────> (1) locations

employees (1) ────────> (1) employees (manager)
employees (N) ────────> (1) departments
employees (N) ────────> (1) locations

asset_categories (1) ────────< (N) asset_categories (self-reference)

locations (1) ────────< (N) locations (self-reference)
locations (N) ────────< (M) location_hierarchy ────────< (M) locations

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          ASSET MANAGEMENT                                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) assets
asset_categories (1) ────────< (N) assets
locations (1) ────────< (N) assets
employees (1) ────────< (N) assets (assigned_to)
departments (1) ────────< (N) assets (assigned_department)

assets (1) ────────< (N) asset_status_history
assets (1) ────────< (N) asset_photos
assets (1) ────────< (N) asset_documents
assets (1) ────────< (1) asset_qr_codes
assets (1) ────────< (1) asset_specifications
assets (1) ────────< (N) asset_warranties
assets (1) ────────< (1) asset_depreciation

users (N) ────────< (M) asset_status_history
users (N) ────────< (M) asset_photos
users (N) ────────< (M) asset_documents
users (N) ────────< (M) asset_qr_codes
users (N) ────────< (M) asset_specifications
users (N) ────────< (M) asset_warranties

allocations (N) ────────> (1) asset_status_history
maintenance_requests (N) ────────> (1) asset_status_history

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          ASSET ALLOCATION                                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) allocations
assets (1) ────────< (N) allocations
employees (1) ────────< (N) allocations (allocated_to)
departments (1) ────────< (N) allocations (allocated_to)
users (N) ────────< (M) allocations (allocated_by, approved_by, rejected_by)
allocations (1) ────────< (N) allocation_history
allocations (1) ────────> (1) allocations (transfer_from)

organizations (1) ────────< (N) transfers
assets (1) ────────< (N) transfers
employees (N) ────────< (M) transfers (from/to)
departments (N) ────────< (M) transfers (from/to)
users (N) ────────< (M) transfers (requested_by, approved_by, rejected_by, completed_by)
transfers (1) ────────< (N) transfer_approvals
users (N) ────────< (M) transfer_approvals (approver)

assets (N) ────────< (M) allocation_conflicts
allocations (N) ────────< (M) allocation_conflicts
users (N) ────────< (M) allocation_conflicts (resolved_by)

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          RESOURCE BOOKING                                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) bookable_resources
locations (1) ────────< (N) bookable_resources

organizations (1) ────────< (N) bookings
bookable_resources (1) ────────< (N) bookings
users (N) ────────< (M) bookings (booked_by, approved_by, rejected_by, cancelled_by)
bookings (1) ────────< (N) booking_history
users (N) ────────< (M) booking_history (performed_by)
bookings (1) ────────< (N) booking_attendees
users (N) ────────< (M) booking_attendees
employees (N) ────────< (M) booking_attendees

bookable_resources (1) ────────< (N) resource_availability
bookable_resources (1) ────────< (N) booking_blackouts
users (N) ────────< (M) booking_blackouts (created_by)

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          MAINTENANCE                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) maintenance_requests
assets (1) ────────< (N) maintenance_requests
users (N) ────────< (M) maintenance_requests (requested_by, assigned_to, approved_by, rejected_by, completed_by)
vendors (1) ────────< (N) maintenance_requests
maintenance_requests (1) ────────< (N) maintenance_activities
users (N) ────────< (M) maintenance_activities (performed_by)
maintenance_requests (1) ────────< (N) maintenance_technicians
users (N) ────────< (M) maintenance_technicians (assigned_by)
maintenance_requests (1) ────────< (N) maintenance_approvals
users (N) ────────< (M) maintenance_approvals (approver)
maintenance_requests (1) ────────< (N) maintenance_costs
vendors (1) ────────< (N) maintenance_costs
users (N) ────────< (M) maintenance_costs (created_by)

organizations (1) ────────< (N) vendors
organizations (1) ────────< (N) maintenance_schedules
assets (1) ────────< (N) maintenance_schedules
users (N) ────────< (M) maintenance_schedules (assigned_to)

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          AUDIT                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) audit_cycles
audit_checklists (1) ────────< (N) audit_cycles
users (N) ────────< (M) audit_cycles (lead_auditor)

audit_cycles (1) ────────< (N) audit_assignments
users (N) ────────< (M) audit_assignments
locations (N) ────────< (M) audit_assignments (assigned_location)
departments (N) ────────< (M) audit_assignments (assigned_department)

audit_cycles (1) ────────< (N) audit_items
assets (1) ────────< (N) audit_items
users (N) ────────< (M) audit_items (assigned_auditor, audited_by)
locations (N) ────────< (M) audit_items (assigned_location, expected_location, actual_location)

audit_items (1) ────────< (N) audit_discrepancies
users (N) ────────< (M) audit_discrepancies (resolved_by)

audit_cycles (1) ────────< (N) audit_history
users (N) ────────< (M) audit_history (performed_by)

organizations (1) ────────< (N) audit_checklists
asset_categories (1) ────────< (N) audit_checklists
audit_checklists (1) ────────< (N) audit_checklist_items

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          REPORTS                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) reports
users (N) ────────< (M) reports (created_by, updated_by)

reports (1) ────────< (N) report_schedules
users (N) ────────< (M) report_schedules (created_by, updated_by)

reports (1) ────────< (N) report_subscriptions
users (N) ────────< (M) report_subscriptions

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          NOTIFICATIONS                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) notifications
users (N) ────────< (M) notifications

organizations (1) ────────< (N) notification_templates
users (N) ────────< (M) notification_templates (created_by, updated_by)

users (N) ────────< (M) notification_preferences

organizations (1) ────────< (N) notification_rules
notification_templates (1) ────────< (N) notification_rules
users (N) ────────< (M) notification_rules (created_by, updated_by)

notifications (1) ────────< (N) notification_logs

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          ACTIVITY LOGS                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (1) ────────< (N) activity_logs
users (N) ────────< (M) activity_logs
activity_logs (1) ────────< (N) activity_log_details

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD                                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘

users (N) ────────< (1) dashboard_configs

organizations (1) ────────< (N) dashboard_widgets
users (N) ────────< (M) dashboard_widgets (created_by, updated_by)

organizations (1) ────────< (N) kpi_metrics

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

organizations (N) ────────> (1) settings
users (N) ────────< (M) settings (updated_by)

organizations (N) ────────> (1) feature_flags
users (N) ────────< (M) feature_flags (updated_by)
```

### 8.2 Relationship Summary

**Core Relationships:**
- **organizations** is the root entity for all tenant-specific data
- **users** link to **employees** and **departments** for organizational context
- **assets** are the central entity, linked to categories, locations, and assignments
- **allocations** and **transfers** manage asset movement between employees/departments
- **bookings** manage resource reservations with time-based constraints
- **maintenance_requests** track asset servicing with vendor and technician assignments
- **audit_cycles** coordinate comprehensive asset audits with assignments and discrepancies

**Key Many-to-Many Relationships:**
- users ↔ roles (via user_roles)
- roles ↔ permissions (via role_permissions)
- locations ↔ locations (via location_hierarchy for tree structure)
- bookings ↔ users/employees (via booking_attendees)
- audit_cycles ↔ users (via audit_assignments)

**Self-Referencing Relationships:**
- departments → departments (parent-child hierarchy)
- asset_categories → asset_categories (parent-child hierarchy)
- locations → locations (parent-child hierarchy)
- employees → employees (manager hierarchy)
- allocations → allocations (transfer chain)

---

## 9. Review & Improvements

### 9.1 Schema Completeness Review

**Completed Sections:**
- ✅ Complete list of 62 database entities
- ✅ Detailed table schemas with columns, data types, and constraints
- ✅ Comprehensive relationship documentation (1:1, 1:N, N:M)
- ✅ All enum definitions as SQL types
- ✅ Performance indexes for all major tables
- ✅ Unique, check, foreign key, and composite constraints
- ✅ Database optimization strategy
- ✅ Text-based ER diagram

### 9.2 Potential Improvements

**Data Model Enhancements:**
1. **Asset Lifecycle Tracking**: Consider adding an `asset_lifecycle_events` table to track all lifecycle events (acquisition, deployment, maintenance, disposal) in a unified timeline
2. **Cost Center Tracking**: Add cost center association to departments and assets for financial reporting
3. **Asset Bundling**: Implement asset bundles/groups for tracking related assets (e.g., laptop + peripherals)
4. **Contract Management**: Add contracts table for vendor contracts, leases, and warranties
5. **Asset Calibration**: Add calibration tracking for measurement equipment and sensors
6. **Software Licensing**: Add software licenses table for tracking software assets and license compliance

**Performance Considerations:**
1. **Read Replicas**: Implement read replicas for reporting queries to offload the primary database
2. **Query Optimization**: Add covering indexes for frequently used query patterns after analyzing actual query patterns
3. **Partitioning**: Implement table partitioning for high-volume tables (activity_logs, system_logs) by date
4. **Connection Pooling**: Configure PgBouncer for efficient connection management
5. **Materialized Views**: Create materialized views for expensive aggregations (asset utilization, department summaries)

**Security Enhancements:**
1. **Row-Level Security**: Implement PostgreSQL RLS policies for automatic tenant isolation
2. **Data Encryption**: Add column-level encryption for sensitive fields (SSN, financial data)
3. **Audit Trail Enhancement**: Add trigger-based audit logging for all DML operations
4. **Field-Level Access Control**: Implement fine-grained access control for sensitive fields
5. **PII Masking**: Add data masking for PII fields in non-production environments

**Scalability Considerations:**
1. **Sharding Strategy**: Plan for horizontal sharding by organization_id for very large deployments
2. **Caching Layer**: Implement Redis caching for frequently accessed reference data
3. **Search Integration**: Add Elasticsearch integration for full-text search capabilities
4. **Time-Series Data**: Consider TimescaleDB extension for time-series data (activity_logs, metrics)
5. **Geospatial Queries**: Add PostGIS extension for location-based queries and spatial analysis

**Operational Improvements:**
1. **Database Migrations**: Implement a migration framework (Flyway, Liquibase) for schema versioning
2. **Backup Automation**: Automate backup scheduling and verification
3. **Monitoring Dashboard**: Set up comprehensive monitoring (Prometheus, Grafana) for database health
4. **Alerting System**: Configure alerts for critical database events (connection exhaustion, replication lag)
5. **Capacity Planning**: Implement capacity planning based on growth projections

### 9.3 Best Practices Implemented

**Design Patterns:**
- ✅ Multi-tenant architecture with organization_id isolation
- ✅ Soft delete pattern with deleted_at timestamps
- ✅ Audit trail pattern with created_at, updated_at, created_by, updated_by
- ✅ Hierarchical data structure for departments, locations, and categories
- ✅ Junction tables for many-to-many relationships
- ✅ Status tracking with history tables for state changes

**Data Integrity:**
- ✅ Comprehensive foreign key constraints
- ✅ Unique constraints for business keys
- ✅ Check constraints for data validation
- ✅ Exclusion constraints for preventing overlaps
- ✅ Partial unique indexes for conditional uniqueness

**Performance:**
- ✅ Strategic indexing with partial indexes
- ✅ Composite indexes for common query patterns
- ✅ Indexes on foreign keys for join performance
- ✅ Time-based indexes for range queries
- ✅ JSONB columns for flexible schema evolution

**Maintainability:**
- ✅ Consistent naming conventions
- ✅ Clear table and column purposes
- ✅ Comprehensive documentation
- ✅ Enum types for domain values
- ✅ Default values for common scenarios

### 9.4 Migration Strategy

**Phase 1: Core Tables**
1. Create organizations, users, roles, permissions tables
2. Implement RBAC system
3. Set up authentication and session management

**Phase 2: Organization Setup**
1. Create departments, employees, asset_categories, locations tables
2. Implement hierarchy structures
3. Set up location hierarchy management

**Phase 3: Asset Management**
1. Create assets and related tables (photos, documents, specifications)
2. Implement asset lifecycle tracking
3. Set up QR code generation

**Phase 4: Allocation & Booking**
1. Create allocations, transfers, and related workflow tables
2. Implement booking system for resources
3. Set up conflict detection

**Phase 5: Maintenance & Audit**
1. Create maintenance request system
2. Implement audit cycle management
3. Set up discrepancy tracking

**Phase 6: Reporting & Notifications**
1. Create reports and scheduling system
2. Implement notification system
3. Set up activity logging

**Phase 7: Dashboard & System**
1. Create dashboard widgets and KPI tracking
2. Implement settings and feature flags
3. Set up system logging

### 9.5 Testing Recommendations

**Unit Testing:**
- Test all constraint validations
- Test trigger logic (if implemented)
- Test default value assignments
- Test enum value restrictions

**Integration Testing:**
- Test foreign key relationships
- Test cascade delete behavior
- Test complex join queries
- Test transaction rollback scenarios

**Performance Testing:**
- Benchmark common queries
- Test index effectiveness
- Load test with realistic data volumes
- Test concurrent access patterns

**Security Testing:**
- Test SQL injection prevention
- Test authorization checks
- Test data isolation between tenants
- Test audit trail completeness

### 9.6 Documentation Maintenance

**Keep Updated:**
- Document any schema changes
- Update ER diagrams after structural changes
- Maintain migration logs
- Document performance tuning changes
- Update optimization strategies based on actual usage

**Version Control:**
- Store schema definition in version control
- Tag releases with schema versions
- Maintain change history
- Document rollback procedures

---

## Appendix

### A. SQL DDL Script Template

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- For exclusion constraints

-- Create all enum types first
-- (See Section 4 for complete enum definitions)

-- Create tables in dependency order
-- (See Section 2 for complete table definitions)

-- Create indexes
-- (See Section 5 for complete index definitions)

-- Create constraints
-- (See Section 6 for complete constraint definitions)

-- Grant permissions
GRANT USAGE ON SCHEMA public TO assetflow_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO assetflow_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO assetflow_app;
```

### B. Sample Data Seeding

```sql
-- Insert default organization
INSERT INTO organizations (id, name, slug, email, max_users, max_assets)
VALUES (
    uuid_generate_v4(),
    'Default Organization',
    'default',
    'admin@default.com',
    100,
    1000
);

-- Insert default admin user
INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name)
VALUES (
    uuid_generate_v4(),
    (SELECT id FROM organizations WHERE slug = 'default'),
    'admin@default.com',
    '$2b$12$hashed_password_here',
    'System',
    'Administrator'
);

-- Insert default roles
INSERT INTO roles (id, organization_id, name, slug, is_system, level)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM organizations WHERE slug = 'default'), 'Super Admin', 'super_admin', true, 100),
    (uuid_generate_v4(), (SELECT id FROM organizations WHERE slug = 'default'), 'Admin', 'admin', true, 90),
    (uuid_generate_v4(), (SELECT id FROM organizations WHERE slug = 'default'), 'User', 'user', true, 10);
```

### C. Common Query Patterns

**Get all assets for an organization:**
```sql
SELECT a.*, c.name as category_name, l.name as location_name
FROM assets a
JOIN asset_categories c ON a.category_id = c.id
LEFT JOIN locations l ON a.location_id = l.id
WHERE a.organization_id = :org_id
  AND a.deleted_at IS NULL;
```

**Get user's assigned assets:**
```sql
SELECT a.*, al.allocation_date, al.expected_return_date
FROM assets a
JOIN allocations al ON a.id = al.asset_id
WHERE al.allocated_to_employee_id = :user_id
  AND al.status = 'active'
  AND al.deleted_at IS NULL;
```

**Check resource availability:**
```sql
SELECT br.*
FROM bookable_resources br
WHERE br.id NOT IN (
    SELECT resource_id
    FROM bookings
    WHERE resource_id = :resource_id
      AND status = 'confirmed'
      AND start_datetime < :end_datetime
      AND end_datetime > :start_datetime
      AND deleted_at IS NULL
)
AND br.is_active = true;
```

**Get maintenance requests by priority:**
```sql
SELECT mr.*, a.asset_tag, a.name as asset_name
FROM maintenance_requests mr
JOIN assets a ON mr.asset_id = a.id
WHERE mr.organization_id = :org_id
  AND mr.status IN ('pending', 'in_progress')
  AND mr.deleted_at IS NULL
ORDER BY 
    CASE mr.priority
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'normal' THEN 3
        WHEN 'low' THEN 4
    END,
    mr.requested_at ASC;
```

---

**Document Version**: 1.0  
**Last Updated**: 2026  
**Database**: PostgreSQL 15+  
**Schema**: assetflow
