import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, body } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !body) {
      return NextResponse.json(
        { error: "All fields are required: name, email, subject, body" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    await connectDB();

    const message = await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      body: body.trim(),
    });

    return NextResponse.json(
      { success: true, id: message._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
