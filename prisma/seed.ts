import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Insert default organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Default Organization',
      slug: 'default',
      email: 'admin@default.com',
      maxUsers: 100,
      maxAssets: 1000,
      subscriptionPlan: 'enterprise',
      subscriptionStatus: 'active',
    },
  })
  console.log('✓ Organization created:', organization.name)

  // Insert default admin user
  // Password hash is for 'Admin123!' - change in production
  const user = await prisma.user.upsert({
    where: { email: 'admin@default.com' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      organizationId: organization.id,
      email: 'admin@default.com',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYlW5QhWq5i',
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      isVerified: true,
    },
  })
  console.log('✓ Admin user created:', user.email)

  // Insert default roles
  const superAdminRole = await prisma.role.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'super_admin' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      organizationId: organization.id,
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full system access',
      isSystem: true,
      level: 100,
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'admin' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      organizationId: organization.id,
      name: 'Admin',
      slug: 'admin',
      description: 'Organization administrator',
      isSystem: true,
      level: 90,
    },
  })

  const managerRole = await prisma.role.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'manager' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      organizationId: organization.id,
      name: 'Manager',
      slug: 'manager',
      description: 'Department manager',
      isSystem: true,
      level: 70,
    },
  })

  const employeeRole = await prisma.role.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'employee' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      organizationId: organization.id,
      name: 'Employee',
      slug: 'employee',
      description: 'Regular employee',
      isSystem: true,
      level: 50,
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'viewer' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      organizationId: organization.id,
      name: 'Viewer',
      slug: 'viewer',
      description: 'Read-only access',
      isSystem: true,
      level: 10,
    },
  })
  console.log('✓ Roles created')

  // Assign super admin role to admin user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: superAdminRole.id } },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
      assignedBy: user.id,
      isActive: true,
    },
  })
  console.log('✓ Super admin role assigned to admin user')

  // Insert default permissions
  const permissions = [
    {
      id: '00000000-0000-0000-0000-000000000008',
      name: 'View Organizations',
      slug: 'organizations.read',
      module: 'organizations' as const,
      action: 'read' as const,
      description: 'View organization details',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000009',
      name: 'Manage Organizations',
      slug: 'organizations.manage',
      module: 'organizations' as const,
      action: 'update' as const,
      description: 'Manage organization settings',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000000a',
      name: 'View Users',
      slug: 'users.read',
      module: 'users' as const,
      action: 'read' as const,
      description: 'View user accounts',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000000b',
      name: 'Manage Users',
      slug: 'users.manage',
      module: 'users' as const,
      action: 'update' as const,
      description: 'Manage user accounts',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000000c',
      name: 'View Assets',
      slug: 'assets.read',
      module: 'assets' as const,
      action: 'read' as const,
      description: 'View asset inventory',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000000d',
      name: 'Manage Assets',
      slug: 'assets.manage',
      module: 'assets' as const,
      action: 'update' as const,
      description: 'Manage asset records',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000000e',
      name: 'Allocate Assets',
      slug: 'assets.allocate',
      module: 'assets' as const,
      action: 'assign' as const,
      description: 'Allocate assets to users',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000000f',
      name: 'View Allocations',
      slug: 'allocations.read',
      module: 'allocations' as const,
      action: 'read' as const,
      description: 'View asset allocations',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'Manage Allocations',
      slug: 'allocations.manage',
      module: 'allocations' as const,
      action: 'update' as const,
      description: 'Manage asset allocations',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000011',
      name: 'View Maintenance',
      slug: 'maintenance.read',
      module: 'maintenance' as const,
      action: 'read' as const,
      description: 'View maintenance requests',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000012',
      name: 'Manage Maintenance',
      slug: 'maintenance.manage',
      module: 'maintenance' as const,
      action: 'update' as const,
      description: 'Manage maintenance requests',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000013',
      name: 'View Reports',
      slug: 'reports.read',
      module: 'reports' as const,
      action: 'read' as const,
      description: 'View reports',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000014',
      name: 'Manage Reports',
      slug: 'reports.manage',
      module: 'reports' as const,
      action: 'update' as const,
      description: 'Manage reports',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000015',
      name: 'View Audit',
      slug: 'audit.read',
      module: 'audit' as const,
      action: 'read' as const,
      description: 'View audit cycles',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000016',
      name: 'Manage Audit',
      slug: 'audit.manage',
      module: 'audit' as const,
      action: 'update' as const,
      description: 'Manage audit cycles',
      isSystem: true,
    },
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {},
      create: permission,
    })
  }
  console.log('✓ Permissions created')

  // Assign all permissions to super admin role
  const allPermissions = await prisma.permission.findMany()
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permission.id } },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
        createdBy: user.id,
      },
    })
  }
  console.log('✓ All permissions assigned to super admin role')

  // Insert default department
  const department = await prisma.department.upsert({
    where: { organizationId_code: { organizationId: organization.id, code: 'IT' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000017',
      organizationId: organization.id,
      name: 'IT Department',
      code: 'IT',
      description: 'Information Technology Department',
      isActive: true,
    },
  })
  console.log('✓ Department created:', department.name)

  // Insert default location
  const location = await prisma.location.upsert({
    where: { organizationId_code: { organizationId: organization.id, code: 'MAIN' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000018',
      organizationId: organization.id,
      name: 'Main Office',
      code: 'MAIN',
      type: 'building',
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
      },
      isActive: true,
    },
  })
  console.log('✓ Location created:', location.name)

  // Insert default asset category
  const assetCategory = await prisma.assetCategory.upsert({
    where: { organizationId_code: { organizationId: organization.id, code: 'COMPUTERS' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000019',
      organizationId: organization.id,
      name: 'Computers',
      code: 'COMPUTERS',
      description: 'Computer equipment',
      isActive: true,
    },
  })
  console.log('✓ Asset category created:', assetCategory.name)

  // Insert default bookable resource
  const bookableResource = await prisma.bookableResource.upsert({
    where: { organizationId_code: { organizationId: organization.id, code: 'CONF-A' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-00000000001a',
      organizationId: organization.id,
      locationId: location.id,
      name: 'Conference Room A',
      code: 'CONF-A',
      type: 'room',
      description: 'Main conference room',
      capacity: 20,
      isActive: true,
    },
  })
  console.log('✓ Bookable resource created:', bookableResource.name)

  // Insert default settings
  const settings = [
    { key: 'app.name', value: 'AssetFlow', valueType: 'string', description: 'Application name', isPublic: true },
    { key: 'app.version', value: '1.0.0', valueType: 'string', description: 'Application version', isPublic: true },
    { key: 'app.support_email', value: 'support@assetflow.com', valueType: 'string', description: 'Support email address', isPublic: true },
    { key: 'session.timeout_minutes', value: '60', valueType: 'number', description: 'Session timeout in minutes', isPublic: false },
    { key: 'password.min_length', value: '8', valueType: 'number', description: 'Minimum password length', isPublic: false },
    { key: 'password.require_special_char', value: 'true', valueType: 'boolean', description: 'Require special character in password', isPublic: false },
    { key: 'password.require_number', value: 'true', valueType: 'boolean', description: 'Require number in password', isPublic: false },
    { key: 'password.require_uppercase', value: 'true', valueType: 'boolean', description: 'Require uppercase in password', isPublic: false },
    { key: 'maintenance.retention_days', value: '365', valueType: 'number', description: 'Maintenance log retention days', isPublic: false },
    { key: 'audit.retention_days', value: '1825', valueType: 'number', description: 'Audit log retention days (5 years)', isPublic: false },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { organizationId_key: { organizationId: null, key: setting.key } },
      update: {},
      create: {
        organizationId: null,
        ...setting,
        valueType: setting.valueType as any,
      },
    })
  }
  console.log('✓ Settings created')

  // Insert default feature flags
  const featureFlags = [
    { featureName: 'dark_mode', isEnabled: true, description: 'Enable dark mode UI', rolloutPercentage: 100 },
    { featureName: 'advanced_analytics', isEnabled: true, description: 'Enable advanced analytics features', rolloutPercentage: 100 },
    { featureName: 'mobile_app', isEnabled: false, description: 'Enable mobile application', rolloutPercentage: 0 },
    { featureName: 'api_v2', isEnabled: false, description: 'Enable API v2 endpoints', rolloutPercentage: 0 },
    { featureName: 'real_time_notifications', isEnabled: true, description: 'Enable real-time notifications', rolloutPercentage: 100 },
  ]

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { organizationId_featureName: { organizationId: null, featureName: flag.featureName } },
      update: {},
      create: {
        organizationId: null,
        ...flag,
      },
    })
  }
  console.log('✓ Feature flags created')

  // Insert sample notification templates
  const notificationTemplates = [
    {
      id: '00000000-0000-0000-0000-00000000001b',
      organizationId: organization.id,
      type: 'allocation' as const,
      name: 'Asset Allocated',
      slug: 'asset_allocated',
      subjectTemplate: 'Asset Allocated: {{asset_name}}',
      bodyTemplate: 'You have been allocated the asset {{asset_name}}. Please return it by {{return_date}}.',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000001c',
      organizationId: organization.id,
      type: 'maintenance' as const,
      name: 'Maintenance Due',
      slug: 'maintenance_due',
      subjectTemplate: 'Maintenance Due: {{asset_name}}',
      bodyTemplate: 'The asset {{asset_name}} is due for maintenance on {{due_date}}.',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000001d',
      organizationId: organization.id,
      type: 'audit' as const,
      name: 'Audit Assignment',
      slug: 'audit_assignment',
      subjectTemplate: 'Audit Assignment',
      bodyTemplate: 'You have been assigned to audit {{location_name}} for cycle {{audit_cycle_name}}.',
      isActive: true,
    },
  ]

  for (const template of notificationTemplates) {
    await prisma.notificationTemplate.upsert({
      where: { organizationId_slug: { organizationId: organization.id, slug: template.slug } },
      update: {},
      create: template,
    })
  }
  console.log('✓ Notification templates created')

  // Insert sample dashboard widgets
  const dashboardWidgets = [
    {
      id: '00000000-0000-0000-0000-00000000001e',
      organizationId: organization.id,
      name: 'Asset Overview',
      slug: 'asset_overview',
      widgetType: 'metric' as const,
      description: 'Overview of asset inventory',
      config: { metric: 'total_assets', label: 'Total Assets' },
      isActive: true,
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-00000000001f',
      organizationId: organization.id,
      name: 'Active Allocations',
      slug: 'active_allocations',
      widgetType: 'metric' as const,
      description: 'Currently allocated assets',
      config: { metric: 'active_allocations', label: 'Active Allocations' },
      isActive: true,
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000020',
      organizationId: organization.id,
      name: 'Pending Maintenance',
      slug: 'pending_maintenance',
      widgetType: 'list' as const,
      description: 'Assets requiring maintenance',
      config: { limit: 5 },
      isActive: true,
      isSystem: true,
    },
  ]

  for (const widget of dashboardWidgets) {
    await prisma.dashboardWidget.upsert({
      where: { organizationId_slug: { organizationId: organization.id, slug: widget.slug } },
      update: {},
      create: widget,
    })
  }
  console.log('✓ Dashboard widgets created')

  // Insert sample report
  const report = await prisma.report.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'asset_inventory' } },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000021',
      organizationId: organization.id,
      name: 'Asset Inventory Report',
      slug: 'asset_inventory',
      reportType: 'asset_inventory',
      queryConfig: { columns: ['asset_tag', 'name', 'category', 'location', 'status'] },
      isPublic: true,
      isSystem: true,
    },
  })
  console.log('✓ Report created:', report.name)

  console.log('Database seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
