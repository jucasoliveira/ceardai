import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import Order from "@/models/Order";
import Founder from "@/models/Founder";
import Message from "@/models/Message";
import { getServerSession } from "@/lib/get-session";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user.tier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({
      totalMembers,
      totalFounders,
      activeBatch: activeBatch || null,
      unreadMessages,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
