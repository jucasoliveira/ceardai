"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import type { BatchStatus, BatchSummary, OrderSummary } from "@/types";

const STATUS_FLOW: Record<BatchStatus, BatchStatus | null> = {
  announced: "early_access",
  early_access: "live",
  live: "sold_out",
  sold_out: "completed",
  completed: null,
};

export default function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [batch, setBatch] = useState<BatchSummary | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editForm, setEditForm] = useState({
    totalBottles: "",
    bottlesRemaining: "",
    pricePerBottle: "",
    earlyAccessFee: "",
    description: "",
  });

  const fetchBatch = useCallback(async () => {
    try {
      const [batchRes, ordersRes] = await Promise.all([
        fetch(`/api/batches/${id}`),
        fetch(`/api/admin/orders?limit=100`),
      ]);
      const batchData = await batchRes.json();
      const ordersData = await ordersRes.json();

      setBatch(batchData);
      setEditForm({
        totalBottles: String(batchData.totalBottles),
        bottlesRemaining: String(batchData.bottlesRemaining),
        pricePerBottle: String(batchData.pricePerBottle),
        earlyAccessFee: String(batchData.earlyAccessFee),
        description: batchData.description || "",
      });

      // Filter orders for this batch
      const batchOrders = (ordersData.orders || []).filter(
        (o: OrderSummary) => o.batchId === id || String(o.batchId) === id
      );
      setOrders(batchOrders);
    } catch {
      setError("Failed to load batch");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  async function handleAdvanceStatus() {
    if (!batch) return;
    const next = STATUS_FLOW[batch.status];
    if (!next) return;

    if (!confirm(`Advance status from "${batch.status}" to "${next}"?`)) return;

    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/batches/${id}/status`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const data = await res.json();
      setBatch(data.batch);
      setSuccessMsg(data.message);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to advance status");
    } finally {
      setAdvancing(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/batches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalBottles: parseInt(editForm.totalBottles),
          bottlesRemaining: parseInt(editForm.bottlesRemaining),
          pricePerBottle: parseFloat(editForm.pricePerBottle),
          earlyAccessFee: parseFloat(editForm.earlyAccessFee),
          description: editForm.description,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const updated = await res.json();
      setBatch(updated);
      setSuccessMsg("Batch updated successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update batch");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this batch? This cannot be undone."))
      return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/batches/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      router.push("/admin/batches");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete batch");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-charcoal/40 text-sm">Loading batch...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-20">
        <p className="text-charcoal/50 mb-4">Batch not found</p>
        <Link href="/admin/batches" className="text-amber text-sm">
          Back to batches
        </Link>
      </div>
    );
  }

  const nextStatus = STATUS_FLOW[batch.status];
  const inputClass =
    "w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors text-sm";
  const labelClass =
    "block text-xs uppercase tracking-widest text-charcoal/60 mb-2";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/batches"
          className="text-xs uppercase tracking-widest text-charcoal/40 hover:text-amber transition-colors mb-2 inline-block"
        >
          &larr; Back to Batches
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-3xl text-charcoal">
            Batch #{batch.batchNumber} &mdash; {batch.beerName}
          </h1>
          <StatusBadge status={batch.status} />
        </div>
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

      {/* Status Advancement */}
      <div className="bg-white rounded-xl shadow-exhibit p-6 mb-8">
        <h2 className="font-serif text-lg text-charcoal mb-4">
          Batch Lifecycle
        </h2>
        <div className="flex items-center gap-3 mb-4">
          {(
            ["announced", "early_access", "live", "sold_out", "completed"] as BatchStatus[]
          ).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wide font-medium ${
                  s === batch.status
                    ? "bg-amber text-white"
                    : Object.keys(STATUS_FLOW).indexOf(s) <
                      Object.keys(STATUS_FLOW).indexOf(batch.status)
                    ? "bg-forest/20 text-forest"
                    : "bg-charcoal/5 text-charcoal/30"
                }`}
              >
                {s.replace("_", " ")}
              </div>
              {i < 4 && (
                <span className="text-charcoal/20">&rarr;</span>
              )}
            </div>
          ))}
        </div>
        {nextStatus && (
          <button
            onClick={handleAdvanceStatus}
            disabled={advancing}
            className="bg-amber text-white px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors disabled:opacity-50"
          >
            {advancing
              ? "Advancing..."
              : `Advance to ${nextStatus.replace("_", " ")}`}
          </button>
        )}
        {!nextStatus && (
          <p className="text-charcoal/40 text-sm">
            This batch has completed its lifecycle.
          </p>
        )}
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-exhibit p-6 mb-8">
        <h2 className="font-serif text-lg text-charcoal mb-4">Edit Batch</h2>
        <form onSubmit={handleSaveEdit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Total Bottles</label>
              <input
                type="number"
                value={editForm.totalBottles}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, totalBottles: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bottles Remaining</label>
              <input
                type="number"
                value={editForm.bottlesRemaining}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    bottlesRemaining: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price per Bottle (&euro;)</label>
              <input
                type="number"
                step="0.01"
                value={editForm.pricePerBottle}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, pricePerBottle: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Early Access Fee (&euro;)</label>
              <input
                type="number"
                step="0.01"
                value={editForm.earlyAccessFee}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    earlyAccessFee: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-charcoal text-cream px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-burgundy text-white px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-burgundy/90 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Batch"}
            </button>
          </div>
        </form>
      </div>

      {/* Orders for this batch */}
      <div className="bg-white rounded-xl shadow-exhibit overflow-hidden">
        <div className="p-6 border-b border-charcoal/10">
          <h2 className="font-serif text-lg text-charcoal">
            Orders ({orders.length})
          </h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 text-sm">
            No orders for this batch yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    User
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
                    <td className="px-6 py-3 text-charcoal font-mono text-xs">
                      {order.userId}
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
