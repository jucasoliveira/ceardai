export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import type { BatchStatus } from "@/types";

export default async function AdminBatchesPage() {
  await connectDB();
  const batches = await Batch.find().sort({ batchNumber: -1 }).lean();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Batches</h1>
          <p className="text-charcoal/50 text-sm mt-1">
            Manage all beer batches and their lifecycle
          </p>
        </div>
        <Link
          href="/admin/batches/new"
          className="bg-amber text-white px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors"
        >
          New Batch
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-exhibit overflow-hidden">
        {batches.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 text-sm">
            No batches created yet.{" "}
            <Link href="/admin/batches/new" className="text-amber underline">
              Create your first batch
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Batch #
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Beer
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Bottles
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr
                    key={String(batch._id)}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-charcoal">
                      #{batch.batchNumber}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: batch.beerColor }}
                        />
                        <span className="text-charcoal">{batch.beerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={batch.status as BatchStatus} />
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">
                      {batch.bottlesRemaining}/{batch.totalBottles}
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">
                      &euro;{batch.pricePerBottle}
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/batches/${batch._id}`}
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
