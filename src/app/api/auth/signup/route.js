import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection("users");
    const verificationCodes = db.collection("verification_codes"); // Temporary collection

    const exists = await users.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "email already exists" },
        { status: 409 }
      );
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    const mailOptions = {
      from: `"Skill Flow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: `
    <div style="background: linear-gradient(to bottom right, #4A90E2, #9B59B6); padding: 30px; color: white; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: white; color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        
        <h2 style="font-size: 32px; font-weight: bold; color: #4A90E2; text-align: center;">Skill Flow - Email Verification</h2>
        
        <p style="font-size: 16px; line-height: 1.5;">Hello ${name},</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Thank you for registering. Please use the following code to verify your email address:</p>
        
        <h2 style="font-size: 40px; color: #FF6347; font-weight: bold; text-align: center; margin-top: 20px; letter-spacing: 2px;">${verificationCode}</h2>
        
        <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">This code will expire in 15 minutes.</p>
        
        <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">If you did not request this, please ignore this email.</p>
        
        <div style="text-align: center; margin-top: 40px;">
          <p style="font-size: 16px; line-height: 1.5;">Best regards,</p>
          <p style="font-size: 16px; line-height: 1.5;">The Skill Flow Team</p>
        </div>

        <footer style="margin-top: 40px; text-align: center; font-size: 14px; color: #888;">
          <p>Skill Flow | Learn, Challenge, Grow</p>
        </footer>

      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    await verificationCodes.insertOne({
      email: email.toLowerCase(),
      verificationCode,
      verificationExpires,
    });

    return NextResponse.json({
      ok: true,
      message: "Verification code sent to email. Please check your inbox.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
