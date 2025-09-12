import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";

export async function GET() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users });
}
