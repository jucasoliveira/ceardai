import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import WaitingList from "@/models/WaitingList";
import Founder from "@/models/Founder";
import { getServerSession } from "@/lib/get-session";
import { getResend } from "@/lib/resend";
import { founderInviteHtml } from "@/lib/email-templates";

export async function GET() {
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
    const entries = await WaitingList.find({ status: "waiting" })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Promote a waiting list entry to founder
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

    const { entryId } = await request.json();
    if (!entryId) {
      return NextResponse.json(
        { error: "entryId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const entry = await WaitingList.findById(entryId);
    if (!entry || entry.status !== "waiting") {
      return NextResponse.json(
        { error: "Waiting list entry not found" },
        { status: 404 }
      );
    }

    // Check if there's an available spot
    const activeCount = await Founder.countDocuments({ isActive: true });
    if (activeCount >= 14) {
      return NextResponse.json(
        { error: "All 14 spots are still filled" },
        { status: 400 }
      );
    }

    // Find next available spot
    const takenSpots = await Founder.find({ isActive: true })
      .select("spotNumber")
      .lean();
    const takenSet = new Set(takenSpots.map((f) => f.spotNumber));
    let spotNumber = 1;
    while (takenSet.has(spotNumber) && spotNumber <= 14) {
      spotNumber++;
    }

    const inviteToken = crypto.randomUUID();
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/founders/accept?token=${inviteToken}`;

    // Create founder record
    await Founder.create({
      name: entry.name,
      email: entry.email,
      spotNumber,
      inviteToken,
      inviteStatus: "sent",
      invitedBy: entry.invitedBy,
      allocationPerBatch: 5,
      isActive: true,
    });

    // Update waiting list entry
    entry.status = "promoted";
    await entry.save();

    // Send invite email
    await getResend().emails.send({
      from: "Ceardaí <noreply@ceardai.com>",
      to: entry.email,
      subject: "A spot opened up — you're invited to become a Ceardaí founder!",
      html: founderInviteHtml(entry.name, inviteUrl),
    });

    return NextResponse.json({
      message: `${entry.name} has been promoted to spot #${spotNumber}`,
      spotNumber,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
