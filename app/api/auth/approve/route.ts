// app/api/auth/approve/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";
import { sendApprovalNotification } from "@/lib/sendUserNotification";

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    const userId = decoded.sub;

    // Find and update the user
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Approve the user
    user.loginApproved = true;
    user.approvalPending = false;
    user.approvedAt = new Date();
    user.isActive = true;
    await user.save();

    // Send notification to user
    try {
      await sendApprovalNotification(user.email, user.name, true);
      console.log(`Approval notification sent to ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send approval notification:", emailError);
      // Continue even if email fails
    }

    // Return a success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Approved</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .success { color: green; }
        </style>
      </head>
      <body>
        <h1 class="success">✅ User Approved Successfully</h1>
        <p>User <strong>${user.email}</strong> has been approved for login access.</p>
        <p>They can now log in to the system.</p>
        <p><em>A notification email has been sent to the user.</em></p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    console.error("Approve user error:", error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Approval Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1 class="error">❌ Approval Failed</h1>
        <p>There was an error approving the user: ${error.message}</p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}