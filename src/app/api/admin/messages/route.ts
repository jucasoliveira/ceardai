import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "@/lib/get-session";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.tier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    await connectDB();

    const filter: Record<string, string> = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
