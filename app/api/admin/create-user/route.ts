import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB  from "@/lib/connectDB";
import User from "@/models/Users";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin")
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { name, email, password, role = "user" } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const doc = await User.create({ name, email, password: hashed, role, isActive: true });

  return NextResponse.json({ user: { id: doc._id, email: doc.email, name: doc.name } });
}



