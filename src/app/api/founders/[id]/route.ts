import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Founder from "@/models/Founder";
import { getServerSession } from "@/lib/get-session";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const founder = await Founder.findById(params.id).lean();
    if (!founder) {
      return NextResponse.json({ error: "Founder not found" }, { status: 404 });
    }
    return NextResponse.json(founder);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updates = await request.json();
    const founder = await Founder.findByIdAndUpdate(params.id, updates, {
      new: true,
    }).lean();

    if (!founder) {
      return NextResponse.json({ error: "Founder not found" }, { status: 404 });
    }

    return NextResponse.json(founder);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const founder = await Founder.findByIdAndDelete(params.id);
    if (!founder) {
      return NextResponse.json({ error: "Founder not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
