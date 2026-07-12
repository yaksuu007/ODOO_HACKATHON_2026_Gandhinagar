"use client";

import React, { useEffect, useState } from "react";
import { History, RefreshCw, Search } from "lucide-react";
import { apiRequest } from "@/utils/api";

const actionColor = (action: string) => {
  if (action.includes("CREATE") || action.includes("REGISTER") || action === "REGISTER")
    return "bg-green-100 text-green-800";
  if (action.includes("DELETE") || action.includes("DECOMMISSION"))
    return "bg-red-100 text-red-800";
  if (action.includes("UPDATE") || action.includes("COMPLETE") || action.includes("ALLOCATE"))
    return "bg-blue-100 text-blue-800";
  return "bg-slate-100 text-slate-700";
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/activity");
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.username.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.entity_type.toLowerCase().includes(q) ||
      l.entity_id.toLowerCase().includes(q) ||
      (l.details && l.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <History className="w-5 h-5 text-secondary" /> Activity Logs
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Full chronological audit trail of all ERP system events and user actions.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded border border-outline-variant overflow-hidden flex flex-col">
        {/* Actions bar */}
        <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search by user, action, or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded pl-8 pr-3 py-1.5 w-full focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
            />
          </div>
          <span className="text-xs text-on-surface-variant">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Entity</th>
                <th className="py-3 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-6 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[9px]">
                        {log.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold capitalize">{log.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${actionColor(log.action)}`}>
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-bold uppercase">
                      {log.entity_type}
                    </span>
                    <span className="ml-1.5 font-mono text-[11px]">{log.entity_id}</span>
                  </td>
                  <td className="py-3 px-6 text-on-surface-variant max-w-[300px] truncate">
                    {log.details || "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                    {loading ? "Loading activity logs..." : "No activity logs matched your search."}
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
