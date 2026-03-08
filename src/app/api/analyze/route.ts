import { NextRequest, NextResponse } from "next/server";
import { analyzeExperiment } from "@/lib/gemini";

export async function POST(req: NextRequest) {

  try {
    const apiKey = req.headers.get("x-gemini-key");
    if (!apiKey) return NextResponse.json({ error: "Missing Gemini API key." }, { status: 401 });
    const body = await req.json();
    const fileContent: string = body.fileContent;
    const fileName: string = body.fileName;

    if (!fileContent || typeof fileContent !== "string" || fileContent.trim() === "") {
      return NextResponse.json(
        { error: "fileContent is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!fileName || typeof fileName !== "string" || fileName.trim() === "") {

      return NextResponse.json(
        { error: "fileName is required and must be a non-empty string." },
        { status: 400 }
      );

    }

    const analysis = await analyzeExperiment(fileContent, apiKey);
    return NextResponse.json({ analysis });

  }

  catch (error) {

    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "An error occurred during analysis. Please try again." },
      { status: 500 }
    );

  }

}
