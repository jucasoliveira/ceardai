import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "@/lib/get-session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.tier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Mark as read if currently unread
    if (message.status === "unread") {
      message.status = "read";
      await message.save();
    }

    return NextResponse.json(message.toObject());
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.tier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.adminReply || !body.adminReply.trim()) {
      return NextResponse.json(
        { error: "Reply cannot be empty" },
        { status: 400 }
      );
    }

    await connectDB();

    const message = await Message.findByIdAndUpdate(
      id,
      {
        adminReply: body.adminReply.trim(),
        status: "replied",
      },
      { new: true, runValidators: true }
    ).lean();

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error replying to message:", error);
    return NextResponse.json(
      { error: "Failed to reply to message" },
      { status: 500 }
    );
  }
}
