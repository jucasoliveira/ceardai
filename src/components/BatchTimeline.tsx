import StatusBadge from "@/components/StatusBadge";
import type { BatchSummary } from "@/types";

interface BatchTimelineProps {
  batches: BatchSummary[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isActive(status: BatchSummary["status"]): boolean {
  return status === "early_access" || status === "live";
}

function isPast(status: BatchSummary["status"]): boolean {
  return status === "sold_out" || status === "completed";
}

export default function BatchTimeline({ batches }: BatchTimelineProps) {
  // Sort chronologically by announcedAt
  const sorted = [...batches].sort(
    (a, b) =>
      new Date(a.announcedAt).getTime() - new Date(b.announcedAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="text-charcoal/50 text-sm italic text-center py-8">
        No batches scheduled yet.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-charcoal/10" />

      <div className="space-y-8">
        {sorted.map((batch) => {
          const active = isActive(batch.status);
          const past = isPast(batch.status);

          return (
            <div
              key={batch._id}
              className={`relative pl-12 ${past ? "opacity-50" : ""}`}
            >
              {/* Color dot */}
              <div
                className={`absolute left-2 top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-sm ${active ? "ring-2 ring-amber/40" : ""}`}
                style={{ backgroundColor: batch.beerColor }}
              />

              {/* Active highlight border */}
              <div
                className={`rounded-lg p-5 ${
                  active
                    ? "border-l-4 border-l-amber bg-amber/5"
                    : "border border-charcoal/5 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-xs text-charcoal/40 tracking-widest">
                      No. {String(batch.batchNumber).padStart(3, "0")}
                    </p>
                    <h3 className="font-serif text-lg">{batch.beerName}</h3>
                  </div>
                  <StatusBadge status={batch.status} />
                </div>

                {/* Key dates */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-charcoal/60 mb-3">
                  <div>
                    <span className="block text-charcoal/40 uppercase tracking-wider text-[10px] mb-0.5">
                      Announced
                    </span>
                    {formatDate(batch.announcedAt)}
                  </div>
                  <div>
                    <span className="block text-charcoal/40 uppercase tracking-wider text-[10px] mb-0.5">
                      Early Access
                    </span>
                    {formatDate(batch.earlyAccessOpensAt)}
                  </div>
                  <div>
                    <span className="block text-charcoal/40 uppercase tracking-wider text-[10px] mb-0.5">
                      Live Sale
                    </span>
                    {formatDate(batch.liveSaleOpensAt)}
                  </div>
                  <div>
                    <span className="block text-charcoal/40 uppercase tracking-wider text-[10px] mb-0.5">
                      Sale Ends
                    </span>
                    {formatDate(batch.saleEndsAt)}
                  </div>
                </div>

                {/* Bottles remaining */}
                <div className="flex items-center gap-2 text-xs text-charcoal/50">
                  <span>
                    {batch.bottlesRemaining} / {batch.totalBottles} bottles
                    remaining
                  </span>
                  <div className="flex-1 max-w-[120px] h-1 bg-charcoal/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${batch.totalBottles > 0 ? (batch.bottlesRemaining / batch.totalBottles) * 100 : 0}%`,
                        backgroundColor: batch.beerColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
