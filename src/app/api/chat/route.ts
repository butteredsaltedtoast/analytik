import { NextRequest, NextResponse } from "next/server";
// import { chatWithExperiment } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const _messages = body.messages;
  const _experimentContext: string = body.experimentContext;

  // TODO: Call chatWithExperiment(messages, experimentContext) and return { response }
  void _messages;
  void _experimentContext;
  return NextResponse.json({ response: "Chat not implemented yet." });
}
