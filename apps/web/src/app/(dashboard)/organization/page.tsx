"use client";

import React, { useEffect, useState } from "react";
import { Building2, PlusCircle, X, MapPin, User } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { MetricCardSkeleton, DepartmentCardSkeleton } from "@/components/ui/card-skeleton";

export default function Organization() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [orgMetrics, setOrgMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", manager: "", location: "" });
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptsData, metricsData] = await Promise.all([
        apiRequest("/organization/departments"),
        apiRequest("/organization/metrics")
      ]);
      setDepartments(deptsData.data || []);
      setOrgMetrics(metricsData.data || null);
    } catch (err) {
      console.error("Failed to load organization data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const created = await apiRequest("/organization/departments", {
        method: "POST",
        body: JSON.stringify(newDept)
      });
      setDepartments((prev) => [...prev, created.data]);
      setIsModalOpen(false);
      setNewDept({ name: "", manager: "", location: "" });
    } catch (err: any) {
      setFormError(err.message || "Failed to create department");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Organization Setup</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure organizational units, departments, and resource groups.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Organization Metrics */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      ) : orgMetrics ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Organization Name", value: orgMetrics.name, icon: Building2 },
            { label: "Total Departments", value: orgMetrics.department_count, icon: Building2 },
            { label: "Total Employees", value: orgMetrics.employee_count, icon: User }
          ].map((m) => (
            <div key={m.label} className="bg-white rounded border border-[#E2E8F0] p-5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</span>
                <m.icon className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-xl font-bold text-primary">{m.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Departments Grid */}
      <div>
        <h3 className="text-sm font-bold text-on-surface mb-3">Departments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <DepartmentCardSkeleton />
              <DepartmentCardSkeleton />
              <DepartmentCardSkeleton />
            </>
          ) : departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded border border-outline-variant p-5 flex flex-col gap-3 hover:border-secondary transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-primary">{dept.name || "Unnamed Department"}</h4>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                  {(dept.name || "DE").substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-secondary" />
                  Manager: <strong className="text-on-surface">{dept.manager || "Unassigned"}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  {dept.location || "Unknown"}
                </span>
              </div>
            </div>
          ))}
          {!loading && departments.length === 0 && (
            <div className="col-span-full py-8 text-center text-on-surface-variant bg-white rounded border border-outline-variant">
              No departments defined. Add one above.
            </div>
          )}
        </div>
      </div>

      {/* Add Department Modal */}
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
              <Building2 className="w-5 h-5 text-secondary" /> Add New Department
            </h3>
            {formError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">{formError}</div>
            )}
            <form onSubmit={handleCreateDept} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Department Manager *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newDept.manager}
                  onChange={(e) => setNewDept({ ...newDept, manager: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building A, 3rd Floor"
                  value={newDept.location}
                  onChange={(e) => setNewDept({ ...newDept, location: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
