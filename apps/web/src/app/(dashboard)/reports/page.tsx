"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Package, Wrench, DollarSign, PieChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from "recharts";
import { apiRequest } from "@/utils/api";
import { MetricCardSkeleton, MaintenanceRowSkeleton } from "@/components/ui/card-skeleton";

const COLORS = ["#006a6a", "#0ea5e9", "#f59e0b", "#ba1a1a", "#8192a7"];

export default function Reports() {
  const [assets, setAssets] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [assetsData, maintData, allocsData] = await Promise.all([
          apiRequest("/assets"),
          apiRequest("/maintenance"),
          apiRequest("/allocations")
        ]);
        setAssets(assetsData.data || []);
        setMaintenance(maintData.data || []);
        setAllocations(allocsData.data || []);
      } catch (err) {
        console.error("Failed to load report data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Compute category distribution
  const categoryMap: Record<string, number> = {};
  assets.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Compute status breakdown
  const statusData = [
    { name: "Active", value: assets.filter((a) => a.status === "ACTIVE").length, color: "#006a6a" },
    { name: "Maintenance", value: assets.filter((a) => a.status === "MAINTENANCE").length, color: "#f59e0b" },
    { name: "Retired", value: assets.filter((a) => a.status === "RETIRED").length, color: "#94a3b8" }
  ];

  // Maintenance costs per asset
  const maintenanceCostData = maintenance
    .filter((t) => t.cost > 0)
    .map((t) => ({
      name: t.asset_id,
      cost: t.cost,
      priority: t.priority
    }));

  const totalCost = maintenance.reduce((sum, t) => sum + (t.cost || 0), 0);
  const completedTickets = maintenance.filter((t) => t.status === "COMPLETED").length;
  const pendingTickets = maintenance.filter((t) => t.status !== "COMPLETED").length;


  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-on-surface">Reports & Analytics</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Visual summaries of asset performance, maintenance costs, and allocation metrics.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : [
          { label: "Total Assets", value: assets.length, icon: Package, color: "text-secondary" },
          { label: "Total Allocations", value: allocations.length, icon: TrendingUp, color: "text-primary" },
          { label: "Maintenance Cost", value: `$${totalCost.toFixed(2)}`, icon: DollarSign, color: "text-amber-600" },
          { label: "Completed Repairs", value: completedTickets, icon: Wrench, color: "text-green-600" }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded border border-[#E2E8F0] p-5 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="text-2xl font-bold text-primary">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Status Breakdown Pie */}
        <div className="bg-white rounded border border-[#E2E8F0] p-6">
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-secondary" /> Asset Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RechartsPie>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="bg-white rounded border border-[#E2E8F0] p-6">
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-secondary" /> Assets by Category
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#041627", color: "#ffffff", fontSize: "11px", borderRadius: "4px" }}
              />
              <Bar dataKey="value" fill="#006a6a" radius={[2, 2, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Costs Bar Chart */}
        <div className="bg-white rounded border border-[#E2E8F0] p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-600" /> Maintenance Cost per Asset
          </h3>
          {maintenanceCostData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maintenanceCostData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#041627", color: "#ffffff", fontSize: "11px", borderRadius: "4px" }}
                  formatter={(val) => [`$${Number(val).toFixed(2)}`, "Cost"]}
                />
                <Bar dataKey="cost" fill="#f59e0b" radius={[2, 2, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-on-surface-variant text-sm">
              No maintenance cost data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Ticket Summary Table */}
      <div className="bg-white rounded border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface">
          <h3 className="text-sm font-bold text-primary">Maintenance Ticket Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-[#E2E8F0] text-xs font-bold text-on-surface">
                <th className="py-3 px-6">Asset ID</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
              {loading ? (
                <>
                  <MaintenanceRowSkeleton />
                  <MaintenanceRowSkeleton />
                  <MaintenanceRowSkeleton />
                  <MaintenanceRowSkeleton />
                  <MaintenanceRowSkeleton />
                </>
              ) : maintenance.map((t) => (
                <tr key={t.id} className="hover:bg-surface-container-low">
                  <td className="py-3 px-6 font-mono text-[11px] text-on-surface-variant">{t.asset_id}</td>
                  <td className="py-3 px-6 max-w-[280px] truncate">{t.description}</td>
                  <td className="py-3 px-6">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === "HIGH" ? "bg-red-100 text-red-800"
                      : t.priority === "MEDIUM" ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-800"
                    }`}>{t.priority}</span>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === "COMPLETED" ? "bg-green-100 text-green-800"
                      : t.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                    }`}>{t.status}</span>
                  </td>
                  <td className="py-3 px-6 text-right font-semibold">${t.cost?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
              {!loading && maintenance.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                    No maintenance records to report yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
