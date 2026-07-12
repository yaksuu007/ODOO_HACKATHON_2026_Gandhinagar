"use client";

import React, { useEffect, useState } from "react";
import { Settings, User, Mail, Shield, CheckCircle } from "lucide-react";
import { apiRequest } from "@/utils/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiRequest("/auth/me")
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary" /> Profile & Settings
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Manage your personal account information and preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded border border-outline-variant p-6 flex flex-col gap-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xl border-2 border-secondary/30">
            {user?.username?.substring(0, 2).toUpperCase() || "AD"}
          </div>
          <div>
            <h3 className="font-bold text-base text-primary capitalize">{user?.username}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
              user?.role === "ADMIN" ? "bg-primary-container text-on-primary-container"
              : user?.role === "AUDITOR" ? "bg-amber-100 text-amber-800"
              : "bg-surface-container text-on-surface-variant"
            }`}>
              <Shield className="w-2.5 h-2.5" /> {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
                <input
                  type="text"
                  value={user?.username || ""}
                  readOnly
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded pl-9 pr-3 py-2.5 outline-none cursor-not-allowed opacity-60"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded pl-9 pr-3 py-2.5 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Role
            </label>
            <input
              type="text"
              value={user?.role || ""}
              readOnly
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded px-3 py-2.5 outline-none cursor-not-allowed opacity-60"
            />
            <p className="text-[10px] text-on-surface-variant/60 mt-1">Role is managed by your system administrator.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Account Created
            </label>
            <input
              type="text"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
              readOnly
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded px-3 py-2.5 outline-none cursor-not-allowed opacity-60"
            />
          </div>

          {saved && (
            <div className="p-3 bg-green-100 text-green-800 text-xs rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Settings saved successfully.
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* System Info */}
      <div className="bg-white rounded border border-outline-variant p-6">
        <h4 className="text-sm font-bold text-primary mb-4">System Information</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {[
            { label: "Platform", value: "AssetFlow ERP v1.0" },
            { label: "Backend", value: "FastAPI + SQLite" },
            { label: "Frontend", value: "Next.js + Tailwind CSS" },
            { label: "Environment", value: "Development" }
          ].map((item) => (
            <div key={item.label}>
              <span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-wide block mb-0.5">{item.label}</span>
              <span className="text-on-surface font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
