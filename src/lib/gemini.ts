import { GoogleGenAI } from "@google/genai";

const _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeExperiment(_fileContent: string): Promise<string> {
  // TODO: Implement Gemini call with research scientist prompt
  // Model: gemini-2.0-flash
  // Sections: Key Findings, Invisible Architecture, Hidden Problems, Proposed Next Experiments
  throw new Error("Not implemented");
}

export async function chatWithExperiment(
  _messages: { role: string; content: string }[],
  _experimentContext: string
): Promise<string> {
  // TODO: Implement Gemini chat with AI lab partner prompt
  // Model: gemini-2.0-flash
  throw new Error("Not implemented");
}
