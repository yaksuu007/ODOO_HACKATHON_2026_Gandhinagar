"use client";

import React, { useEffect, useState } from "react";
import {
  Boxes,
  Users,
  Wrench,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  CloudLightning,
  RefreshCw,
  MoreVertical,
  Activity,
  AlertTriangle,
  History
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { apiRequest } from "@/utils/api";
import Link from "next/link";
import { MetricCardSkeleton, ActivityRowSkeleton } from "@/components/ui/card-skeleton";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, utilData, actData] = await Promise.all([
        apiRequest("/dashboard/stats"),
        apiRequest("/dashboard/utilization"),
        apiRequest("/activity"),
      ]);
      setStats(statsData.data || statsData);
      setChartData(utilData.data || utilData);
      setRecentActivity((actData.data || actData).slice(0, 4)); // Only show top 4
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Set empty state on error
      setStats({ totalAssets: 0, resourceCapacity: 0, pendingMaintenance: 0, criticalMaintenance: 0, activeAudits: 0 });
      setChartData([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-[28px] font-bold text-primary m-0 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time enterprise metrics and active workflows.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="h-4 w-px bg-outline-variant"></span>
          <button
            onClick={fetchData}
            className="flex items-center gap-1 text-secondary font-medium hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            Last updated: {lastUpdated}
          </button>
        </div>
      </div>

      {/* Bento Grid: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            {/* KPI 1: Total Assets */}
            <div className="bg-white rounded border border-[#E2E8F0] p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-secondary transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Assets
                </span>
                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Boxes className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-tight text-primary">
                  {stats?.totalAssets || 0}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-secondary flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +3.2%
                  </span>
                  <span className="text-[11px] text-on-surface-variant">vs last month</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div className="h-full bg-secondary w-3/4"></div>
              </div>
            </div>

            {/* KPI 2: Available Resources */}
            <div className="bg-white rounded border border-[#E2E8F0] p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-secondary transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Resource Capacity
                </span>
                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-tight text-primary">
                  {stats?.resourceCapacity || 0}%
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-error flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> -1.5%
                  </span>
                  <span className="text-[11px] text-on-surface-variant">capacity strain</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div
                  className="h-full bg-[#0ea5e9]"
                  style={{ width: `${stats?.resourceCapacity || 0}%` }}
                ></div>
              </div>
            </div>

            {/* KPI 3: Pending Maintenance */}
            <div className="bg-white rounded border border-[#E2E8F0] p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-secondary transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Pending Maintenance
                </span>
                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-tight text-primary">
                  {stats?.pendingMaintenance || 0}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-on-surface-variant">
                    <strong className="text-on-surface">{stats?.criticalMaintenance || 0}</strong> critical priority
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest flex">
                <div className="h-full bg-error w-1/3"></div>
                <div className="h-full bg-amber-500 w-1/3"></div>
              </div>
            </div>

            {/* KPI 4: Active Audits */}
            <div className="bg-white rounded border border-[#E2E8F0] p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-secondary transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Active Audits
                </span>
                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-tight text-primary">
                  {stats?.activeAudits || 0}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-on-surface-variant">
                    <strong className="text-on-surface">1</strong> due this week
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div className="h-full bg-secondary-container w-1/4"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Activity & Utilization */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Resource Utilization Chart Area */}
          <div className="bg-white rounded border border-[#E2E8F0] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-primary">Resource Utilization</h3>
              <button className="text-on-surface-variant hover:text-primary">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#041627",
                      color: "#ffffff",
                      fontSize: "12px",
                      borderRadius: "4px"
                    }}
                  />
                  <Bar dataKey="value" fill="#006a6a" radius={[2, 2, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded border border-[#E2E8F0] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-surface flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-primary">Recent Activity</h3>
              <Link href="/activity" className="text-secondary text-sm font-semibold hover:underline flex items-center gap-1">
                <History className="w-4 h-4" /> View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-6 py-3 bg-white">User</th>
                    <th className="px-6 py-3 bg-white">Action</th>
                    <th className="px-6 py-3 bg-white">Entity</th>
                    <th className="px-6 py-3 bg-white text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
                  {loading ? (
                    <>
                      <ActivityRowSkeleton />
                      <ActivityRowSkeleton />
                      <ActivityRowSkeleton />
                      <ActivityRowSkeleton />
                    </>
                  ) : recentActivity.map((act) => (
                    <tr key={act.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px]">
                            {act.username.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold capitalize">{act.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-on-surface-variant">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          act.action === "REGISTER" || act.action === "CREATE_ASSET"
                            ? "bg-green-100 text-green-800"
                            : act.action === "DECOMMISSION" || act.action === "DELETE_ASSET"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {act.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-[11px]">
                        {act.entityType}{act.entityId ? `: ${act.entityId}` : ""}
                      </td>
                      <td className="px-6 py-3 text-right text-on-surface-variant">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {!loading && recentActivity.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                        No recent activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Widgets */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Maintenance Schedule Widget */}
          <div className="bg-white rounded border border-[#E2E8F0] p-6 flex flex-col">
            <h3 className="text-[16px] font-bold text-primary mb-4">Upcoming Maintenance</h3>

            <div className="flex flex-col gap-4 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-[#E2E8F0]">
              {/* Item 1 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-secondary flex items-center justify-center shrink-0 z-10 text-secondary font-bold text-xs">
                  24
                </div>
                <div className="flex-1 bg-surface-container-low p-3 rounded border border-outline-variant/30">
                  <div className="text-sm font-semibold text-primary">HVAC System Check</div>
                  <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Building A, Roof
                  </div>
                  <div className="mt-2">
                    <span className="text-[9px] font-bold uppercase tracking-wide bg-error-container text-on-error-container px-1.5 py-0.5 rounded">
                      High Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center shrink-0 z-10 text-on-surface-variant font-bold text-xs">
                  26
                </div>
                <div className="flex-1 bg-surface-bright p-3 rounded border border-outline-variant/30">
                  <div className="text-sm font-semibold text-primary">Fleet Vehicle Calibration</div>
                  <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Bay 4 Garage
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center shrink-0 z-10 text-on-surface-variant font-bold text-xs">
                  28
                </div>
                <div className="flex-1 bg-surface-bright p-3 rounded border border-outline-variant/30">
                  <div className="text-sm font-semibold text-primary">Network Switch Routine</div>
                  <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Server Room B
                  </div>
                </div>
              </div>
            </div>

            <Link href="/maintenance" className="w-full mt-6 py-2 text-center border border-[#E2E8F0] rounded text-primary font-semibold text-sm hover:bg-[#F8FAFC] transition-colors block">
              View Full Schedule
            </Link>
          </div>

          {/* System Status Micro-Widget */}
          <div className="bg-primary text-on-primary rounded p-5 flex items-center justify-between shadow-[0_4px_12px_rgba(4,22,39,0.1)]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006a6a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#006a6a]"></span>
              </div>
              <div>
                <div className="text-sm font-semibold">System Healthy</div>
                <div className="text-xs text-on-primary/70">All nodes operational</div>
              </div>
            </div>
            <CloudLightning className="text-secondary w-8 h-8 opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
