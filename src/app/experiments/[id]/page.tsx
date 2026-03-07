"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Experiment } from "@/lib/types";
import AnalysisResult from "@/components/AnalysisResult";
import ChatWindow from "@/components/ChatWindow";

export default function ExperimentPage() {
  const { id } = useParams<{ id: string }>();
  const [experiment, setExperiment] = useState<Experiment | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("analytik-experiments");
    if (stored) {
      const experiments: Experiment[] = JSON.parse(stored);
      setExperiment(experiments.find((e) => e.id === id) ?? null);
    }
  }, [id]);

  if (!experiment) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{experiment.name}</h1>
      <AnalysisResult analysis={experiment.analysis} />
      <ChatWindow experimentId={experiment.id} />
    </div>
  );
}
