import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP provider
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSuperAdminMail({ email, requestId }: { email: string; requestId: string }) {
  const approveUrl = `${process.env.NEXTAUTH_URL}/api/login-requests/approve?id=${requestId}`;
  const declineUrl = `${process.env.NEXTAUTH_URL}/api/login-requests/decline?id=${requestId}`;

  await transporter.sendMail({
    from: `"System" <${process.env.SMTP_USER}>`,
    to: process.env.SUPER_ADMIN_EMAIL, // defined in .env
    subject: "Admin Login Attempt",
    html: `
      <h3>Admin Login Attempt Detected</h3>
      <p><b>Email:</b> ${email}</p>
      <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      <a href="${approveUrl}" style="margin-right:20px;">✅ Approve</a>
      <a href="${declineUrl}">❌ Decline</a>
    `,
  });
}
                                                                                                                            