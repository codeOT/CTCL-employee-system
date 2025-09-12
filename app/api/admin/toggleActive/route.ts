import { NextResponse } from "next/server";
import connectDB  from "@/lib/connectDB";
import User from "@/models/Users";

export async function POST(req: Request) {
  const { userId, isActive } = await req.json();
  await connectDB();
  await User.findByIdAndUpdate(userId, { isActive });
  return NextResponse.json({ success: true });
}
