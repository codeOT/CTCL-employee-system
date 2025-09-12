import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import  connectDB  from "@/lib/connectDB";
import User from "@/models/Users";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin")
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id, isActive } = await req.json();
  if (!id || typeof isActive !== "boolean")
    return NextResponse.json({ error: "Missing id or isActive" }, { status: 400 });

  await connectDB();
  await User.updateOne({ _id: id }, { isActive });
  return NextResponse.json({ ok: true });
}
