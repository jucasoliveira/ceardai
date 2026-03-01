import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import EarlyAccess from "@/models/EarlyAccess";
import Batch from "@/models/Batch";
import { getServerSession } from "@/lib/get-session";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { batchId } = await request.json();

    if (!batchId) {
      return NextResponse.json({ error: "Batch ID required" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.status !== "announced") {
      return NextResponse.json(
        { error: "Early access can only be purchased for announced batches" },
        { status: 400 }
      );
    }

    // Check if already purchased
    const existing = await EarlyAccess.findOne({
      userId: session.user.id,
      batchId: batch._id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have early access for this batch" },
        { status: 409 }
      );
    }

    const earlyAccess = await EarlyAccess.create({
      userId: session.user.id,
      batchId: batch._id,
      feePaid: batch.earlyAccessFee,
    });

    return NextResponse.json(earlyAccess, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
