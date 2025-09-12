// app/api/auth/forget-password/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectDB from "@/lib/connectDB";
import User from "@/models/Users";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateRandomPassword(): string {
  return crypto.randomBytes(6).toString('hex'); // 12 character password
}

export async function POST(req: Request) {
  try {
    console.log("Forget password API called");
    
    await connectDB();
    const { email } = await req.json();
    
    console.log("Email received:", email);
    console.log("Super admin email:", process.env.SUPER_ADMIN_EMAIL);
    
    // Check if email matches super admin
    if (email !== process.env.SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Only super admin can reset password" },
        { status: 403 }
      );
    }
    
    // Generate new password
    const newPassword = generateRandomPassword();
    console.log("New password generated:", newPassword);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update or create user
    let user = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
    
    if (!user) {
      console.log("Creating new user with data:", {
        name: "Super Admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        role: "super_admin",
        isActive: true,
        loginApproved: true,
        approvalPending: false
      });
      
      try {
        user = await User.create({
          name: "Super Admin",
          email: process.env.SUPER_ADMIN_EMAIL,
          password: hashedPassword,
          role: "super_admin",
          isActive: true,
          loginApproved: true,
          approvalPending: false,
          approvedAt: new Date(),
          passwordChangedAt: new Date()
        });
        console.log("Created new super admin user successfully");
      } catch (createError) {
        console.error("User creation error:", createError);
        return NextResponse.json(
          { error: "Failed to create user",},
          { status: 500 }
        );
      }
    } else {
      console.log("Updating existing user");
      try {
        // Ensure all required fields are set, including name
        user.name = user.name || "Super Admin"; // Set name if it's missing
        user.password = hashedPassword;
        user.passwordChangedAt = new Date();
        user.isActive = true;
        user.loginApproved = true;
        user.approvalPending = false;
        if (!user.approvedAt) {
          user.approvedAt = new Date();
        }
        await user.save();
        console.log("Updated existing user successfully");
      } catch (updateError) {
        console.error("User update error:", updateError);
        return NextResponse.json( 
          { error: "Failed to update user", },
          { status: 500 }
        );
      }
    }
    
    // Send email using the same method that worked in the test
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Password Reset - Employee Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0ea5e9; color: white; padding: 20px; text-align: center;">
            <h1>Password Reset</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Hello ${user.name},</h2>
            <p>Your password has been reset successfully.</p>
            
            <div style="background-color: #e0f2fe; padding: 15px; border-left: 4px solid #0ea5e9; margin: 15px 0;">
              <strong>New Password:</strong> 
              <code style="background: #fff; padding: 5px; border: 1px solid #ddd; font-size: 16px;">${newPassword}</code>
            </div>
            
            <div style="background-color: #fef3cd; padding: 10px; border: 1px solid #ffeaa7; border-radius: 4px; margin: 10px 0;">
              <strong>Security Notice:</strong>
              <ul>
                <li>Login immediately and change this password</li>
                <li>Do not share this password</li>
                <li>Delete this email after use</li>
              </ul>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>Employee Management System - ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });
    
    console.log("Email sent result:", result);
    
    if (result.error) {
      console.error("Email send error:", result.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: "New password sent to your email",
      emailId: result.data?.id
    });
    
  } catch (error: any) {
    console.error("Forget password error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}