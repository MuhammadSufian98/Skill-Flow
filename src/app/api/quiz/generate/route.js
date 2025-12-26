import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is your fallback/predefined quiz
const PREDEFINED_QUIZ = [
  {
    q: "What is the primary purpose of a Next.js API route?",
    o: [
      "To render HTML",
      "To create backend endpoints",
      "To style components",
      "To manage CSS",
    ],
    a: "To create backend endpoints",
  },
  {
    q: "Which hook is used for client-side data fetching in React?",
    o: ["useEffect", "useBackend", "useData", "useFetch"],
    a: "useEffect",
  },
];

export async function POST(req) {
  try {
    const { id, title, topic, useAI = true } = await req.json();

    // 1. Validation
    if (!id || !title || !topic) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // 2. Logic for Predefined Quiz (The "Flag")
    if (!useAI) {
      return NextResponse.json({
        ok: true,
        id,
        source: "static",
        quiz: PREDEFINED_QUIZ,
      });
    }

    // 3. Logic for Gemini AI
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // Latest cost-optimized model
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const prompt = `Generate a 10-question MCQ quiz on "${topic}" (${title}). 
    Return ONLY a JSON array: [{"q": "string", "o": ["a", "b", "c", "d"], "a": "string"}].`;

    const result = await model.generateContent(prompt);
    const quizData = JSON.parse(result.response.text());

    return NextResponse.json({
      ok: true,
      id,
      source: "gemini",
      quiz: quizData,
    });
  } catch (err) {
    console.error("Quiz Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
