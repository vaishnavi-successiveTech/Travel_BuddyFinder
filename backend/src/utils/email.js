import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,       // SSL
  secure: true,    // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (error) {
    console.log("❌ Error sending email:", error);
    throw error;
  }
};
