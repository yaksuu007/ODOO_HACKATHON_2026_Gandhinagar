"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  PlusCircle,
  Download,
  Printer,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Trash2,
  Edit3
} from "lucide-react";
import { apiRequest } from "@/utils/api";
import { AssetRowSkeleton } from "@/components/ui/card-skeleton";

export default function AssetDirectory() {
  const [assets, setAssets] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [density, setDensity] = useState<"standard" | "compact">("standard");
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Laptops",
    "Desktops",
    "Vehicles",
    "Heavy Equipment",
    "Mobile Devices",
  ]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "ACTIVE",
    "MAINTENANCE",
    "ALLOCATED",
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    id: "",
    name: "",
    category: "Laptops",
    department_id: "",
    status: "ACTIVE",
    assigned_to: "",
    description: "",
    serial_number: "",
    cost: 0,
    purchase_date: "",
  });
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsData, deptsData] = await Promise.all([
        apiRequest("/assets"),
        apiRequest("/organization/departments"),
      ]);
      setAssets(assetsData.data || []);
      setDepartments(deptsData.data || []);
      if (deptsData.data && deptsData.data.length > 0) {
        setNewAsset((prev) => ({ ...prev, department_id: deptsData.data[0].id }));
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter application
  useEffect(() => {
    let result = assets;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          (a.assigned_to && a.assigned_to.toLowerCase().includes(q))
      );
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((a) => selectedCategories.includes(a.category));
    }

    // Status Filter
    if (selectedStatuses.length > 0) {
      result = result.filter((a) => selectedStatuses.includes(a.status));
    }

    setFilteredAssets(result);
  }, [assets, search, selectedCategories, selectedStatuses]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleStatus = (stat: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSearch("");
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete asset ${id}?`)) {
      try {
        await apiRequest(`/assets/${id}`, { method: "DELETE" });
        setAssets((prev) => prev.filter((a) => a.id !== id));
      } catch (error: any) {
        alert(error.message || "Failed to delete asset");
      }
    }
  };

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newAsset.id.startsWith("AST-")) {
      setFormError("Asset ID must start with 'AST-' (e.g. AST-1050)");
      return;
    }

    try {
      const payload = {
        ...newAsset,
        department_id: newAsset.department_id || null,
        cost: parseFloat(newAsset.cost as any) || 0.0,
      };

      const created = await apiRequest("/assets", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAssets((prev) => [...prev, created.data]);
      setIsModalOpen(false);
      // Reset form
      setNewAsset({
        id: "",
        name: "",
        category: "Laptops",
        department_id: departments[0]?.id || "",
        status: "ACTIVE",
        assigned_to: "",
        description: "",
        serial_number: "",
        cost: 0,
        purchase_date: "",
      });
    } catch (error: any) {
      setFormError(error.message || "Failed to register asset");
    }
  };

  const categories = ["Laptops", "Desktops", "Vehicles", "Heavy Equipment", "Mobile Devices"];
  const statuses = [
    { label: "Active", val: "ACTIVE" },
    { label: "In Maintenance", val: "MAINTENANCE" },
    { label: "Allocated", val: "ALLOCATED" },
    { label: "Retired", val: "RETIRED" },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Asset Directory</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage and track organizational assets across departments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Register New Asset
        </button>
      </div>

      <div className="flex flex-1 gap-6">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block bg-surface-container-lowest border border-outline-variant rounded p-4 h-fit">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-outline" /> Filters
            </h3>
            <button onClick={clearFilters} className="text-secondary text-xs hover:underline">
              Clear all
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-on-surface-variant mb-3 uppercase tracking-wide">
              Category
            </h4>
            <div className="space-y-2 text-xs text-on-surface">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary/20 w-4 h-4"
                  />
                  <span className="group-hover:text-secondary transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant mb-3 uppercase tracking-wide">
              Status
            </h4>
            <div className="space-y-2 text-xs text-on-surface">
              {statuses.map((stat) => (
                <label key={stat.val} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(stat.val)}
                    onChange={() => toggleStatus(stat.val)}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary/20 w-4 h-4"
                  />
                  <span className="group-hover:text-secondary transition-colors">{stat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Data Table Area */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
          {/* Table Actions Bar */}
          <div className="p-3 border-b border-outline-variant bg-surface flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors" title="Export">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors" title="Print">
                <Printer className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-outline-variant mx-2"></div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded pl-8 pr-3 py-1 w-48 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant">Density:</span>
              <div className="flex border border-outline-variant rounded overflow-hidden">
                <button
                  onClick={() => setDensity("standard")}
                  className={`px-2 py-1 text-xs ${
                    density === "standard"
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface text-on-surface hover:bg-surface-container"
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setDensity("compact")}
                  className={`px-2 py-1 text-xs ${
                    density === "compact"
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface text-on-surface hover:bg-surface-container"
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface">
                  <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary/20" /></th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 w-12 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
                {loading ? (
                  <>
                    <AssetRowSkeleton />
                    <AssetRowSkeleton />
                    <AssetRowSkeleton />
                    <AssetRowSkeleton />
                    <AssetRowSkeleton />
                  </>
                ) : filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-2.5 px-4"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary/20" /></td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-on-surface-variant">{asset.id}</td>
                    <td className="py-2.5 px-4 font-semibold">{asset.name}</td>
                    <td className="py-2.5 px-4">{asset.category}</td>
                    <td className="py-2.5 px-4">
                      {departments.find((d) => d.id === asset.department_id)?.name || "Unassigned"}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        asset.status === "ACTIVE"
                          ? "bg-teal-100/50 text-teal-800"
                          : asset.status === "MAINTENANCE"
                          ? "bg-amber-100/50 text-amber-800"
                          : asset.status === "ALLOCATED"
                          ? "bg-blue-100/50 text-blue-800"
                          : "bg-slate-100/50 text-slate-800"
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {asset.assigned_to ? (
                        <div className="flex items-center gap-2">
                          {asset.avatar_url ? (
                            <img
                              src={asset.avatar_url}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover border border-outline-variant"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[9px]">
                              {asset.assigned_to.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span>{asset.assigned_to}</span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/40">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-red-600 p-1 rounded hover:bg-surface-container"
                          title="Delete asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredAssets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                      No assets matched the active filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-outline-variant bg-surface flex items-center justify-between mt-auto">
            <span className="text-xs text-on-surface-variant">
              Showing 1-{filteredAssets.length} of {filteredAssets.length} assets
            </span>
            <div className="flex gap-1">
              <button className="p-1 text-outline rounded hover:bg-surface-container"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 text-outline rounded hover:bg-surface-container"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Register Asset Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-lg border border-outline-variant max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-secondary" /> Register New Asset
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterAsset} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Asset ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AST-1045"
                  value={newAsset.id}
                  onChange={(e) => setNewAsset({ ...newAsset, id: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Asset Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro 14"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <select
                  value={newAsset.department_id}
                  onChange={(e) => setNewAsset({ ...newAsset, department_id: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  <option value="">Unassigned</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={newAsset.status}
                  onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Assigned Personnel
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={newAsset.assigned_to}
                  onChange={(e) => setNewAsset({ ...newAsset, assigned_to: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Serial Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. C02GG555Q05D"
                  value={newAsset.serial_number}
                  onChange={(e) => setNewAsset({ ...newAsset, serial_number: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Purchase Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2499.00"
                  value={newAsset.cost || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Asset Description
                </label>
                <textarea
                  placeholder="Provide technical specifications or details"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary h-20 resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
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
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
