import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

async function getUserIdFromCookieToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const id = payload.userId || payload.sub;
    if (!id) return null;
    if (!ObjectId.isValid(id)) return null;

    return id;
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return null;
  }
}

export async function GET(req) {
  try {
    const userIdStr = await getUserIdFromCookieToken();
    if (!userIdStr) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get("materialId");

    if (!materialId) {
      return NextResponse.json(
        { ok: false, error: "materialId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const doc = await db.collection("progress").findOne({
      userId: new ObjectId(userIdStr),
      materialId: String(materialId),
    });

    return NextResponse.json({ ok: true, data: doc || null });
  } catch (err) {
    console.error("GET /progress ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const userIdStr = await getUserIdFromCookieToken();
    if (!userIdStr) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const materialId = String(body?.materialId || "");

    if (!materialId) {
      return NextResponse.json(
        { ok: false, error: "materialId is required" },
        { status: 400 }
      );
    }

    const progress = Number.isFinite(+body?.progress)
      ? Math.max(0, Math.min(100, Math.round(body.progress)))
      : 0;

    const lastHeading =
      typeof body?.lastHeading === "string" ? body.lastHeading : "";

    const timeSpentSec = Number.isFinite(+body?.timeSpentSec)
      ? Math.max(0, Math.floor(body.timeSpentSec))
      : 0;

    // Connect to the database and fetch the subject details
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Fetch the material details from the global collection
    const section = await db
      .collection("global")
      .findOne(
        { _id: materialId, isActive: true },
        { projection: { quiz: 1 } }
      );

    if (
      !section ||
      !section.quiz ||
      typeof section.quiz.unlockAtProgress !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid materialId or unlock criteria" },
        { status: 400 }
      );
    }

    // Check if the progress meets the unlock threshold
    const unlockAtProgress = section.quiz.unlockAtProgress;
    const quizUnlocked = progress >= unlockAtProgress;

    // Filter for the user's progress record
    const filter = {
      userId: new ObjectId(userIdStr),
      materialId,
    };

    // Update the user's progress and quizUnlocked flag
    const now = new Date();

    await db.collection("progress").updateOne(
      filter,
      {
        $set: {
          progress,
          lastHeading,
          timeSpentSec,
          quizUnlocked, // Set the quizUnlocked flag based on progress
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    // Fetch the updated progress record and return it
    const saved = await db.collection("progress").findOne(filter);

    return NextResponse.json({ ok: true, data: saved });
  } catch (err) {
    console.error("POST /progress ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
