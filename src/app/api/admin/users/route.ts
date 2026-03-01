import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "@/lib/get-session";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.tier !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");

    await connectDB();

    const filter: Record<string, string> = {};
    if (tier && tier !== "all") {
      filter.tier = tier;
    }

    const users = await mongoose.connection.db!
      .collection("user")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
