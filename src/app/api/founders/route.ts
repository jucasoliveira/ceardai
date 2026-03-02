import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Founder from "@/models/Founder";
import { getServerSession } from "@/lib/get-session";

export async function GET() {
  try {
    const session = await getServerSession();
    const userTier = session
      ? (session.user as { tier?: string }).tier
      : null;

    await connectDB();

    // Admin and founders get full data; public gets name + spotNumber only
    if (userTier === "admin" || userTier === "founder") {
      const founders = await Founder.find({ isActive: true })
        .sort({ spotNumber: 1 })
        .lean();
      return NextResponse.json(founders);
    }

    const founders = await Founder.find({ isActive: true })
      .select("name spotNumber")
      .sort({ spotNumber: 1 })
      .lean();
    return NextResponse.json(founders);
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

    // Check if we already have 14 founders
    const count = await Founder.countDocuments({ isActive: true });
    if (count >= 14) {
      return NextResponse.json(
        { error: "All 14 founder spots are filled" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const founder = await Founder.create(body);
    return NextResponse.json(founder, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
