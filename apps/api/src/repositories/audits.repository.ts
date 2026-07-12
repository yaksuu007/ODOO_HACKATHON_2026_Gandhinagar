import prisma from '../database/client';

export class AuditsRepository {
  /**
   * Get all audit records
   */
  async getAll(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    const auditCycles = await prisma.auditCycle.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        leadAuditor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return auditCycles.map(cycle => ({
      id: cycle.code,
      title: cycle.name,
      auditor_name: cycle.leadAuditor 
        ? `${cycle.leadAuditor.firstName} ${cycle.leadAuditor.lastName}`
        : 'Unassigned',
      scheduled_date: cycle.plannedStartDate.toISOString().split('T')[0],
      status: cycle.status.toUpperCase(),
      results: cycle.notes || '',
    }));
  }

  /**
   * Create new audit
   */
  async create(data: any, organizationId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    // Generate audit code
    const code = `AD-${Date.now()}`;

    // Find auditor by name (simplified)
    let auditorId = null;
    if (data.auditor_name) {
      const nameParts = data.auditor_name.split(' ');
      const auditor = await prisma.user.findFirst({
        where: {
          organizationId,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
        },
      });
      auditorId = auditor?.id || null;
    }

    const auditCycle = await prisma.auditCycle.create({
      data: {
        organizationId,
        code,
        name: data.title,
        leadAuditorId: auditorId,
        plannedStartDate: data.scheduled_date ? new Date(data.scheduled_date) : new Date(),
        plannedEndDate: data.scheduled_date ? new Date(data.scheduled_date) : new Date(),
        status: 'planned',
        notes: data.results || '',
      },
      include: {
        leadAuditor: true,
      },
    });

    return {
      id: auditCycle.code,
      title: auditCycle.name,
      auditor_name: auditCycle.leadAuditor 
        ? `${auditCycle.leadAuditor.firstName} ${auditCycle.leadAuditor.lastName}`
        : 'Unassigned',
      scheduled_date: auditCycle.plannedStartDate.toISOString().split('T')[0],
      status: auditCycle.status.toUpperCase(),
      results: auditCycle.notes || '',
    };
  }
}

export const auditsRepository = new AuditsRepository();
