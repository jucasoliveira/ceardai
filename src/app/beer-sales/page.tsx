import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import { beers } from "@/data/beers";
import BatchTimeline from "@/components/BatchTimeline";
import CountdownTimer from "@/components/CountdownTimer";
import StatusBadge from "@/components/StatusBadge";
import type { BatchSummary, BatchStatus } from "@/types";

export const dynamic = "force-dynamic";

function getNextTransitionDate(batch: BatchSummary): string | null {
  switch (batch.status) {
    case "announced":
      return batch.earlyAccessOpensAt;
    case "early_access":
      return batch.liveSaleOpensAt;
    case "live":
      return batch.saleEndsAt;
    default:
      return null;
  }
}

function getTransitionLabel(status: BatchStatus): string {
  switch (status) {
    case "announced":
      return "Early Access Opens In";
    case "early_access":
      return "Live Sale Opens In";
    case "live":
      return "Sale Ends In";
    default:
      return "";
  }
}

export default async function BeerSalesPage() {
  await connectDB();

  const rawBatches = await Batch.find().sort({ batchNumber: -1 }).lean();
  const batches: BatchSummary[] = rawBatches.map((b) => ({
    _id: String(b._id),
    batchNumber: b.batchNumber,
    beerId: b.beerId,
    beerName: b.beerName,
    beerColor: b.beerColor,
    totalBottles: b.totalBottles,
    bottlesRemaining: b.bottlesRemaining,
    pricePerBottle: b.pricePerBottle,
    earlyAccessFee: b.earlyAccessFee,
    status: b.status as BatchStatus,
    announcedAt: new Date(b.announcedAt).toISOString(),
    earlyAccessOpensAt: new Date(b.earlyAccessOpensAt).toISOString(),
    liveSaleOpensAt: new Date(b.liveSaleOpensAt).toISOString(),
    saleEndsAt: new Date(b.saleEndsAt).toISOString(),
    description: b.description,
    isVotingBatch: b.isVotingBatch,
  }));

  // Find the active batch (early_access or live), or the next announced one
  const activeBatch =
    batches.find((b) => b.status === "early_access" || b.status === "live") ??
    batches.find((b) => b.status === "announced") ??
    null;

  const activeBeer = activeBatch
    ? beers.find((b) => b.id === activeBatch.beerId)
    : null;

  const countdownTarget = activeBatch
    ? getNextTransitionDate(activeBatch)
    : null;

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            The Exhibition
          </h1>
          <div className="w-16 h-px bg-amber mx-auto mb-6" />
          <p className="text-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            Each batch is a limited edition. We release our beers in numbered
            batches, with early access for our members and founders before
            opening to the public.
          </p>
        </div>

        {/* Active Batch Hero */}
        {activeBatch && (
          <section className="mb-16">
            <div className="bg-white rounded-lg border border-charcoal/5 overflow-hidden shadow-sm">
              {/* Beer color band */}
              <div
                className="h-3"
                style={{ backgroundColor: activeBatch.beerColor }}
              />

              <div className="p-8 md:p-10 text-center">
                <p className="font-mono text-xs text-charcoal/40 tracking-[0.3em] mb-2">
                  CURRENT EXHIBIT
                </p>
                <p className="font-mono text-sm text-charcoal/50 mb-1">
                  No. {String(activeBatch.batchNumber).padStart(3, "0")}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl mb-3">
                  {activeBatch.beerName}
                </h2>

                <div className="flex justify-center mb-6">
                  <StatusBadge status={activeBatch.status} />
                </div>

                {activeBeer && (
                  <p className="text-charcoal/50 text-sm mb-6 max-w-lg mx-auto">
                    {activeBeer.style} &middot; {activeBeer.abv}
                  </p>
                )}

                {activeBatch.description && (
                  <p className="text-charcoal/60 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                    {activeBatch.description}
                  </p>
                )}

                {/* Countdown */}
                {countdownTarget && (
                  <div className="mb-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40 mb-4">
                      {getTransitionLabel(activeBatch.status)}
                    </p>
                    <CountdownTimer targetDate={countdownTarget} />
                  </div>
                )}

                {/* Batch stats */}
                <div className="flex flex-wrap justify-center gap-8 text-sm text-charcoal/60 mb-6">
                  <div>
                    <span className="block text-2xl font-serif text-charcoal">
                      {activeBatch.bottlesRemaining}
                    </span>
                    <span className="text-xs uppercase tracking-wider">
                      of {activeBatch.totalBottles} remaining
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-serif text-charcoal">
                      &euro;{activeBatch.pricePerBottle.toFixed(2)}
                    </span>
                    <span className="text-xs uppercase tracking-wider">
                      per bottle
                    </span>
                  </div>
                </div>

                {(activeBatch.status === "early_access" ||
                  activeBatch.status === "live") && (
                  <Link
                    href="/portal"
                    className="inline-block bg-amber text-white px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors"
                  >
                    Place Your Order
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Batch Timeline */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-8">Batch Timeline</h2>
          <BatchTimeline batches={batches} />
        </section>

        {/* Tier Explanation */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-2">Membership Tiers</h2>
          <p className="text-charcoal/50 text-sm mb-8">
            Your tier determines when you can access each batch.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Founder */}
            <div className="bg-white rounded-lg border border-charcoal/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber" />
              <h3 className="font-serif text-lg mb-2">Founder</h3>
              <p className="text-xs uppercase tracking-widest text-amber font-medium mb-4">
                Invite Only
              </p>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="text-amber">&#10003;</span>
                  Guaranteed allocation every batch
                </li>
                <li className="flex gap-2">
                  <span className="text-amber">&#10003;</span>
                  First access before early buyers
                </li>
                <li className="flex gap-2">
                  <span className="text-amber">&#10003;</span>
                  Vote on future batch styles
                </li>
                <li className="flex gap-2">
                  <span className="text-amber">&#10003;</span>
                  No early access fee
                </li>
              </ul>
            </div>

            {/* Early Buyer */}
            <div className="bg-white rounded-lg border border-charcoal/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-forest" />
              <h3 className="font-serif text-lg mb-2">Early Buyer</h3>
              <p className="text-xs uppercase tracking-widest text-forest font-medium mb-4">
                Registered Members
              </p>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="text-forest">&#10003;</span>
                  Early access window before public
                </li>
                <li className="flex gap-2">
                  <span className="text-forest">&#10003;</span>
                  Priority ordering during early access
                </li>
                <li className="flex gap-2">
                  <span className="text-forest">&#10003;</span>
                  Sale notifications by email
                </li>
                <li className="flex gap-2">
                  <span className="text-charcoal/30">&#8212;</span>
                  <span className="text-charcoal/40">
                    Small early access fee per batch
                  </span>
                </li>
              </ul>
            </div>

            {/* Consumer */}
            <div className="bg-white rounded-lg border border-charcoal/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-charcoal/20" />
              <h3 className="font-serif text-lg mb-2">Consumer</h3>
              <p className="text-xs uppercase tracking-widest text-charcoal/40 font-medium mb-4">
                Public
              </p>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="text-charcoal/40">&#10003;</span>
                  Purchase during live sale window
                </li>
                <li className="flex gap-2">
                  <span className="text-charcoal/40">&#10003;</span>
                  Subject to availability
                </li>
                <li className="flex gap-2">
                  <span className="text-charcoal/30">&#8212;</span>
                  <span className="text-charcoal/40">
                    No early access
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-charcoal/30">&#8212;</span>
                  <span className="text-charcoal/40">
                    No guaranteed allocation
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Login / Portal CTA */}
        <section className="text-center bg-charcoal text-cream rounded-lg p-8 md:p-10">
          <h3 className="font-serif text-2xl mb-3">Join the Gallery</h3>
          <p className="text-cream/60 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Create an account to receive batch notifications, access early
            sales, and manage your orders from the member portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-block bg-amber text-white px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-block border border-cream/20 text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-cream/5 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
