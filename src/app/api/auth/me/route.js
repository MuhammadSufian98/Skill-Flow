import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "missing token" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    const user = await users.findOne(
      { _id: new ObjectId(payload.sub) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
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
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "invalid token" },
      { status: 401 }
    );
  }
}
