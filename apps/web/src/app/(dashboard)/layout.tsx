"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Package,
  UserCheck,
  Calendar,
  Wrench,
  ClipboardCheck,
  BarChart3,
  History,
  Settings,
  Bell,
  Grid,
  Search,
  Plus,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { apiRequest, removeAuthToken } from "@/utils/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch profile to verify token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    apiRequest("/auth/me")
      .then((data) => {
        setUser(data.data || data);
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        removeAuthToken();
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/organization", label: "Organization", icon: Building2 },
    { href: "/assets", label: "Assets", icon: Package },
    { href: "/allocations", label: "Allocations", icon: UserCheck },
    { href: "/resources", label: "Resources", icon: Calendar },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/audits", label: "Audits", icon: ClipboardCheck },
    { href: "/reports", label: "Reports", icon: BarChart3 },
  ];

  const footerLinks = [
    { href: "/activity", label: "Activity Logs", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex text-on-surface bg-surface font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex bg-primary fixed left-0 top-0 h-full w-[260px] flex-col py-6 z-20 border-none">
        {/* Brand Header */}
        <div className="px-6 mb-8 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center shrink-0">
              <Package className="text-on-secondary w-5 h-5" />
            </div>
            <h1 className="text-[22px] leading-[30px] font-bold text-on-primary m-0 truncate">
              AssetFlow ERP
            </h1>
          </div>
          <p className="text-[10px] uppercase font-bold text-on-primary/60 tracking-wider">
            Enterprise Resource Planning
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded border-l-4 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "border-secondary bg-primary-container/30 text-on-primary font-semibold"
                    : "border-transparent text-on-primary/70 hover:text-on-primary hover:bg-primary-container/15"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto px-4 flex flex-col gap-1 border-t border-primary-container/40 pt-4">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded border-l-4 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "border-secondary bg-primary-container/30 text-on-primary font-semibold"
                    : "border-transparent text-on-primary/70 hover:text-on-primary hover:bg-primary-container/15"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded border-l-4 border-transparent text-on-primary/70 hover:text-red-400 hover:bg-primary-container/15 transition-colors duration-200 cursor-pointer w-full text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-0 lg:ml-[260px] w-full">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full h-16 px-6 sticky top-0 z-10">
          {/* Mobile Menu Button & Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded pl-10 pr-4 py-2 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-on-surface-variant/60"
                placeholder="Search assets, resources, or audits..."
                type="text"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 mr-4">
              <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-medium">
                Help
              </span>
              <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-medium">
                Support
              </span>
            </nav>

            <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container cursor-pointer relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container cursor-pointer">
                <Grid className="w-5 h-5" />
              </button>
              {user && (
                <div className="flex items-center gap-3 ml-2 border-l border-outline-variant pl-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-primary capitalize">
                      {user.email || user.username}
                    </div>
                    <div className="text-[10px] text-on-surface-variant capitalize">
                      {user.role || 'User'}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center border border-outline-variant font-bold text-sm">
                    {(user.email || user.username || 'U').substring(0, 2).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            {/* Drawer */}
            <aside
              className="w-[260px] bg-primary h-full flex flex-col py-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center shrink-0">
                    <Package className="text-on-secondary w-5 h-5" />
                  </div>
                  <h1 className="text-lg font-bold text-on-primary truncate">
                    AssetFlow ERP
                  </h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-on-primary/70 hover:text-on-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded border-l-4 transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "border-secondary bg-primary-container/30 text-on-primary font-semibold"
                          : "border-transparent text-on-primary/70 hover:text-on-primary hover:bg-primary-container/15"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto px-4 flex flex-col gap-1 border-t border-primary-container/40 pt-4">
                {footerLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded border-l-4 transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "border-secondary bg-primary-container/30 text-on-primary font-semibold"
                          : "border-transparent text-on-primary/70 hover:text-on-primary hover:bg-primary-container/15"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-2 rounded border-l-4 border-transparent text-on-primary/70 hover:text-red-400 hover:bg-primary-container/15 transition-colors duration-200 cursor-pointer w-full text-left"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Dashboard Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F4F7F9]">
          {children}
        </main>
      </div>
    </div>
  );
}
