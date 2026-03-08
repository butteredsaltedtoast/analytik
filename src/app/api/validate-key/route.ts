import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const { apiKey } = await req.json();
        if (!apiKey?.trim() || !apiKey.startsWith("AIza")) {
            return NextResponse.json({ error: "Invalid API key format." }, { status: 400 });
        }
        return NextResponse.json({ valid: true });
    } catch {
        return NextResponse.json({ error: "Something went wrong." }, { status: 400 });
    }
}