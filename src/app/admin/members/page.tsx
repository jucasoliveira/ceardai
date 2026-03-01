"use client";

import { useState, useEffect } from "react";
import TierBadge from "@/components/TierBadge";
import Link from "next/link";
import type { UserTier } from "@/types";

interface User {
  _id: string;
  name: string;
  email: string;
  tier: UserTier;
  createdAt: string;
}

const TIER_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Founder", value: "founder" },
  { label: "Early Buyer", value: "early_buyer" },
  { label: "Consumer", value: "consumer" },
];

export default function AdminMembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTier, setActiveTier] = useState("all");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const query = activeTier !== "all" ? `?tier=${activeTier}` : "";
        const res = await fetch(`/api/admin/users${query}`);
        const data = await res.json();
        setUsers(data);
      } catch {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [activeTier]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Members</h1>
        <p className="text-charcoal/50 text-sm mt-1">
          Manage member accounts and tiers
        </p>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex border-b border-charcoal/10 mb-6">
        {TIER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTier(tab.value)}
            className={`px-4 pb-3 text-sm uppercase tracking-widest transition-colors ${
              activeTier === tab.value
                ? "text-charcoal border-b-2 border-amber"
                : "text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-exhibit overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal/40 text-sm">
            Loading members...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 text-sm">
            No members found
          </div>
        ) : (
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
                    Tier
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-charcoal font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">{user.email}</td>
                    <td className="px-6 py-3">
                      <TierBadge tier={user.tier || "consumer"} />
                    </td>
                    <td className="px-6 py-3 text-charcoal/50">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/members/${user._id}`}
                        className="text-amber text-xs uppercase tracking-widest hover:text-amber/80 transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
