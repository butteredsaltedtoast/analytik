"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Experiment } from "@/lib/types";
import AnalysisResult from "@/components/AnalysisResult";
import ChatWindow from "@/components/ChatWindow";
import DataViewer from "@/components/DataViewer";
import { triggerAsyncId } from "async_hooks";

export default function ExperimentPage() {
  const { id } = useParams<{ id: string }>();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"data" | "analysis" | "chat">(
    "data"
  );
  useEffect(() => {
    const stored = localStorage.getItem("analytik-experiments");
    if (stored) {
      const experiments: Experiment[] = JSON.parse(stored);
      setExperiment(experiments.find((e) => e.id === id) ?? null);
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!experiment) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-gray-400 text-lg">Experiment not found.</p>
        <a
          href="/experiments"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Back to experiments
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{experiment.name}</h1>
          <p className="text-sm text-gray-500">
            {new Date(experiment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <a
          href="/experiments"
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          All experiments
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {(["data", "analysis", "chat"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
              ? "border-white text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content — all rendered, hidden via CSS to preserve state */}
      <div className={activeTab === "data" ? "" : "hidden"}>
        <DataViewer
          fileContent={experiment.fileContent}
          fileName={experiment.name}
        />
      </div>

      <div className={activeTab === "analysis" ? "" : "hidden"}>
        <AnalysisResult analysis={experiment.analysis} />
      </div>

      <div className={activeTab === "chat" ? "" : "hidden"}>
        <ChatWindow
          experimentId={experiment.id}
          experimentContext={experiment.fileContent}
        />
      </div>

    </div>
  );
}
