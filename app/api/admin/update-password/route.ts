import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";
import Session from "@/models/Session";

export async function POST(req: Request) {
  const { userId, newPassword } = await req.json();
  await connectDB();

  const hashed = await bcrypt.hash(newPassword, 10);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: hashed, passwordChangedAt: new Date() },
    { new: true }
  );

  await Session.deleteMany({ userId }); // Force logout

  return NextResponse.json({ success: true, updatedUser });
}
