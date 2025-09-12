// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Get the token from cookies
    const cookies = req.headers.get('cookie');
    let token = null;
    
    if (cookies) {
      const tokenMatch = cookies.match(/next-auth\.session-token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
    }

    // If we have a valid session, reset approval status
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
        const userId = decoded.sub;
        
        if (userId) {
          const user = await User.findById(userId);
          
          // Reset approval status for admin users (not super_admin)
          if (user && user.role === "admin") {
            await User.findByIdAndUpdate(userId, {
              loginApproved: false,
              approvalPending: false,
              lastLogout: new Date()
            });
            console.log(`Reset approval status for user: ${user.email}`);
          }
        }
      } catch (jwtError) {
        console.log("Could not decode session token during logout:", jwtError);
        // Continue with logout even if we can't reset approval
      }
    }

    // Create response and clear cookies
    const response = NextResponse.json({
      message: "Logged out successfully",
    });

    // Clear NextAuth cookies
    response.cookies.set("next-auth.session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    response.cookies.set("next-auth.csrf-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;

  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}