// app/api/admin/decline/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.loginApproved = false;
  await user.save();

  return NextResponse.json({ success: true, message: "Admin declined successfully" });
}
