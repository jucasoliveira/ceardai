import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vote from "@/models/Vote";
import { getServerSession } from "@/lib/get-session";

export async function GET() {
  try {
    await connectDB();
    const votes = await Vote.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(votes);
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

    const userTier = (session.user as { tier?: string }).tier;
    if (userTier !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const vote = await Vote.create(body);
    return NextResponse.json(vote, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
