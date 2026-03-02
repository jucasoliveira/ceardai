"use client";

import { useState, useEffect, useCallback } from "react";
import type { FounderSummary, WaitingListEntry } from "@/types";

interface Slot {
  spotNumber: number;
  founder: FounderSummary | null;
}

export default function AdminFoundersPage() {
  const [founders, setFounders] = useState<FounderSummary[]>([]);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFounders = useCallback(async () => {
    try {
      const res = await fetch("/api/founders");
      const data = await res.json();
      setFounders(data);
    } catch {
      console.error("Failed to fetch founders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWaitingList = useCallback(async () => {
    try {
      const res = await fetch("/api/founders/waiting-list");
      if (res.ok) {
        const data = await res.json();
        setWaitingList(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchFounders();
    fetchWaitingList();
  }, [fetchFounders, fetchWaitingList]);

  const slots: Slot[] = Array.from({ length: 14 }, (_, i) => {
    const spotNumber = i + 1;
    const founder = founders.find((f) => f.spotNumber === spotNumber) || null;
    return { spotNumber, founder };
  });

  const filledCount = founders.filter((f) => f.isActive).length;

  function openAddForm(spotNumber: number) {
    setShowForm(spotNumber);
    setName("");
    setEmail("");
    setError("");
    setSuccess("");
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!showForm) return;
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/founders/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send invite");
        return;
      }

      setSuccess(data.message);
      setShowForm(null);
      fetchFounders();
      fetchWaitingList();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(founderId: string) {
    if (!confirm("Remove this founder?")) return;

    try {
      await fetch(`/api/founders/${founderId}`, { method: "DELETE" });
      fetchFounders();
    } catch {
      console.error("Failed to remove founder");
    }
  }

  async function handlePromote(entryId: string) {
    if (!confirm("Promote this person from the waiting list?")) return;

    try {
      const res = await fetch("/api/founders/waiting-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });

      if (res.ok) {
        fetchFounders();
        fetchWaitingList();
      }
    } catch {
      console.error("Failed to promote");
    }
  }

  function inviteStatusBadge(status: string) {
    const styles: Record<string, string> = {
      sent: "bg-amber/20 text-amber",
      accepted: "bg-forest/20 text-forest",
      pending: "bg-charcoal/10 text-charcoal/60",
    };
    return (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
          styles[status] || styles.pending
        }`}
      >
        {status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-charcoal/40 text-sm">
        Loading founders...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Founders</h1>
        <p className="text-charcoal/50 text-sm mt-1">
          Manage the 14 founding member slots
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-exhibit p-6 mb-8">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1">
              Filled Slots
            </p>
            <p className="text-3xl font-serif text-charcoal">
              {filledCount}
              <span className="text-charcoal/30 text-lg">/14</span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1">
              Available
            </p>
            <p className="text-3xl font-serif text-forest">{14 - filledCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1">
              Waiting List
            </p>
            <p className="text-3xl font-serif text-amber">{waitingList.length}</p>
          </div>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 p-3 bg-forest/10 text-forest text-sm rounded-lg">
          {success}
        </div>
      )}

      {/* Invite Founder Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-exhibit p-6 mb-8">
          <h2 className="font-serif text-lg text-charcoal mb-4">
            Invite Founder — Spot #{showForm}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleInvite} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Founder name"
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="founder@example.com"
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
              <p className="text-xs text-charcoal/40 mt-1">
                An invite email will be sent to this address
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-charcoal text-cream px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Sending..." : "Send Invite"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(null)}
                className="px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest text-charcoal/50 hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 14-Slot Grid */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {slots.map(({ spotNumber, founder }) => (
          <div
            key={spotNumber}
            className={`bg-white rounded-xl shadow-exhibit p-4 text-center transition-shadow hover:shadow-exhibit-hover ${
              founder && founder.isActive
                ? "border-l-4 border-gold"
                : "border-l-4 border-charcoal/10"
            }`}
          >
            <p className="text-xs text-charcoal/30 uppercase tracking-widest mb-2">
              Spot {spotNumber}
            </p>
            {founder && founder.isActive ? (
              <>
                <p className="text-sm font-medium text-charcoal truncate mb-1">
                  {founder.name}
                </p>
                <div className="mb-2">
                  {inviteStatusBadge(founder.inviteStatus)}
                </div>
                <p className="text-xs text-charcoal/40 mb-3">
                  {founder.allocationPerBatch} bottles/batch
                </p>
                <button
                  onClick={() => handleRemove(founder._id)}
                  className="text-xs text-burgundy/60 hover:text-burgundy uppercase tracking-widest transition-colors"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-forest/60 mb-3">Available</p>
                <button
                  onClick={() => openAddForm(spotNumber)}
                  className="text-xs text-amber hover:text-amber/80 uppercase tracking-widest transition-colors"
                >
                  + Invite
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Founder Details Table */}
      {founders.length > 0 && (
        <div className="bg-white rounded-xl shadow-exhibit overflow-hidden mt-8">
          <div className="p-6 border-b border-charcoal/10">
            <h2 className="font-serif text-lg text-charcoal">
              Founder Details
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Spot
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Invite
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Allocation
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Used Invite
                  </th>
                </tr>
              </thead>
              <tbody>
                {founders.map((founder) => (
                  <tr
                    key={founder._id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-charcoal">
                      #{founder.spotNumber}
                    </td>
                    <td className="px-6 py-3 text-charcoal">{founder.name}</td>
                    <td className="px-6 py-3 text-charcoal/70 text-xs">
                      {founder.email}
                    </td>
                    <td className="px-6 py-3">
                      {inviteStatusBadge(founder.inviteStatus)}
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">
                      {founder.allocationPerBatch} bottles/batch
                    </td>
                    <td className="px-6 py-3 text-charcoal/60 text-xs">
                      {founder.hasUsedInvite ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Waiting List */}
      {waitingList.length > 0 && (
        <div className="bg-white rounded-xl shadow-exhibit overflow-hidden mt-8">
          <div className="p-6 border-b border-charcoal/10">
            <h2 className="font-serif text-lg text-charcoal">Waiting List</h2>
            <p className="text-xs text-charcoal/40 mt-1">
              People waiting for a founder spot to open up
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Added
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {waitingList.map((entry) => (
                  <tr
                    key={entry._id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-charcoal">{entry.name}</td>
                    <td className="px-6 py-3 text-charcoal/70 text-xs">
                      {entry.email}
                    </td>
                    <td className="px-6 py-3 text-charcoal/50 text-xs">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handlePromote(entry._id)}
                        disabled={filledCount >= 14}
                        className="text-xs text-amber hover:text-amber/80 uppercase tracking-widest transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Promote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
