import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { BatchSummary } from "@/types";

interface BatchCardProps {
  batch: BatchSummary;
}

function getCTAText(status: BatchSummary["status"]): string {
  switch (status) {
    case "announced":
      return "Coming Soon";
    case "early_access":
      return "Early Access Open";
    case "live":
      return "Order Now";
    case "sold_out":
      return "Sold Out";
    case "completed":
      return "View Details";
  }
}

function getCTAStyle(status: BatchSummary["status"]): string {
  switch (status) {
    case "announced":
      return "bg-charcoal/10 text-charcoal/60 cursor-default";
    case "early_access":
      return "bg-forest text-white hover:bg-forest/90";
    case "live":
      return "bg-amber text-white hover:bg-amber/90";
    case "sold_out":
      return "bg-burgundy/20 text-burgundy cursor-default";
    case "completed":
      return "bg-charcoal/10 text-charcoal/60 hover:bg-charcoal/20";
  }
}

export default function BatchCard({ batch }: BatchCardProps) {
  const isClickable =
    batch.status === "early_access" ||
    batch.status === "live" ||
    batch.status === "completed";

  const bottlePercentage =
    batch.totalBottles > 0
      ? Math.round((batch.bottlesRemaining / batch.totalBottles) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-charcoal/5 group">
      {/* Beer color band */}
      <div className="h-2" style={{ backgroundColor: batch.beerColor }} />

      <div className="p-6">
        {/* Batch number */}
        <p className="font-mono text-xs text-charcoal/40 tracking-widest mb-1">
          No. {String(batch.batchNumber).padStart(3, "0")}
        </p>

        {/* Beer name */}
        <h3 className="font-serif text-xl mb-3">{batch.beerName}</h3>

        {/* Status badge */}
        <div className="mb-4">
          <StatusBadge status={batch.status} />
        </div>

        {/* Bottles remaining */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-charcoal/50 mb-1.5">
            <span>
              {batch.bottlesRemaining} / {batch.totalBottles} bottles
            </span>
            <span>{bottlePercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-charcoal/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${bottlePercentage}%`,
                backgroundColor: batch.beerColor,
              }}
            />
          </div>
        </div>

        {/* Price */}
        <p className="text-sm text-charcoal/70 mb-5">
          <span className="font-medium text-charcoal">
            &euro;{batch.pricePerBottle.toFixed(2)}
          </span>{" "}
          per bottle
        </p>

        {/* CTA */}
        {isClickable ? (
          <Link
            href={`/beer-sales/${batch._id}`}
            className={`block text-center w-full px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-medium transition-colors ${getCTAStyle(batch.status)}`}
          >
            {getCTAText(batch.status)}
          </Link>
        ) : (
          <span
            className={`block text-center w-full px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-medium ${getCTAStyle(batch.status)}`}
          >
            {getCTAText(batch.status)}
          </span>
        )}
      </div>
    </div>
  );
}
