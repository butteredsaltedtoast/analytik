"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Experiment } from "@/lib/types";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("analytik-experiments");
    if (stored) setExperiments(JSON.parse(stored));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <Link
          href="/experiments/new"
          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          + New
        </Link>
      </div>

      {experiments.length === 0 ? (
        <p className="text-gray-500">No experiments yet.</p>
      ) : (
        <ul className="space-y-3">
          {experiments.map((exp) => (
            <li key={exp.id}>
              <Link
                href={`/experiments/${exp.id}`}
                className="block border border-gray-800 rounded-lg p-4 hover:border-gray-600"
              >
                <p className="font-medium">{exp.name}</p>
                <p className="text-sm text-gray-500">{exp.createdAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
