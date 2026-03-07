"use client";

import FileUpload from "@/components/FileUpload";

export default function NewExperimentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upload Experiment</h1>
      <FileUpload />
    </div>
  );
}
