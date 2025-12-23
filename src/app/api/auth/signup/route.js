import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "email and password required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    const exists = await users.findOne(
      { email: email.toLowerCase() },
      { projection: { _id: 1 } }
    );
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name: name || "",
      email: email.toLowerCase(),
      passwordHash,
      role: role || "user",
      userId: "",
      level: 0,
      publicProfile: false,
      reminders: false,
      createdAt: new Date(),
    });

    const userId = String(result.insertedId);

    await users.updateOne({ _id: result.insertedId }, { $set: { userId } });

    const token = await signToken({ sub: userId, email: email.toLowerCase() });

    const res = NextResponse.json({
      ok: true,
      token,
      user: {
        id: userId,
        userId,
        name: name || "",
        email: email.toLowerCase(),
        role: role || "user",
        level: 0,
        publicProfile: false,
        reminders: false,
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
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
