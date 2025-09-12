import { Resend } from 'resend';
import { IUser } from "@/models/Users";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import PendingLogin from "@/models/PendingLogin";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendApprovalEmail(adminUser: IUser) {
  try {
    console.log("Starting email send for user:", adminUser.email);
    
    // Check required environment variables
    const requiredEnvVars = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
      FROM_EMAIL: process.env.FROM_EMAIL // Your verified domain email
    };
    
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
    
    console.log("Environment variables verified");

    // Create pending login record
    await connectDB();
    
    // Convert ObjectId to string properly
    const userId = (adminUser._id as mongoose.Types.ObjectId).toString();
    
    // Check if there's already a pending request
    const existingPending = await PendingLogin.findOne({ 
      userId: userId, 
      status: "pending" 
    });

    if (!existingPending) {
      await PendingLogin.create({
        userId: userId,
        email: adminUser.email,
        status: "pending",
        requestedAt: new Date()
      });
    }

    // Generate JWT token for approval process
    const approvalToken = jwt.sign(
      { sub: userId, email: adminUser.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "24h" } // Token valid for 24 hours
    );

    const approveUrl = `${process.env.NEXTAUTH_URL}/api/auth/approve?token=${approvalToken}`;
    const declineUrl = `${process.env.NEXTAUTH_URL}/api/auth/decline?token=${approvalToken}`;
    
    console.log("Generated URLs:", { approveUrl, declineUrl });

    const emailData = {
      from: `Admin System <${process.env.FROM_EMAIL}>`,
      to: process.env.SUPER_ADMIN_EMAIL!,
      subject: "Admin Login Request Approval",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Admin Login Request
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Admin Email:</strong> ${adminUser.email}</p>
            <p><strong>User ID:</strong> ${adminUser._id}</p>
            <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #555; margin: 20px 0;">
            An admin user is requesting access to the system. Please review and take action:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${approveUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-right: 15px; display: inline-block;">
              ✅ Approve Access
            </a>
            <a href="${declineUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              ❌ Decline Access
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: 1px solid #eee;">
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            This is an automated message from your employee management system.
            <br>
            If you did not expect this email, please contact your system administrator.
          </p>
        </div>
      `,
      text: `
        Admin Login Request

        Admin ${adminUser.email} is requesting access to the system.
        User ID: ${adminUser._id}
        Request Time: ${new Date().toLocaleString()}

        To approve: ${approveUrl}
        To decline: ${declineUrl}

        This is an automated message from your employee management system.
      `
    };

    console.log("Sending email with Resend:", {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject
    });

    const result = await resend.emails.send(emailData);
    
    console.log("Email sent successfully:", result);
    
    return { 
      success: true, 
      messageId: result.data?.id,
      result: result.data 
    };
    
  } catch (error) {
    console.error("Failed to send approval email:", error);
    
    // Resend-specific error handling
    if (error instanceof Error) {
      const resendError = error as any;
      
      if (resendError.message?.includes('API key')) {
        console.error("Invalid Resend API key. Check your RESEND_API_KEY environment variable.");
      } else if (resendError.message?.includes('domain')) {
        console.error("Domain not verified. Add and verify your domain in Resend dashboard.");
      } else if (resendError.message?.includes('from')) {
        console.error("Invalid from email. Use an email from your verified domain.");
      }
    }
    
    throw error; // Re-throw to handle upstream
  }
}