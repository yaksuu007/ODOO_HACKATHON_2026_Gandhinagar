"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Lock, User, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/utils/api";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password, role }),
      });
      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-outline-variant p-8 shadow-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-3">
            <Package className="text-on-secondary w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Create an Account</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Register your AssetFlow ERP workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container text-sm rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 text-sm rounded flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded pl-10 pr-4 py-2.5 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded pl-10 pr-4 py-2.5 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded pl-10 pr-4 py-2.5 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded px-3 py-2.5 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Administrator</option>
              <option value="AUDITOR">Auditor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-semibold text-sm py-2.5 rounded hover:bg-primary-container transition-colors mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Workspace"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
