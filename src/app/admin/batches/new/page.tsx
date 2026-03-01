"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { beers } from "@/data/beers";
import Link from "next/link";

export default function NewBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    beerId: beers[0].id,
    batchNumber: "",
    totalBottles: "",
    pricePerBottle: "",
    earlyAccessFee: "20",
    announcedAt: "",
    earlyAccessOpensAt: "",
    liveSaleOpensAt: "",
    saleEndsAt: "",
    description: "",
    isVotingBatch: false,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const selectedBeer = beers.find((b) => b.id === form.beerId);
    if (!selectedBeer) {
      setError("Please select a beer");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchNumber: parseInt(form.batchNumber),
          beerId: selectedBeer.id,
          beerName: selectedBeer.name,
          beerColor: selectedBeer.color,
          totalBottles: parseInt(form.totalBottles),
          bottlesRemaining: parseInt(form.totalBottles),
          pricePerBottle: parseFloat(form.pricePerBottle),
          earlyAccessFee: parseFloat(form.earlyAccessFee),
          announcedAt: new Date(form.announcedAt).toISOString(),
          earlyAccessOpensAt: new Date(form.earlyAccessOpensAt).toISOString(),
          liveSaleOpensAt: new Date(form.liveSaleOpensAt).toISOString(),
          saleEndsAt: new Date(form.saleEndsAt).toISOString(),
          description: form.description,
          isVotingBatch: form.isVotingBatch,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create batch");
      }

      router.push("/admin/batches");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
        <h1 className="font-serif text-3xl text-charcoal">New Batch</h1>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-exhibit p-8 max-w-2xl"
      >
        <div className="space-y-6">
          {/* Beer Selection */}
          <div>
            <label htmlFor="beerId" className={labelClass}>
              Beer
            </label>
            <select
              id="beerId"
              name="beerId"
              value={form.beerId}
              onChange={handleChange}
              className={inputClass}
            >
              {beers.map((beer) => (
                <option key={beer.id} value={beer.id}>
                  {beer.name} ({beer.style})
                </option>
              ))}
            </select>
          </div>

          {/* Batch Number + Total Bottles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="batchNumber" className={labelClass}>
                Batch Number
              </label>
              <input
                type="number"
                id="batchNumber"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                required
                min={1}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="totalBottles" className={labelClass}>
                Total Bottles
              </label>
              <input
                type="number"
                id="totalBottles"
                name="totalBottles"
                value={form.totalBottles}
                onChange={handleChange}
                required
                min={1}
                className={inputClass}
              />
            </div>
          </div>

          {/* Price + Early Access Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pricePerBottle" className={labelClass}>
                Price per Bottle (&euro;)
              </label>
              <input
                type="number"
                id="pricePerBottle"
                name="pricePerBottle"
                value={form.pricePerBottle}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="earlyAccessFee" className={labelClass}>
                Early Access Fee (&euro;)
              </label>
              <input
                type="number"
                id="earlyAccessFee"
                name="earlyAccessFee"
                value={form.earlyAccessFee}
                onChange={handleChange}
                min={0}
                step="0.01"
                className={inputClass}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="announcedAt" className={labelClass}>
                Announced Date
              </label>
              <input
                type="datetime-local"
                id="announcedAt"
                name="announcedAt"
                value={form.announcedAt}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="earlyAccessOpensAt" className={labelClass}>
                Early Access Opens
              </label>
              <input
                type="datetime-local"
                id="earlyAccessOpensAt"
                name="earlyAccessOpensAt"
                value={form.earlyAccessOpensAt}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="liveSaleOpensAt" className={labelClass}>
                Live Sale Opens
              </label>
              <input
                type="datetime-local"
                id="liveSaleOpensAt"
                name="liveSaleOpensAt"
                value={form.liveSaleOpensAt}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="saleEndsAt" className={labelClass}>
                Sale Ends
              </label>
              <input
                type="datetime-local"
                id="saleEndsAt"
                name="saleEndsAt"
                value={form.saleEndsAt}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={inputClass}
            />
          </div>

          {/* Voting Batch */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isVotingBatch"
              name="isVotingBatch"
              checked={form.isVotingBatch}
              onChange={handleChange}
              className="w-4 h-4 rounded border-charcoal/20 text-amber focus:ring-amber"
            />
            <label htmlFor="isVotingBatch" className="text-sm text-charcoal/70">
              This is a voting batch (beer chosen by community vote)
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-charcoal/10">
          <button
            type="submit"
            disabled={loading}
            className="bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Batch"}
          </button>
          <Link
            href="/admin/batches"
            className="text-sm text-charcoal/40 hover:text-charcoal/60 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
