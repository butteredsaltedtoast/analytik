"use client";

import FileUpload from "@/components/FileUpload";

export default function NewExperimentPage() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="space-y-6 max-w-2xl mx-auto py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Upload Experiment</h1>
        <p className="text-gray-400 text-sm">
          Upload a CSV or JSON file with your experimental data. Optionally include a PDF or TXT file with methods/context for better analysis. Analytik will
          analyze it and generate visualizations automatically.
        </p>
      </div>
      <FileUpload />
      <div className="text-xs text-gray-600 space-y-1">
        <p>Data formats: .csv, .json</p>
        <p>Methods formats: .pdf, .txt (optional)</p>
        <p>Maximum file size: 5MB per file</p>
      </div>
      </div>
    </div>
  );
}
