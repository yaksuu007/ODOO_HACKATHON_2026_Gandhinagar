"use client";

import React, { useEffect, useState } from "react";
import { ClipboardCheck, PlusCircle, CheckCircle, RefreshCw, X, ShieldAlert } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { AuditRowSkeleton } from "@/components/ui/card-skeleton";

export default function Audits() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State - Schedule Audit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAudit, setNewAudit] = useState({
    id: "",
    title: "",
    auditor_name: "",
    scheduled_date: ""
  });
  const [formError, setFormError] = useState("");

  // Modal State - Complete Audit
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [resultsText, setResultsText] = useState("");
  const [completeError, setCompleteError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/audits");
      setAudits(data.data || []);
    } catch (err) {
      console.error("Failed to load audits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newAudit.id.startsWith("AD-")) {
      setFormError("Audit ID must start with 'AD-' (e.g., AD-332)");
      return;
    }

    try {
      const created = await apiRequest("/audits", {
        method: "POST",
        body: JSON.stringify(newAudit)
      });
      setAudits((prev) => [...prev, created.data]);
      setIsModalOpen(false);
      setNewAudit({ id: "", title: "", auditor_name: "", scheduled_date: "" });
    } catch (err: any) {
      setFormError(err.message || "Failed to schedule audit");
    }
  };

  const handleCompleteAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompleteError("");

    if (!selectedAuditId) return;

    try {
      const completed = await apiRequest(`/audits/${selectedAuditId}?results=${encodeURIComponent(resultsText)}`, {
        method: "PUT"
      });
      
      setAudits((prev) =>
        prev.map((a) => (a.id === selectedAuditId ? completed.data : a))
      );
      setSelectedAuditId(null);
      setResultsText("");
    } catch (err: any) {
      setCompleteError(err.message || "Failed to complete audit");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Physical Audits</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Conduct inventory reviews, check asset statuses, and log regulatory inspections.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Schedule Audit
        </button>
      </div>

      <div className="bg-white rounded border border-outline-variant overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface flex justify-between items-center">
          <h3 className="text-sm font-bold text-primary">Audit Schedules</h3>
          <button onClick={fetchData} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface">
                <th className="py-3 px-6">Audit ID</th>
                <th className="py-3 px-6">Audit Title</th>
                <th className="py-3 px-6">Assigned Auditor</th>
                <th className="py-3 px-6">Scheduled Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Results / Comments</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
              {loading ? (
                <>
                  <AuditRowSkeleton />
                  <AuditRowSkeleton />
                  <AuditRowSkeleton />
                  <AuditRowSkeleton />
                  <AuditRowSkeleton />
                </>
              ) : audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-6 font-mono text-[11px] text-on-surface-variant">{audit.id}</td>
                  <td className="py-3 px-6 font-semibold">{audit.title}</td>
                  <td className="py-3 px-6 font-medium">{audit.auditor_name}</td>
                  <td className="py-3 px-6 text-on-surface-variant font-mono">{audit.scheduled_date}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      audit.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-on-surface-variant max-w-[200px] truncate">
                    {audit.results || "—"}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {audit.status === "ACTIVE" ? (
                      <button
                        onClick={() => setSelectedAuditId(audit.id)}
                        className="px-2 py-1 bg-secondary text-on-secondary hover:bg-secondary/90 rounded text-[10px] font-bold uppercase flex items-center gap-0.5 cursor-pointer ml-auto"
                      >
                        <CheckCircle className="w-3 h-3" /> Complete
                      </button>
                    ) : (
                      <span className="text-on-surface-variant/40 text-[10px] font-semibold uppercase">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && audits.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                    No audits scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Audit Modal */}
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
              <ClipboardCheck className="w-5 h-5 text-secondary" /> Schedule Physical Audit
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleScheduleAudit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Audit ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AD-332"
                  value={newAudit.id}
                  onChange={(e) => setNewAudit({ ...newAudit, id: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Audit Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Safety Audit"
                  value={newAudit.title}
                  onChange={(e) => setNewAudit({ ...newAudit, title: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Assigned Auditor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newAudit.auditor_name}
                  onChange={(e) => setNewAudit({ ...newAudit, auditor_name: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={newAudit.scheduled_date}
                  onChange={(e) => setNewAudit({ ...newAudit, scheduled_date: e.target.value })}
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
                  Schedule Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Audit Modal */}
      {selectedAuditId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-lg border border-outline-variant max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedAuditId(null)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" /> Complete Audit: {selectedAuditId}
            </h3>

            {completeError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">
                {completeError}
              </div>
            )}

            <form onSubmit={handleCompleteAuditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Audit Findings & Comments *
                </label>
                <textarea
                  required
                  placeholder="Describe details of verified assets, anomalies, or missing hardware"
                  value={resultsText}
                  onChange={(e) => setResultsText(e.target.value)}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary h-28 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAuditId(null)}
                  className="px-4 py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Save Results & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
