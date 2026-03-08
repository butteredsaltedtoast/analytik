"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Experiment } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useApiKey } from "@/context/ApiKeyContext";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const router = useRouter();
  const { requireAuth } = useApiKey();

  useEffect(() => {
    const stored = localStorage.getItem("analytik-experiments");
    try
    {
    if (stored) setExperiments(JSON.parse(stored));
    }
    catch {
      localStorage.removeItem("analytik-experiments");
    }
    }, []);

  function deleteExperiment(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const updated = experiments.filter((exp) => exp.id !== id);
    setExperiments(updated);
    localStorage.setItem("analytik-experiments", JSON.stringify(updated));
    localStorage.removeItem(`analytik-chat-${id}`);
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <Link
          href="/experiments/new"
          onClick={(e) => {
            if (!requireAuth(() => router.push("/experiments/new"))) {
              e.preventDefault();
            }
          }}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          + New
        </Link>
      </div>

      {experiments.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-gray-500 text-lg">No experiments yet.</p>
          <p className="text-gray-600 text-sm">
            Upload a CSV or JSON file to get AI-powered analysis and
            visualizations.
          </p>
          <Link
            href="/experiments/new"
            onClick={(e) => {
              if (!requireAuth(() => router.push("/experiments/new"))) {
                e.preventDefault();
              }
            }}
            className="inline-block bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Upload your first experiment
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {experiments.map((exp) => (
            <li key={exp.id}>
              <Link
                href={`/experiments/${exp.id}`}
                className="block border border-gray-800 rounded-lg p-4 hover:border-gray-600 group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{exp.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {exp.analysis.replace(/#{1,3}\s/g, "").slice(0, 120)}...
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteExperiment(e, exp.id)}
                    className="text-gray-600 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
