"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Experiment } from "@/lib/types";

const AnalysisResult = dynamic(() => import("@/components/AnalysisResult"), {
  ssr: false,
  loading: () => <div className="text-gray-500">Loading analysis...</div>,
});
const ChatWindow = dynamic(() => import("@/components/ChatWindow"), {
  ssr: false,
  loading: () => <div className="text-gray-500">Loading chat...</div>,
});
const DataViewer = dynamic(() => import("@/components/DataViewer"), {
  ssr: false,
  loading: () => <div className="text-gray-500">Loading data...</div>,
});

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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
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
        <Link href="/experiments">
          <motion.a
            className="text-sm text-gray-500 hover:text-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            All experiments
          </motion.a>
        </Link>
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
      <AnimatePresence mode="wait">
        {activeTab === "data" && (
          <motion.div
            key="data"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <DataViewer
              fileContent={experiment.fileContent}
              fileName={experiment.name}
            />
          </motion.div>
        )}

        {activeTab === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <AnalysisResult analysis={experiment.analysis} />
          </motion.div>
        )}

        {activeTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <ChatWindow
              experimentId={experiment.id}
              experimentContext={experiment.fileContent}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
