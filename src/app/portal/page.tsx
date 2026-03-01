export const dynamic = "force-dynamic";

import { requireSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import Order from "@/models/Order";
import Vote from "@/models/Vote";
import Founder from "@/models/Founder";
import TierBadge from "@/components/TierBadge";
import StatusBadge from "@/components/StatusBadge";
import type { UserTier, BatchStatus, OrderStatus } from "@/types";
import Link from "next/link";

export default async function PortalDashboard() {
  let session;
  try {
    session = await requireSession();
  } catch {
    redirect("/login");
  }

  await connectDB();

  const userId = session.user.id;
  const userName = session.user.name || "Member";
  const userTier = ((session.user as Record<string, unknown>).tier as UserTier) || "consumer";

  // Fetch active/announced batches
  const batches = await Batch.find({
    status: { $in: ["announced", "early_access", "live"] },
  })
    .sort({ announcedAt: -1 })
    .lean();

  // Fetch recent orders
  const recentOrders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Check if founder and if there are active votes
  const founder = await Founder.findOne({ userId, isActive: true }).lean();
  const activeVote = founder
    ? await Vote.findOne({ status: "open" }).sort({ opensAt: -1 }).lean()
    : null;

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl mb-2">Welcome, {userName}</h1>
        <TierBadge tier={userTier} />
      </div>

      {/* Active Batches */}
      <section className="mb-10">
        <h2 className="font-serif text-xl mb-4">Current Batches</h2>
        {batches.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-charcoal/40">
            No active batches at the moment.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {batches.map((batch) => (
              <div
                key={String(batch._id)}
                className="bg-white rounded-lg p-6 border border-charcoal/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest">
                      Batch No. {String(batch.batchNumber).padStart(3, "0")}
                    </p>
                    <h3 className="font-serif text-lg mt-1">{batch.beerName}</h3>
                  </div>
                  <StatusBadge status={batch.status as BatchStatus} />
                </div>
                <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">
                  {batch.description}
                </p>
                <div className="flex justify-between text-sm text-charcoal/60">
                  <span>{batch.bottlesRemaining} / {batch.totalBottles} remaining</span>
                  <span className="font-medium text-charcoal">
                    &euro;{batch.pricePerBottle.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Vote (Founders only) */}
      {founder && activeVote && (
        <section className="mb-10">
          <h2 className="font-serif text-xl mb-4">Active Vote</h2>
          <Link
            href={`/portal/vote/${String(activeVote._id)}`}
            className="block bg-white rounded-lg p-6 border border-gold/30 hover:border-gold/60 transition-colors"
          >
            <p className="text-xs text-gold uppercase tracking-widest mb-1">Founder Vote</p>
            <h3 className="font-serif text-lg">{activeVote.title}</h3>
            <p className="text-sm text-charcoal/60 mt-2">
              {activeVote.options.length} options &middot; Closes{" "}
              {new Date(activeVote.closesAt).toLocaleDateString()}
            </p>
          </Link>
        </section>
      )}

      {/* Recent Orders */}
      <section>
        <h2 className="font-serif text-xl mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-charcoal/40">
            You haven&apos;t placed any orders yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-charcoal/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Beer
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Qty
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={String(order._id)}
                    className="border-b border-charcoal/5 last:border-b-0"
                  >
                    <td className="px-4 py-3">{order.beerName}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3">&euro;{order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === "confirmed"
                          ? "bg-forest/10 text-forest"
                          : order.status === "collected"
                            ? "bg-charcoal/10 text-charcoal/60"
                            : order.status === "cancelled"
                              ? "bg-burgundy/10 text-burgundy"
                              : "bg-amber/10 text-amber"
                      }`}>
                        {(order.status as OrderStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
