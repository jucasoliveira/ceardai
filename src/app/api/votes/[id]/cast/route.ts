import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vote from "@/models/Vote";
import VoteCast from "@/models/VoteCast";
import Founder from "@/models/Founder";
import { getServerSession } from "@/lib/get-session";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Only founders can vote
    const founder = await Founder.findOne({
      userId: session.user.id,
      isActive: true,
    });

    if (!founder) {
      return NextResponse.json(
        { error: "Only founders can vote" },
        { status: 403 }
      );
    }

    const vote = await Vote.findById(params.id);
    if (!vote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    if (vote.status !== "open") {
      return NextResponse.json(
        { error: "This vote is no longer open" },
        { status: 400 }
      );
    }

    const { optionId } = await request.json();
    if (!optionId) {
      return NextResponse.json({ error: "Option ID required" }, { status: 400 });
    }

    const validOption = vote.options.find(
      (o: { id: string }) => o.id === optionId
    );
    if (!validOption) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    // Check for duplicate vote
    const existing = await VoteCast.findOne({
      voteId: vote._id,
      userId: session.user.id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already voted" },
        { status: 409 }
      );
    }

    // Cast vote
    await VoteCast.create({
      voteId: vote._id,
      userId: session.user.id,
      optionId,
    });

    // Increment vote count
    await Vote.updateOne(
      { _id: vote._id, "options.id": optionId },
      { $inc: { "options.$.votes": 1 } }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
