import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Founder from "@/models/Founder";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await connectDB();
    const founder = await Founder.findOne({ inviteToken: token, isActive: true });

    if (!founder) {
      return NextResponse.json({ error: "Invalid invite token" }, { status: 404 });
    }

    if (founder.inviteStatus === "accepted") {
      return NextResponse.json(
        { error: "This invite has already been accepted" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      name: founder.name,
      email: founder.email,
      spotNumber: founder.spotNumber,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, userId } = await request.json();
    if (!token || !userId) {
      return NextResponse.json(
        { error: "Token and userId are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const founder = await Founder.findOne({ inviteToken: token, isActive: true });

    if (!founder) {
      return NextResponse.json({ error: "Invalid invite token" }, { status: 404 });
    }

    if (founder.inviteStatus === "accepted") {
      return NextResponse.json(
        { error: "This invite has already been accepted" },
        { status: 400 }
      );
    }

    // Update founder record
    founder.userId = userId;
    founder.inviteStatus = "accepted";
    await founder.save();

    // Update user tier to "founder" in Better Auth's user collection
    const client = new MongoClient(process.env.MONGODB_URI!);
    try {
      await client.connect();
      const db = client.db();
      await db.collection("user").updateOne(
        { _id: userId },
        { $set: { tier: "founder" } }
      );
    } finally {
      await client.close();
    }

    return NextResponse.json({
      message: "Invite accepted! You are now a founder.",
      spotNumber: founder.spotNumber,
    });
  } catch (error) {
    console.error("Accept error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
