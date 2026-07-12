"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Lock, User, AlertCircle } from "lucide-react";
import { apiRequest, setAuthToken } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      });
      const token = data.access_token || data.data?.access_token;
      if (token) {
        setAuthToken(token);
        router.push("/");
      } else {
        setError("Failed to get authentication token");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
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
          <h2 className="text-2xl font-bold text-primary">Welcome to AssetFlow</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Enterprise Resource Planning ERP
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container text-sm rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
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
                placeholder="Enter your password"
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded pl-10 pr-4 py-2.5 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-semibold text-sm py-2.5 rounded hover:bg-primary-container transition-colors mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Don't have an account?{" "}
          <Link href="/signup" className="text-secondary font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
