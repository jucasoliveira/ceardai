import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Founder from "@/models/Founder";
import WaitingList from "@/models/WaitingList";
import { getServerSession } from "@/lib/get-session";
import { getResend } from "@/lib/resend";
import { founderInviteHtml, waitingListHtml } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTier = (session.user as { tier?: string }).tier;
    const userId = session.user.id;

    await connectDB();

    // Check authorization: admin or founder who hasn't used invite
    let inviterFounder = null;
    if (userTier === "admin") {
      // admin can always invite
    } else if (userTier === "founder") {
      inviterFounder = await Founder.findOne({ userId, isActive: true });
      if (!inviterFounder) {
        return NextResponse.json({ error: "Founder not found" }, { status: 403 });
      }
      if (inviterFounder.hasUsedInvite) {
        return NextResponse.json(
          { error: "You have already used your invite" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email is already a founder
    const existingFounder = await Founder.findOne({ email, isActive: true });
    if (existingFounder) {
      return NextResponse.json(
        { error: "This email is already associated with a founder" },
        { status: 400 }
      );
    }

    // Check if all 14 slots are filled
    const activeCount = await Founder.countDocuments({ isActive: true });
    if (activeCount >= 14) {
      // Add to waiting list
      const existing = await WaitingList.findOne({ email, status: "waiting" });
      if (existing) {
        return NextResponse.json(
          { error: "This email is already on the waiting list" },
          { status: 400 }
        );
      }

      await WaitingList.create({
        name,
        email,
        invitedBy: inviterFounder ? userId : null,
      });

      // Mark invite as used if founder
      if (inviterFounder) {
        inviterFounder.hasUsedInvite = true;
        await inviterFounder.save();
      }

      // Send waiting list email
      await getResend().emails.send({
        from: "Ceardaí <noreply@ceardai.com>",
        to: email,
        subject: "You're on the Ceardaí waiting list",
        html: waitingListHtml(name),
      });

      return NextResponse.json(
        { message: "All spots are filled. Added to waiting list.", waitingList: true },
        { status: 200 }
      );
    }

    // Find next available spot number
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

    // Create founder record (no userId yet)
    await Founder.create({
      name,
      email,
      spotNumber,
      inviteToken,
      inviteStatus: "sent",
      invitedBy: inviterFounder ? userId : null,
      allocationPerBatch: 5,
      isActive: true,
    });

    // Mark invite as used if founder
    if (inviterFounder) {
      inviterFounder.hasUsedInvite = true;
      await inviterFounder.save();
    }

    // Send invite email
    await getResend().emails.send({
      from: "Ceardaí <noreply@ceardai.com>",
      to: email,
      subject: "You're invited to become a Ceardaí founder",
      html: founderInviteHtml(name, inviteUrl),
    });

    return NextResponse.json(
      { message: "Invite sent successfully", spotNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
