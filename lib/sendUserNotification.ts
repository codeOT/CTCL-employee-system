// lib/sendUserNotification.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalNotification(userEmail: string, userName: string, approved: boolean) {
  try {
    const subject = approved ? 
      'Login Access Approved - Employee Management System' : 
      'Login Access Declined - Employee Management System';

    const emailContent = approved ? `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .success-box { background-color: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Access Approved!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Great news! Your login access has been approved by the administrator.</p>
            
            <div class="success-box">
              <strong>✅ Your account is now active!</strong><br>
              You can now log in to the Employee Management System using your credentials.
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Go to the login page</li>
              <li>Enter your email and password</li>
              <li>Start using the system</li>
            </ul>
            
            <p>If you have any questions or need assistance, please contact your administrator.</p>
          </div>
          <div class="footer">
            <p>Employee Management System</p>
            <p>This is an automated notification - ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .decline-box { background-color: #fecaca; padding: 15px; border-left: 4px solid #ef4444; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Access Request Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>We're writing to inform you about the status of your login access request.</p>
            
            <div class="decline-box">
              <strong>❌ Your access request has been declined.</strong><br>
              You will not be able to log in to the Employee Management System at this time.
            </div>
            
            <p>If you believe this is an error or would like to discuss this decision, please contact your administrator or HR department.</p>
          </div>
          <div class="footer">
            <p>Employee Management System</p>
            <p>This is an automated notification - ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: `Employee Management System <${process.env.FROM_EMAIL}>`,
      to: [userEmail],
      subject: subject,
      html: emailContent,
    });

    console.log(`${approved ? 'Approval' : 'Decline'} notification sent to ${userEmail}:`, result);
    return result;

  } catch (error) {
    console.error(`Error sending ${approved ? 'approval' : 'decline'} notification:`, error);
    throw error;
  }
}