import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    if (!apiKey?.trim() || !apiKey.startsWith("gsk_")) {
      return NextResponse.json(
        { error: "Invalid API key format. Groq keys start with gsk_" },
        { status: 400 }
      );
    }
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 400 }
    );
  }
}
