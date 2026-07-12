"use client";

import React, { useEffect, useState } from "react";
import { UserCheck, PlusCircle, Search, RefreshCw, X } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { AllocationRowSkeleton } from "@/components/ui/card-skeleton";

export default function Allocations() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlloc, setNewAlloc] = useState({
    asset_id: "",
    employee_name: "",
    department: "",
    notes: ""
  });
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allocsData, assetsData, deptsData] = await Promise.all([
        apiRequest("/allocations"),
        apiRequest("/assets"),
        apiRequest("/organization/departments")
      ]);
      setAllocations(allocsData.data || []);
      setAssets(assetsData.data || []);
      setDepartments(deptsData.data || []);
      
      // Default selections for form
      const unassigned = (assetsData.data || []).filter((a: any) => !a.assigned_to);
      setNewAlloc({
        asset_id: unassigned[0]?.id || "",
        employee_name: "",
        department: (deptsData.data || [])[0]?.name || "",
        notes: ""
      });
    } catch (err) {
      console.error("Failed to load allocations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newAlloc.asset_id) {
      setFormError("Please select an asset to allocate.");
      return;
    }

    try {
      const created = await apiRequest("/allocations", {
        method: "POST",
        body: JSON.stringify(newAlloc)
      });
      setAllocations((prev) => [...prev, created.data]);
      
      // Reload assets list to reflect assignment update
      const updatedAssets = await apiRequest("/assets");
      setAssets(updatedAssets.data || []);
      
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to create allocation");
    }
  };

  const filteredAllocations = allocations.filter((a) => {
    const q = search.toLowerCase();
    const assetName = assets.find((as) => as.id === a.asset_id)?.name || "";
    return (
      a.asset_id.toLowerCase().includes(q) ||
      a.employee_name.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      assetName.toLowerCase().includes(q)
    );
  });

  const availableAssets = assets.filter((a) => !a.assigned_to);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Asset Allocations</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Assign and manage equipment distribution to employees and organizational teams.
          </p>
        </div>
        <button
          onClick={() => {
            if (availableAssets.length === 0) {
              alert("No available assets to allocate. Register a new asset first!");
              return;
            }
            setIsModalOpen(true);
          }}
          className="bg-secondary text-on-secondary px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
        >
          <UserCheck className="w-4 h-4" /> Allocate Asset
        </button>
      </div>

      <div className="bg-white rounded border border-outline-variant overflow-hidden flex flex-col">
        {/* Actions bar */}
        <div className="p-3 border-b border-outline-variant bg-surface flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search allocations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded pl-8 pr-3 py-1.5 w-full focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface">
                <th className="py-3 px-6">Asset ID</th>
                <th className="py-3 px-6">Asset Name</th>
                <th className="py-3 px-6">Assigned Employee</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Allocation Date</th>
                <th className="py-3 px-6">Notes</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
              {loading ? (
                <>
                  <AllocationRowSkeleton />
                  <AllocationRowSkeleton />
                  <AllocationRowSkeleton />
                  <AllocationRowSkeleton />
                  <AllocationRowSkeleton />
                </>
              ) : filteredAllocations.map((alloc) => {
                const asset = assets.find((as) => as.id === alloc.asset_id);
                return (
                  <tr key={alloc.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-6 font-mono text-[11px] text-on-surface-variant">{alloc.asset_id}</td>
                    <td className="py-3 px-6 font-semibold">{asset?.name || "Unknown Asset"}</td>
                    <td className="py-3 px-6 font-medium">{alloc.employee_name}</td>
                    <td className="py-3 px-6">{alloc.department}</td>
                    <td className="py-3 px-6 text-on-surface-variant">{alloc.allocated_at}</td>
                    <td className="py-3 px-6 text-on-surface-variant max-w-[200px] truncate">{alloc.notes || "—"}</td>
                  </tr>
                );
              })}
              {!loading && filteredAllocations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    No allocation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
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
              <UserCheck className="w-5 h-5 text-secondary" /> Allocate Asset
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleAllocate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Select Available Asset *
                </label>
                <select
                  required
                  value={newAlloc.asset_id}
                  onChange={(e) => setNewAlloc({ ...newAlloc, asset_id: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  {availableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} — {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Employee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Chen"
                  value={newAlloc.employee_name}
                  onChange={(e) => setNewAlloc({ ...newAlloc, employee_name: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Department *
                </label>
                <select
                  required
                  value={newAlloc.department}
                  onChange={(e) => setNewAlloc({ ...newAlloc, department: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Notes
                </label>
                <textarea
                  placeholder="Reason for allocation, project name, etc."
                  value={newAlloc.notes}
                  onChange={(e) => setNewAlloc({ ...newAlloc, notes: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary h-20 resize-none"
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
                  Assign Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
