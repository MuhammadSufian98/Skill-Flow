import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const sectionsCol = db.collection("global");

    const sections = await sectionsCol
      .find({ isActive: true })
      .project({ _id: 1, topic: 1, title: 1, order: 1, isActive: 1, quiz: 1 })
      .sort({ topic: 1, order: 1 })
      .toArray();

    const topicMap = new Map();

    for (const s of sections) {
      const topic = String(s.topic || "").trim();
      if (!topic) continue;

      if (!topicMap.has(topic)) {
        topicMap.set(topic, { topic, sections: [] });
      }

      topicMap.get(topic).sections.push({
        _id: String(s._id),
        topic: s.topic,
        title: s.title || "",
        order: s.order ?? 0,
        isActive: Boolean(s.isActive),
        quiz: s.quiz || {},
      });
    }

    const topics = Array.from(topicMap.values()).map((t) => ({
      topic: t.topic,
      sections: t.sections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      totalSections: t.sections.length,
    }));

    topics.sort((a, b) => a.topic.localeCompare(b.topic));

    return NextResponse.json({ ok: true, topics });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
