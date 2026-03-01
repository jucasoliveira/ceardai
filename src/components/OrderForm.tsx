"use client";

import { useState } from "react";
import type { BatchSummary } from "@/types";

interface OrderFormProps {
  batch: BatchSummary;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderForm({ batch, onClose, onSuccess }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxBottles = Math.min(batch.bottlesRemaining, 24);
  const totalAmount = quantity * batch.pricePerBottle;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batch._id,
          quantity,
          deliveryMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to place order");
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center z-50 px-4">
      <div className="bg-cream w-full max-w-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-charcoal/10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif text-xl">Place Order</h3>
              <p className="text-sm text-charcoal/60 mt-1">
                Batch No. {String(batch.batchNumber).padStart(3, "0")} —{" "}
                {batch.beerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-charcoal/40 hover:text-charcoal transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
              Quantity (bottles)
            </label>
            <input
              type="number"
              min={1}
              max={maxBottles}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxBottles, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
            />
            <p className="text-xs text-charcoal/40 mt-1">
              {batch.bottlesRemaining} bottles remaining
            </p>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
              Delivery Method
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod("pickup")}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm transition-colors ${
                  deliveryMethod === "pickup"
                    ? "border-amber bg-amber/10 text-charcoal"
                    : "border-charcoal/10 text-charcoal/60 hover:border-charcoal/20"
                }`}
              >
                Brewery Pickup
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod("delivery")}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm transition-colors ${
                  deliveryMethod === "delivery"
                    ? "border-amber bg-amber/10 text-charcoal"
                    : "border-charcoal/10 text-charcoal/60 hover:border-charcoal/20"
                }`}
              >
                Delivery
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-lg p-4 border border-charcoal/10">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal/60">
                {quantity} x €{batch.pricePerBottle.toFixed(2)}
              </span>
              <span className="font-serif text-lg font-medium">
                €{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
