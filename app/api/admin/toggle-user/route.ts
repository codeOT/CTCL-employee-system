import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";
import Session from "@/models/Session";

export async function POST(req: Request) {
  const { userId, isActive } = await req.json();
  await connectDB();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  );

  await Session.deleteMany({ userId }); 

  return NextResponse.json({ success: true, updatedUser });
}
