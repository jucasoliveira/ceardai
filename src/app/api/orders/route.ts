import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Batch from "@/models/Batch";
import Founder from "@/models/Founder";
import EarlyAccess from "@/models/EarlyAccess";
import { getServerSession } from "@/lib/get-session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { batchId, quantity, deliveryMethod } = await request.json();

    if (!batchId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const userTier = (session.user as { tier?: string }).tier || "consumer";

    // Check tier vs batch status
    if (batch.status === "announced") {
      return NextResponse.json(
        { error: "This batch is not yet open for orders" },
        { status: 403 }
      );
    }

    if (batch.status === "sold_out" || batch.status === "completed") {
      return NextResponse.json(
        { error: "This batch is no longer available" },
        { status: 403 }
      );
    }

    if (batch.status === "early_access") {
      // Only founders and early access holders can order
      const isFounder = await Founder.findOne({
        userId: session.user.id,
        isActive: true,
      });
      const hasEarlyAccess = await EarlyAccess.findOne({
        userId: session.user.id,
        batchId: batch._id,
      });

      if (!isFounder && !hasEarlyAccess && userTier !== "admin") {
        return NextResponse.json(
          { error: "This batch is in early access. Purchase early access or wait for the live sale." },
          { status: 403 }
        );
      }

      // Founders limited to 5 bottles
      if (isFounder) {
        const existingOrders = await Order.find({
          userId: session.user.id,
          batchId: batch._id,
          status: { $ne: "cancelled" },
        });
        const totalOrdered = existingOrders.reduce((sum, o) => sum + o.quantity, 0);
        if (totalOrdered + quantity > isFounder.allocationPerBatch) {
          return NextResponse.json(
            {
              error: `Founders are limited to ${isFounder.allocationPerBatch} bottles per batch. You have ${totalOrdered} already ordered.`,
            },
            { status: 403 }
          );
        }
      }
    }

    if (batch.status === "live") {
      // All authenticated users can order
    }

    // Check for duplicate orders (non-founders get one order per batch)
    const isFounder = await Founder.findOne({
      userId: session.user.id,
      isActive: true,
    });
    if (!isFounder) {
      const existingOrder = await Order.findOne({
        userId: session.user.id,
        batchId: batch._id,
        status: { $ne: "cancelled" },
      });
      if (existingOrder) {
        return NextResponse.json(
          { error: "You already have an order for this batch" },
          { status: 409 }
        );
      }
    }

    // Atomic decrement of bottlesRemaining
    const updatedBatch = await Batch.findOneAndUpdate(
      { _id: batch._id, bottlesRemaining: { $gte: quantity } },
      { $inc: { bottlesRemaining: -quantity } },
      { new: true }
    );

    if (!updatedBatch) {
      return NextResponse.json(
        { error: "Not enough bottles remaining" },
        { status: 409 }
      );
    }

    const order = await Order.create({
      userId: session.user.id,
      batchId: batch._id,
      batchNumber: batch.batchNumber,
      beerName: batch.beerName,
      quantity,
      totalAmount: quantity * batch.pricePerBottle,
      tierAtPurchase: userTier,
      status: "pending",
      deliveryMethod: deliveryMethod || "pickup",
    });

    // Auto sold_out when bottlesRemaining hits 0
    if (updatedBatch.bottlesRemaining === 0) {
      await Batch.findByIdAndUpdate(batch._id, { status: "sold_out" });
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
