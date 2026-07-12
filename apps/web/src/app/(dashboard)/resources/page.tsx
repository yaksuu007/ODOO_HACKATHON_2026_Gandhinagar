"use client";

import React, { useEffect, useState } from "react";
import { Calendar, PlusCircle, Clock, MapPin, Shield, Check, X, RefreshCw } from "lucide-react";
import { apiRequest } from "@/utils/api";

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    resource_id: "",
    employee_name: "",
    purpose: "",
    start_time: "",
    end_time: ""
  });
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resData, bookData] = await Promise.all([
        apiRequest("/resources"),
        apiRequest("/resources/bookings")
      ]);
      setResources(resData.data || []);
      setBookings(bookData.data || []);
      
      const availableResources = (resData.data || []).filter(
        (r: { status: string }) => r.status !== "MAINTENANCE"
      );
      if (availableResources.length > 0) {
        setNewBooking((prev) => ({ ...prev, resource_id: availableResources[0].id }));
      } else {
        setNewBooking((prev) => ({ ...prev, resource_id: "" }));
      }
    } catch (err) {
      console.error("Failed to fetch resources/bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newBooking.resource_id) {
      setFormError("Please select a resource.");
      return;
    }

    try {
      const payload = {
        ...newBooking,
        resource_id: newBooking.resource_id,
        start_time: newBooking.start_time.replace("T", " "),
        end_time: newBooking.end_time.replace("T", " ")
      };

      const created = await apiRequest("/resources/bookings", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setBookings((prev) => [...prev, created.data]);
      
      // Update local resource status to BOOKED
      setResources((prev) =>
        prev.map((r) =>
          r.id === payload.resource_id ? { ...r, status: "BOOKED" } : r
        )
      );

      setIsModalOpen(false);
      const availableResources = resources.filter((r) => r.status !== "MAINTENANCE");
      setNewBooking({
        resource_id: availableResources[0]?.id || "",
        employee_name: "",
        purpose: "",
        start_time: "",
        end_time: "",
      });
    } catch (err: any) {
      setFormError(err.message || "Failed to book resource");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Shared Resources</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Book meeting rooms, corporate vehicles, and other shared resources.
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            fetchData();
          }}
          className="bg-secondary text-on-secondary px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
        >
          <Calendar className="w-4 h-4" /> Book Resource
        </button>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res) => (
          <div key={res.id} className="bg-white rounded border border-outline-variant p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm text-primary">{res.name}</h3>
                <span className="text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                  {res.type}
                </span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                res.status === "AVAILABLE"
                  ? "bg-teal-100/50 text-teal-800"
                  : res.status === "BOOKED"
                  ? "bg-blue-100/50 text-blue-800"
                  : "bg-amber-100/50 text-amber-800"
              }`}>
                {res.status}
              </span>
            </div>

            <div className="text-xs text-on-surface-variant flex flex-col gap-1.5 mt-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {res.location}</span>
              {res.capacity > 0 && (
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Capacity: {res.capacity} people</span>
              )}
            </div>
          </div>
        ))}
        {resources.length === 0 && (
          <div className="col-span-full py-8 text-center text-on-surface-variant bg-white rounded border border-outline-variant">
            {loading ? "Loading resources..." : "No shared resources defined."}
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded border border-outline-variant overflow-hidden flex flex-col mt-4">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface flex justify-between items-center">
          <h3 className="text-sm font-bold text-primary">Active Bookings</h3>
          <button onClick={fetchData} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface">
                <th className="py-3 px-6">Resource</th>
                <th className="py-3 px-6">Booked By</th>
                <th className="py-3 px-6">Purpose</th>
                <th className="py-3 px-6">Start Time</th>
                <th className="py-3 px-6">End Time</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-[#E2E8F0]">
              {bookings.map((book) => {
                const res = resources.find((r) => r.id === book.resource_id);
                return (
                  <tr key={book.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-6 font-semibold">{res?.name || "Unknown Resource"}</td>
                    <td className="py-3 px-6 font-medium">{book.employee_name}</td>
                    <td className="py-3 px-6 text-on-surface-variant">{book.purpose}</td>
                    <td className="py-3 px-6 text-on-surface-variant font-mono text-[11px]">{book.start_time}</td>
                    <td className="py-3 px-6 text-on-surface-variant font-mono text-[11px]">{book.end_time}</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-800">
                        {book.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    {loading ? "Loading bookings..." : "No active bookings logged."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Resource Modal */}
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
              <Calendar className="w-5 h-5 text-secondary" /> Book Shared Resource
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleBook} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="resource-select"
                  className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5"
                >
                  Select Resource *
                </label>
                <select
                  id="resource-select"
                  required
                  disabled={resources.length === 0}
                  value={newBooking.resource_id}
                  onChange={(e) => setNewBooking({ ...newBooking, resource_id: e.target.value })}
                  className="w-full min-h-[36px] bg-white border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {resources.length === 0 ? "No resources available" : "Choose a resource..."}
                  </option>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id} disabled={r.status === "MAINTENANCE"}>
                      {r.name} ({r.location}) {r.status === "MAINTENANCE" ? "[IN MAINTENANCE]" : ""}
                    </option>
                  ))}
                </select>
                {resources.length === 0 && !loading && (
                  <p className="mt-1.5 text-[11px] text-on-surface-variant">
                    No shared resources are set up yet. Refresh the page to load defaults.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newBooking.employee_name}
                  onChange={(e) => setNewBooking({ ...newBooking, employee_name: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Purpose of Booking *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Roadmap Review Meeting"
                  value={newBooking.purpose}
                  onChange={(e) => setNewBooking({ ...newBooking, purpose: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newBooking.start_time}
                    onChange={(e) => setNewBooking({ ...newBooking, start_time: e.target.value })}
                    className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newBooking.end_time}
                    onChange={(e) => setNewBooking({ ...newBooking, end_time: e.target.value })}
                    className="w-full bg-surface border border-outline-variant text-on-surface text-xs rounded px-3 py-2 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
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
                  disabled={resources.length === 0 || !newBooking.resource_id}
                  className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
