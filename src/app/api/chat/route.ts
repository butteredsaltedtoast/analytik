import { NextRequest, NextResponse } from "next/server";
import { chatWithExperiment } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {

  const body = await req.json();
  const messages = body.messages;
  const experimentContext: string = body.experimentContext;

  if(!Array.isArray(messages) || messages.length === 0)
  {

    return NextResponse.json(
      { error: "messages is required and must be a non-empty array." },
      { status: 400 },
    );

  }

  if(!experimentContext || typeof experimentContext !== "string" || experimentContext.trim() === "")
  {

    return NextResponse.json(
      { error: "experimentContext is required and must be a non-empty string."},
      { status: 400 }
    );

  }

  const response = await chatWithExperiment(messages, experimentContext);
  return NextResponse.json({ response });

}

catch(error)
{

  console.error("Chat error:", error);
  return NextResponse.json(
    { error: "Failed to get chat response. Report this!"},
    { status: 500 },
  ); 

}

}
