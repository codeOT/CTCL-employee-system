// lib/sendMail.ts
import nodemailer from "nodemailer";

export default async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.elasticemail.com",
    port: 2525,
    auth: {
      user: process.env.ELASTICEMAIL_USER!, // your Elastic Email login (usually email address)
      pass: process.env.ELASTICEMAIL_API_KEY!, // Elastic Email SMTP/API key
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!, // must be a verified sender in Elastic Email
    to,
    subject,
    html,
  });
}
