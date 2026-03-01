"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import TierBadge from "@/components/TierBadge";
import Link from "next/link";
import type { UserTier, OrderSummary } from "@/types";

interface User {
  _id: string;
  name: string;
  email: string;
  tier: UserTier;
  createdAt: string;
}

const TIERS: { value: UserTier; label: string }[] = [
  { value: "consumer", label: "Consumer" },
  { value: "early_buyer", label: "Early Buyer" },
  { value: "founder", label: "Founder" },
  { value: "admin", label: "Admin" },
];

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTier, setSelectedTier] = useState<UserTier>("consumer");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([
        fetch(`/api/admin/users/${id}`),
        fetch(`/api/admin/orders?limit=100`),
      ]);
      const userData = await userRes.json();
      const ordersData = await ordersRes.json();

      setUser(userData);
      setSelectedTier(userData.tier || "consumer");

      // Filter orders for this user
      const userOrders = (ordersData.orders || []).filter(
        (o: OrderSummary) => o.userId === id || o.userId === userData.id
      );
      setOrders(userOrders);
    } catch {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleTierChange() {
    if (!user) return;
    if (selectedTier === user.tier) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const updated = await res.json();
      setUser((prev) => (prev ? { ...prev, tier: updated.tier } : prev));
      setSuccessMsg("Tier updated successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tier");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-charcoal/40 text-sm">Loading member...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-charcoal/50 mb-4">User not found</p>
        <Link href="/admin/members" className="text-amber text-sm">
          Back to members
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/members"
          className="text-xs uppercase tracking-widest text-charcoal/40 hover:text-amber transition-colors mb-2 inline-block"
        >
          &larr; Back to Members
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-3xl text-charcoal">{user.name}</h1>
          <TierBadge tier={user.tier || "consumer"} />
        </div>
        <p className="text-charcoal/50 text-sm mt-1">{user.email}</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-3 bg-forest/10 text-forest text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      {/* User Info & Tier Management */}
      <div className="bg-white rounded-xl shadow-exhibit p-6 mb-8">
        <h2 className="font-serif text-lg text-charcoal mb-4">
          Member Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm mb-6">
          <div>
            <p className="text-charcoal/40 mb-1">Name</p>
            <p className="text-charcoal font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-charcoal/40 mb-1">Email</p>
            <p className="text-charcoal font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-charcoal/40 mb-1">Joined</p>
            <p className="text-charcoal font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-charcoal/10">
          <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
            Change Tier
          </label>
          <div className="flex items-center gap-3">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as UserTier)}
              className="px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors text-sm"
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleTierChange}
              disabled={saving || selectedTier === user.tier}
              className="bg-charcoal text-cream px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Tier"}
            </button>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl shadow-exhibit overflow-hidden">
        <div className="p-6 border-b border-charcoal/10">
          <h2 className="font-serif text-lg text-charcoal">
            Order History ({orders.length})
          </h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 text-sm">
            No orders from this member
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Beer
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Batch
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Qty
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-charcoal">{order.beerName}</td>
                    <td className="px-6 py-3 text-charcoal/70">
                      #{order.batchNumber}
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-3 text-charcoal font-medium">
                      &euro;{order.totalAmount}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-charcoal/10 text-charcoal/60">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-charcoal/50">
                      {new Date(order.createdAt).toLocaleDateString()}
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
