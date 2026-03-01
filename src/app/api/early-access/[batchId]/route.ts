import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import EarlyAccess from "@/models/EarlyAccess";
import { getServerSession } from "@/lib/get-session";

export async function GET(
  _request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const access = await EarlyAccess.findOne({
      userId: session.user.id,
      batchId: params.batchId,
    }).lean();

    return NextResponse.json({ hasAccess: !!access, access });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
