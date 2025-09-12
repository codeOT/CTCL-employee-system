
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ isSuperAdmin: false });
    }

    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    const isSuperAdmin = session.user.email === SUPER_ADMIN_EMAIL;

    return NextResponse.json({ 
      isSuperAdmin,
      userEmail: session.user.email // Optional: for debugging
    });

  } catch (error) {
    console.error("Check super admin error:", error);
    return NextResponse.json({ isSuperAdmin: false });
  }
}