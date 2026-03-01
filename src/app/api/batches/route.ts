import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import { getServerSession } from "@/lib/get-session";

// GET /api/batches — public, returns all batches sorted by batchNumber desc
export async function GET() {
  try {
    await connectDB();
    const batches = await Batch.find().sort({ batchNumber: -1 }).lean();
    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}

// POST /api/batches — admin only, create a new batch
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const userTier = (session?.user as { tier?: string } | undefined)?.tier;
    if (!session || userTier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const batch = await Batch.create({
      batchNumber: body.batchNumber,
      beerId: body.beerId,
      beerName: body.beerName,
      beerColor: body.beerColor,
      totalBottles: body.totalBottles,
      bottlesRemaining: body.bottlesRemaining ?? body.totalBottles,
      pricePerBottle: body.pricePerBottle,
      earlyAccessFee: body.earlyAccessFee ?? 20,
      status: body.status ?? "announced",
      announcedAt: body.announcedAt,
      earlyAccessOpensAt: body.earlyAccessOpensAt,
      liveSaleOpensAt: body.liveSaleOpensAt,
      saleEndsAt: body.saleEndsAt,
      description: body.description ?? "",
      isVotingBatch: body.isVotingBatch ?? false,
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}
