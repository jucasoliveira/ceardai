"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import StatusBadge from "@/components/StatusBadge";
import type { BatchSummary } from "@/types";

interface EarlyAccessState {
  [batchId: string]: "purchased" | "purchasing" | "available";
}

export default function EarlyAccessPage() {
  const { data: session } = useSession();
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [accessState, setAccessState] = useState<EarlyAccessState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/batches");
        if (!res.ok) {
          setError("Failed to load batches.");
          return;
        }
        const allBatches: BatchSummary[] = await res.json();
        const announced = allBatches.filter((b) => b.status === "announced");
        setBatches(announced);

        // Check early access status for each batch
        const stateMap: EarlyAccessState = {};
        await Promise.all(
          announced.map(async (batch) => {
            try {
              const eaRes = await fetch(`/api/early-access/${batch._id}`);
              if (eaRes.ok) {
                const data = await eaRes.json();
                stateMap[batch._id] = data.hasAccess ? "purchased" : "available";
              } else {
                stateMap[batch._id] = "available";
              }
            } catch {
              stateMap[batch._id] = "available";
            }
          })
        );
        setAccessState(stateMap);
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  async function handlePurchase(batchId: string) {
    setAccessState((prev) => ({ ...prev, [batchId]: "purchasing" }));
    setError("");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to purchase early access.");
        setAccessState((prev) => ({ ...prev, [batchId]: "available" }));
        return;
      }

      setAccessState((prev) => ({ ...prev, [batchId]: "purchased" }));
    } catch {
      setError("Something went wrong. Please try again.");
      setAccessState((prev) => ({ ...prev, [batchId]: "available" }));
    }
  }

  if (loading) {
    return (
      <div className="py-8 px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl mb-8">Early Access</h1>
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          Loading batches...
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl mb-2">Early Access</h1>
      <p className="text-charcoal/60 text-sm mb-8">
        Purchase early access to upcoming batches before they go on general sale.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-burgundy/10 text-burgundy text-sm rounded-lg">
          {error}
        </div>
      )}

      {batches.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          <p className="font-serif text-lg mb-2">No announced batches</p>
          <p className="text-sm">
            Early access purchases will be available when new batches are announced.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => {
            const state = accessState[batch._id] || "available";

            return (
              <div
                key={batch._id}
                className="bg-white rounded-lg p-6 border border-charcoal/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest">
                      Batch No. {String(batch.batchNumber).padStart(3, "0")}
                    </p>
                    <h3 className="font-serif text-lg mt-1">{batch.beerName}</h3>
                  </div>
                  <StatusBadge status={batch.status} />
                </div>
                <p className="text-sm text-charcoal/60 mb-4">{batch.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-charcoal/60">
                    <span>{batch.totalBottles} bottles</span>
                    <span className="mx-2">&middot;</span>
                    <span>&euro;{batch.pricePerBottle.toFixed(2)} per bottle</span>
                  </div>
                  {state === "purchased" ? (
                    <span className="inline-block text-xs px-3 py-1.5 rounded-full uppercase tracking-widest font-medium bg-forest/10 text-forest">
                      Access Purchased
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(batch._id)}
                      disabled={state === "purchasing"}
                      className="bg-charcoal text-cream px-5 py-2 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                    >
                      {state === "purchasing"
                        ? "Processing..."
                        : `Purchase Early Access (\u20AC${batch.earlyAccessFee})`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
