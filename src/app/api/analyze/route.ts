import { NextRequest, NextResponse } from "next/server";
// import { analyzeExperiment } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const _fileContent: string = body.fileContent;
  const _fileName: string = body.fileName;

  // TODO: Call analyzeExperiment(fileContent) and return { analysis }
  void _fileContent;
  void _fileName;
  return NextResponse.json({ analysis: "Analysis not implemented yet." });
}
