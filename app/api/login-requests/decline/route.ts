import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import LoginRequest from "@/models/LoginRequest";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const loginRequest = await LoginRequest.findById(id);
  if (!loginRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  loginRequest.status = "declined";
  await loginRequest.save();

  return NextResponse.json({ message: "Admin login declined ❌" });
}
