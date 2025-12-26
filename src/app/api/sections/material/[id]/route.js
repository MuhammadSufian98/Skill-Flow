import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req, ctx) {
  try {
    const paramId = ctx?.params?.id;
    const pathId = req.nextUrl?.pathname?.split("/").filter(Boolean).pop();
    const id = paramId || pathId;

    if (!id || id === "material") {
      return NextResponse.json(
        { ok: false, error: "id is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const material = await db.collection("material").findOne({ _id: id });

    if (!material) {
      return NextResponse.json(
        { ok: false, error: "not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: material });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
