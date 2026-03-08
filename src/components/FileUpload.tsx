"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FileUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".json")) {
      setError("Only .csv and .json files are supported.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // 1. Read file as text
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });

      // 2. POST to /api/analyze
      // const res = await fetch("/api/analyze", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ fileContent: text, fileName: file.name }),
      // });

      // if (!res.ok) {
      //   const errData = await res.json();
      //   throw new Error(errData.error || "Analysis failed");
      // }

      // const { analysis } = await res.json();

      // STUB — remove when backend is ready
    await new Promise((r) => setTimeout(r, 1500)); // fake delay

      const analysis = `
      ## Key Findings
      - Temperature and yield show an inverse relationship above 30°C
      - Peak yield of 92% occurs at 30°C and 1.5 atm

      ## Invisible Architecture
      - Pressure and temperature are linearly correlated in this dataset (r=0.99)
      - The yield curve suggests a reaction optimum near 28-32°C

      ## Hidden Problems
      - Only 4 data points — insufficient for statistical significance
      - No replicate measurements to assess reproducibility
      - Pressure and temperature are confounded — cannot isolate effects

      ## Proposed Next Experiments
      - Hold temperature at 30°C and vary pressure from 0.5 to 3.0 atm
      - Add replicates (n=3) at each condition
      - Test temperatures 28, 29, 30, 31, 32°C at fixed pressure`;

      

      // 3. Save to localStorage
      const experiment = {
        id: crypto.randomUUID(),
        name: file.name,
        fileContent: text,
        analysis: analysis,
        createdAt: new Date().toISOString(),
      };

      const stored = JSON.parse(
        localStorage.getItem("analytik-experiments") || "[]"
      );
      stored.push(experiment);
      localStorage.setItem("analytik-experiments", JSON.stringify(stored));

      // 4. Redirect to experiment page
      router.push(`/experiments/${experiment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUploading(false);
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center space-y-3">
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFile}
        disabled={uploading}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className={`cursor-pointer block ${
          uploading
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-400 hover:text-white"
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing... this may take a moment
          </span>
        ) : (
          "Click to upload CSV or JSON"
        )}
      </label>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
