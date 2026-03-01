import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import { getServerSession } from "@/lib/get-session";
import type { BatchStatus } from "@/types";

const VALID_TRANSITIONS: Record<BatchStatus, BatchStatus | null> = {
  announced: "early_access",
  early_access: "live",
  live: "sold_out",
  sold_out: "completed",
  completed: null,
};

// POST /api/batches/[id]/status — admin only, advance batch status
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as { tier?: string }).tier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const batch = await Batch.findById(id);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const currentStatus = batch.status as BatchStatus;
    const nextStatus = VALID_TRANSITIONS[currentStatus];

    if (!nextStatus) {
      return NextResponse.json(
        {
          error: `Cannot advance from "${currentStatus}" — batch lifecycle is complete`,
        },
        { status: 400 }
      );
    }

    batch.status = nextStatus;
    await batch.save();

    return NextResponse.json({
      message: `Batch status advanced from "${currentStatus}" to "${nextStatus}"`,
      batch: batch.toObject(),
    });
  } catch (error) {
    console.error("Error advancing batch status:", error);
    return NextResponse.json(
      { error: "Failed to advance batch status" },
      { status: 500 }
    );
  }
}
