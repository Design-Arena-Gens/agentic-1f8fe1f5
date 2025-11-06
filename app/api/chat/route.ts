import { NextResponse } from "next/server";
import { generateAnswer } from "@/lib/chat";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.question !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const language = typeof body.language === "string" ? body.language : undefined;

  const response = generateAnswer(body.question, language);

  return NextResponse.json(response);
}
