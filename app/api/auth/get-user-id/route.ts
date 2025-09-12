// /app/api/auth/get-user-id/route.ts
import { NextResponse } from "next/server";
import User from "@/models/Users";
import connectDB from "@/lib/connectDB";

export async function POST(req: Request) {
  await connectDB();
  
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('_id approvalPending loginApproved');
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      userId: user._id.toString(),
      approvalPending: user.approvalPending,
      loginApproved: user.loginApproved
    });
  } catch (error) {
    console.error('Error getting user ID:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}