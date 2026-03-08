import Groq from "groq-sdk";

function getClient(apiKey?: string) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("No API key provided. Please connect your Groq API key.");
  }
  return new Groq({ apiKey: key });
}

export async function analyzeExperiment(fileContent: string, apiKey?: string): Promise<string> {
  const response = await getClient(apiKey).chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a senior research scientist analyzing experimental data.

Analyze the provided data thoroughly and respond with EXACTLY these four markdown sections:

## Key Findings
Summarize the most important results. Include specific numbers from the data. Identify trends, correlations, and statistically notable observations.

## Pattern Recognition
Describe hidden patterns, non-obvious relationships between variables, and structural properties of the data that aren't immediately apparent. Look for periodicity, clustering, phase transitions, or emergent behavior.

## Hidden Problems
Identify anomalies, outliers, potential measurement errors, missing data concerns, confounding variables, or methodological issues. Flag anything that could undermine the validity of the results.

## Proposed Next Experiments
Based on the findings and problems identified, suggest 1-3 specific follow-up experiments. Each should include what variable to change, what range to test, and what hypothesis it would test.

Be precise. Use numbers from the data. Do not be vague or generic.`
      },
      {
        role: "user",
        content: fileContent,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function chatWithExperiment(
  messages: { role: string; content: string }[],
  experimentContext: string,
  apiKey?: string
): Promise<string> {
  const response = await getClient(apiKey).chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an AI lab partner helping a researcher understand their experimental data.

Here is the experiment data:
${experimentContext}

Help the researcher interpret results, suggest explanations, identify patterns, and think through implications. Be conversational but precise. Reference specific numbers from the data when relevant. If the researcher asks about something not in the data, say so clearly.`,
      },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}
