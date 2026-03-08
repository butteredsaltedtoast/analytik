"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApiKey } from "@/context/ApiKeyContext";

export default function FileUpload() {
  const router = useRouter();
  const { apiKey } = useApiKey();
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [methodsFile, setMethodsFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDataFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv") && !file.name.endsWith(".json")) {
      setError("Only .csv and .json files are supported for data.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setError(null);
    setDataFile(file);
  }

  function handleMethodsFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
      setError("Only .pdf and .txt files are supported for methods.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Methods file must be under 5MB.");
      return;
    }

    setError(null);
    setMethodsFile(file);
  }

  async function handleAnalyze() {
    if (!dataFile) {
      setError("Please upload a data file first.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const dataText = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(dataFile);
      });

      let methodsText: string | undefined;
      if (methodsFile) {
        if (methodsFile.name.endsWith(".txt")) {
          methodsText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(methodsFile);
          });
        } else if (methodsFile.name.endsWith(".pdf")) {
          methodsText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(`[PDF file: ${methodsFile.name}]\nNote: PDF content extraction not yet implemented. Please use .txt for now.`);
            };
            reader.onerror = reject;
            reader.readAsDataURL(methodsFile);
          });
        }
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        body: JSON.stringify({ 
          fileContent: dataText, 
          fileName: dataFile.name,
          methodsContent: methodsText
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const { analysis } = await res.json();

      const experiment = {
        id: crypto.randomUUID(),
        name: dataFile.name,
        fileContent: dataText,
        analysis: analysis,
        createdAt: new Date().toISOString(),
      };

      const stored = JSON.parse(
        localStorage.getItem("analytik-experiments") || "[]"
      );
      stored.push(experiment);
      localStorage.setItem("analytik-experiments", JSON.stringify(stored));

      router.push(`/experiments/${experiment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Data File (Required)
          </label>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleDataFile}
            disabled={uploading}
            className="hidden"
            id="data-file-input"
          />
          <label
            htmlFor="data-file-input"
            className={`cursor-pointer block border border-gray-700 rounded-lg p-4 text-center ${
              uploading
                ? "text-gray-500 cursor-not-allowed bg-gray-900"
                : "text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            {dataFile ? (
              <span className="text-white">📄 {dataFile.name}</span>
            ) : (
              "Click to upload CSV or JSON"
            )}
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Methods/Context (Optional)
          </label>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleMethodsFile}
            disabled={uploading}
            className="hidden"
            id="methods-file-input"
          />
          <label
            htmlFor="methods-file-input"
            className={`cursor-pointer block border border-gray-700 rounded-lg p-4 text-center ${
              uploading
                ? "text-gray-500 cursor-not-allowed bg-gray-900"
                : "text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            {methodsFile ? (
              <span className="text-white">📋 {methodsFile.name}</span>
            ) : (
              "Click to upload PDF or TXT (optional)"
            )}
          </label>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={uploading || !dataFile}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          uploading || !dataFile
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-white text-black hover:bg-gray-200"
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
          "Analyze"
        )}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
}
