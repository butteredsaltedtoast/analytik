import { GoogleGenAI } from "@google/genai";

function getClient(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

export async function analyzeExperiment(fileContent: string, apiKey: string): Promise<string> {
  const response = await getClient(apiKey).models.generateContent({
    model: "gemini-2.0-flash",
    contents: fileContent,
    config: {

      systemInstruction: `You are a senior research scientist analyzing experimental data.

Analyze the provided data thoroughly and respond with EXACTLY these four markdown sections:

## Key Findings
Summarize the most important results. Include specific numbers from the data. Identify trends, correlations, and statistically notable observations.

## Pattern Recognition
Describe hidden patterns, non-obvious relationships between variables, and structural properties of the data that aren't immediately apparent. Look for periodicity, clustering, phase transitions, or emergent behavior.

## Hidden Problems
Identify anomalies, outliers, potential measurement errors, missing data concerns, confounding variables, or methodological issues. Flag anything that could undermine the validity of the results.

## Proposed Next Experiments
Based on the findings and problems identified, suggest 1-3 specific follow-up experiments. Each should include what variable to change, what range to test, and what hypothesis it would test.

Be precise. Use numbers from the data. Do not be vague or generic.
`

    },
  });

  return response.text ?? "";

}

export async function chatWithExperiment(
  messages: Array<{ role: string; content: string }>,
  experimentContext: string,
  apiKey: string
): Promise<string> {

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = await getClient(apiKey).chats.create({
    model: "gemini-1.5-flash",
    history: history,
    config: {
      systemInstruction: `You are an AI lab partner helping a researcher understand their experimental data.

Here is the experiment data:
${experimentContext}

Help the researcher interpret results, suggest explanations, identify patterns, and think through implications. Be conversational but precise. Reference specific numbers from the data when relevant. If the researcher asks about something not in the data, say so clearly.`,
    },
  });

  const response = await chat.sendMessage({
    message: lastMessage.content,
  });

  return response.text ?? "";

}
