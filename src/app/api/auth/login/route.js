import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "email and password required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({ sub: String(user._id), email: user.email });

    const res = NextResponse.json({
      ok: true,
      token,
      user: {
        id: user.userId || String(user._id),
        userId: user.userId || String(user._id),
        name: user.name || "",
        email: user.email,
        role: user.role || "user",
        level: user.level ?? 0,
        publicProfile: Boolean(user.publicProfile),
        reminders: Boolean(user.reminders),
        createdAt: user.createdAt,
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
