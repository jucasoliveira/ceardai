import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "@/lib/get-session";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

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

    const user = await mongoose.connection.db!
      .collection("user")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
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

    const validTiers = ["consumer", "early_buyer", "founder", "admin"];
    if (body.tier && !validTiers.includes(body.tier)) {
      return NextResponse.json(
        { error: "Invalid tier value" },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await mongoose.connection.db!
      .collection("user")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { tier: body.tier, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
