"use client";

import FileUpload from "@/components/FileUpload";
import { AuthGate } from "@/components/AuthGate";

export default function NewExperimentPage() {
  return (
    <AuthGate>
      <div className="space-y-6 max-w-2xl mx-auto py-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Upload Experiment</h1>
          <p className="text-gray-400 text-sm">
            Upload a CSV or JSON file with your experimental data. Analytik will
            analyze it and generate visualizations automatically.
          </p>
        </div>
        <FileUpload />
        <div className="text-xs text-gray-600 space-y-1">
          <p>Supported formats: .csv, .json</p>
          <p>Maximum file size: 5MB</p>
        </div>
      </div>
    </AuthGate>
  );
}
