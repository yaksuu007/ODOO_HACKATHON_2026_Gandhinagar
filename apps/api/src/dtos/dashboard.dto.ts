/**
 * Dashboard Stats Response DTO
 */
export interface DashboardStatsResponse {
  totalAssets: number;
  resourceCapacity: number;
  pendingMaintenance: number;
  criticalMaintenance: number;
  activeAudits: number;
}

/**
 * Dashboard Utilization Response DTO
 */
export interface UtilizationDataPoint {
  day: string;
  value: number;
}

export interface DashboardUtilizationResponse {
  data: UtilizationDataPoint[];
}
