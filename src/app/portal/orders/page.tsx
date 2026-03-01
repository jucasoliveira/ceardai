export const dynamic = "force-dynamic";

import { requireSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import type { OrderStatus } from "@/types";

export default async function OrdersPage() {
  let session;
  try {
    session = await requireSession();
  } catch {
    redirect("/login");
  }

  await connectDB();

  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          <p className="font-serif text-lg mb-2">No orders yet</p>
          <p className="text-sm">Your order history will appear here once you place an order.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-charcoal/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/10">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                  Batch
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                  Beer
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                  Qty
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = order.status as OrderStatus;
                const statusStyle =
                  status === "confirmed"
                    ? "bg-forest/10 text-forest"
                    : status === "collected"
                      ? "bg-charcoal/10 text-charcoal/60"
                      : status === "cancelled"
                        ? "bg-burgundy/10 text-burgundy"
                        : "bg-amber/10 text-amber";

                return (
                  <tr
                    key={String(order._id)}
                    className="border-b border-charcoal/5 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-charcoal/60">
                      #{String(order.batchNumber).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-3">{order.beerName}</td>
                    <td className="px-4 py-3 text-right">{order.quantity}</td>
                    <td className="px-4 py-3 text-right">&euro;{order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full uppercase tracking-wider ${statusStyle}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
