export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import Order from "@/models/Order";
import Founder from "@/models/Founder";
import Message from "@/models/Message";
import StatusBadge from "@/components/StatusBadge";
import mongoose from "mongoose";
import Link from "next/link";
import type { BatchStatus, OrderStatus } from "@/types";

export default async function AdminDashboard() {
  await connectDB();

  const [totalMembers, totalFounders, activeBatch, unreadMessages, recentOrders] =
    await Promise.all([
      mongoose.connection.db!.collection("user").countDocuments(),
      Founder.countDocuments({ isActive: true }),
      Batch.findOne({
        status: { $in: ["announced", "early_access", "live"] },
      })
        .sort({ batchNumber: -1 })
        .lean(),
      Message.countDocuments({ status: "unread" }),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

  const kpis = [
    {
      label: "Total Members",
      value: totalMembers,
      href: "/admin/members",
    },
    {
      label: "Founders",
      value: `${totalFounders}/14`,
      href: "/admin/founders",
    },
    {
      label: "Active Batch",
      value: activeBatch ? `#${activeBatch.batchNumber}` : "None",
      sub: activeBatch ? activeBatch.beerName : undefined,
      href: activeBatch ? `/admin/batches/${activeBatch._id}` : "/admin/batches",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      href: "/admin/messages",
    },
  ];

  const orderStatusColors: Record<OrderStatus, string> = {
    pending: "bg-amber/20 text-amber",
    confirmed: "bg-forest/20 text-forest",
    collected: "bg-charcoal/10 text-charcoal/60",
    cancelled: "bg-burgundy/20 text-burgundy",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
        <p className="text-charcoal/50 text-sm mt-1">
          Overview of your brewery operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="bg-white rounded-xl p-6 shadow-exhibit hover:shadow-exhibit-hover transition-shadow"
          >
            <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-2">
              {kpi.label}
            </p>
            <p className="text-3xl font-serif text-charcoal">{kpi.value}</p>
            {kpi.sub && (
              <p className="text-sm text-charcoal/50 mt-1">{kpi.sub}</p>
            )}
          </Link>
        ))}
      </div>

      {/* Active Batch Detail */}
      {activeBatch && (
        <div className="bg-white rounded-xl p-6 shadow-exhibit mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-charcoal">Active Batch</h2>
            <StatusBadge status={activeBatch.status as BatchStatus} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-charcoal/40 mb-1">Beer</p>
              <p className="text-charcoal font-medium">{activeBatch.beerName}</p>
            </div>
            <div>
              <p className="text-charcoal/40 mb-1">Bottles Remaining</p>
              <p className="text-charcoal font-medium">
                {activeBatch.bottlesRemaining} / {activeBatch.totalBottles}
              </p>
            </div>
            <div>
              <p className="text-charcoal/40 mb-1">Price</p>
              <p className="text-charcoal font-medium">
                &euro;{activeBatch.pricePerBottle}
              </p>
            </div>
            <div>
              <p className="text-charcoal/40 mb-1">Batch Number</p>
              <p className="text-charcoal font-medium">#{activeBatch.batchNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-exhibit">
        <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
          <h2 className="font-serif text-xl text-charcoal">Recent Orders</h2>
          <Link
            href="/admin/batches"
            className="text-xs uppercase tracking-widest text-amber hover:text-amber/80 transition-colors"
          >
            View all batches
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 text-sm">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Beer
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                    Batch
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
                {recentOrders.map((order) => (
                  <tr
                    key={String(order._id)}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-charcoal">
                      {order.beerName}
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">
                      #{order.batchNumber}
                    </td>
                    <td className="px-6 py-3 text-charcoal/70">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-3 text-charcoal font-medium">
                      &euro;{order.totalAmount}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                          orderStatusColors[order.status as OrderStatus] ||
                          "bg-charcoal/10 text-charcoal/60"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-charcoal/50">
                      {new Date(order.createdAt!).toLocaleDateString()}
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
