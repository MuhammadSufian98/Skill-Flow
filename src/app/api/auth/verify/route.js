import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, verificationCode, password, name, role } = await req.json();

    if (!email || !verificationCode || !password || !name) {
      return NextResponse.json(
        {
          ok: false,
          error: "email, verification code, password, and name are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const verificationCodes = db.collection("verification_codes"); // Temporary collection
    const users = db.collection("users");

    // Check if verification code exists for the email in the temporary collection
    const verificationRecord = await verificationCodes.findOne({
      email: email.toLowerCase(),
    });

    if (!verificationRecord) {
      return NextResponse.json(
        {
          ok: false,
          error: "Verification code not found. Please request a new code.",
        },
        { status: 404 }
      );
    }

    // Log the verification codes for debugging
    console.log("Frontend verification code:", verificationCode);
    console.log(
      "Backend verification code (stored in DB):",
      verificationRecord.verificationCode
    );

    // Ensure both are treated as integers for comparison
    if (verificationRecord.verificationCode !== verificationCode) {
      return NextResponse.json(
        { ok: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (verificationRecord.verificationExpires < new Date()) {
      return NextResponse.json(
        { ok: false, error: "Verification code expired" },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user in the `users` collection
    const result = await users.insertOne({
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: role || "user",
      createdAt: new Date(),
    });

    const userId = String(result.insertedId);

    // Delete the verification code after successful registration
    await verificationCodes.deleteOne({ email: email.toLowerCase() });

    // Generate a token
    const token = await signToken({
      sub: userId,
      email: email.toLowerCase(),
    });

    const res = NextResponse.json({
      ok: true,
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase(),
        role: role || "user",
        createdAt: new Date(),
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
