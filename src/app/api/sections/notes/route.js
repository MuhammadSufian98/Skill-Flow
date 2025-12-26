import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

// Helper function to get the userId from the cookie token
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

// GET handler to fetch the user's notes
export async function GET(req) {
  try {
    const userIdStr = await getUserIdFromCookieToken();
    if (!userIdStr) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Fetch notes for the logged-in user
    const notes = await db
      .collection("notes")
      .find({ userId: new ObjectId(userIdStr) })
      .toArray();

    return NextResponse.json({ ok: true, data: notes });
  } catch (err) {
    console.error("GET /notes ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}

// POST handler to save a new note
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
    const text = body?.text?.trim(); // Extracting the note text

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "Note text is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const now = new Date();

    const newNote = {
      userId: new ObjectId(userIdStr),
      text,
      createdAt: now,
      updatedAt: now,
    };

    // Save the note to the database
    const result = await db.collection("notes").insertOne(newNote);

    // Fetch the newly inserted note using the insertedId
    const savedNote = await db
      .collection("notes")
      .findOne({ _id: result.insertedId });

    return NextResponse.json({ ok: true, data: savedNote });
  } catch (err) {
    console.error("POST /notes ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
