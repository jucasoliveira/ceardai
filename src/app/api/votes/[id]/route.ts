import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vote from "@/models/Vote";
import { getServerSession } from "@/lib/get-session";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vote = await Vote.findById(params.id).lean();
    if (!vote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }
    return NextResponse.json(vote);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTier = (session.user as { tier?: string }).tier;
    if (userTier !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    await connectDB();
    const updates = await request.json();
    const vote = await Vote.findByIdAndUpdate(params.id, updates, {
      new: true,
    }).lean();

    if (!vote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    return NextResponse.json(vote);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
