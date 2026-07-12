"use client";

import React, { useEffect, useState } from "react";
import { Wrench, PlusCircle, Trash2, CheckCircle, RefreshCw, X, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { MaintenancePageRowSkeleton } from "@/components/ui/card-skeleton";

export default function Maintenance() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    asset_id: "",
    description: "",
    priority: "MEDIUM",
    scheduled_date: "",
    cost: 0
  });
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsData, assetsData] = await Promise.all([
        apiRequest("/maintenance"),
        apiRequest("/assets")
      ]);
      setTickets(ticketsData.data || []);
      setAssets(assetsData.data || []);
      
      if (assetsData.data && assetsData.data.length > 0) {
        setNewTicket((prev) => ({ ...prev, asset_id: assetsData.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newTicket.asset_id) {
      setFormError("Please select an asset.");
      return;
    }

    try {
      const payload = {
        ...newTicket,
        cost: parseFloat(newTicket.cost as any) || 0.0
      };

      const created = await apiRequest("/maintenance", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setTickets((prev) => [...prev, created.data]);
      
      // Reload assets list to reflect status update to MAINTENANCE
      const updatedAssets = await apiRequest("/assets");
      setAssets(updatedAssets.data || []);

      setIsModalOpen(false);
      setNewTicket({
        asset_id: assets[0]?.id || "",
        description: "",
        priority: "MEDIUM",
        scheduled_date: "",
        cost: 0
      });
    } catch (err: any) {
      setFormError(err.message || "Failed to log maintenance ticket");
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const response = await apiRequest(`/maintenance/${ticketId}?ticket_status=${status}`, {
        method: "PUT"
      });
      
      // Update local state
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? response.data : t))
      );
      
      // If completed, reload assets to verify asset status returned to ACTIVE
      if (status === "COMPLETED") {
        const updatedAssets = await apiRequest("/assets");
        setAssets(updatedAssets.data || []);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Maintenance Management</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Schedule routine calibrations, log malfunctions, and track repair ticket costs.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
        >
          <Wrench className="w-4 h-4" /> Log Repair Ticket
        </button>
      </div>

      <div className="bg-white rounded border border-outline-variant overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface flex justify-between items-center">
          <h3 className="text-sm font-bold text-primary">Active Tickets</h3>
          <button onClick={fetchData} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface">
                <th className="py-3 px-6">Asset ID</th>
                <th className="py-3 px-6">Asset Name</th>
                <th className="py-3 px-6">Malfunction / Issue</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Scheduled</th>
                <th className="py-3 px-6">Cost</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
              {loading ? (
                <>
                  <MaintenancePageRowSkeleton />
                  <MaintenancePageRowSkeleton />
                  <MaintenancePageRowSkeleton />
                  <MaintenancePageRowSkeleton />
                  <MaintenancePageRowSkeleton />
                </>
              ) : tickets.map((t) => {
                const asset = assets.find((as) => as.id === t.asset_id);
                return (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-6 font-mono text-[11px] text-on-surface-variant">{t.asset_id}</td>
                    <td className="py-3 px-6 font-semibold">{asset?.name || "Unknown Asset"}</td>
                    <td className="py-3 px-6 text-on-surface-variant max-w-[240px] truncate">{t.description}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : t.priority === "MEDIUM"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {t.priority === "HIGH" && <AlertTriangle className="w-3 h-3" />}
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-on-surface-variant font-mono">{t.scheduled_date}</td>
                    <td className="py-3 px-6 font-semibold">${t.cost?.toFixed(2)}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-850"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {t.status !== "COMPLETED" ? (
                        <div className="flex justify-end gap-1.5">
                          {t.status === "PENDING" && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "IN_PROGRESS")}
                              className="px-2 py-1 bg-surface-container hover:bg-secondary/10 hover:text-secondary rounded text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Start
                            </button>
                          )}
                          {t.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "COMPLETED")}
                              className="px-2 py-1 bg-secondary text-on-secondary hover:bg-secondary/90 rounded text-[10px] font-bold uppercase flex items-center gap-0.5 cursor-pointer"
                            >
                              <CheckCircle className="w-3 h-3" /> Complete
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/40 text-[10px] font-semibold uppercase">Resolved</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!loading && tickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                    No active maintenance tickets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-lg border border-outline-variant max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-secondary" /> Log Maintenance Ticket
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Select Asset *
                </label>
                <select
                  required
                  value={newTicket.asset_id}
                  onChange={(e) => setNewTicket({ ...newTicket, asset_id: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} — {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Issue Description *
                </label>
                <textarea
                  required
                  placeholder="Describe the malfunction, damage, or required checks"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Est. Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={newTicket.cost || ""}
                    onChange={(e) => setNewTicket({ ...newTicket, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={newTicket.scheduled_date}
                  onChange={(e) => setNewTicket({ ...newTicket, scheduled_date: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
