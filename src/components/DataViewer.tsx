"use client";

import { useEffect, useMemo, useState } from "react";

interface Chart {
  title: string;
  image: string;
}

interface ColumnStats {
  n: number;
  mean: number;
  std: number;
  min: number;
  q25: number;
  median: number;
  q75: number;
  max: number;
}

interface DataViewerProps {
  fileContent: string;
  fileName: string;
}

function parseCSV(csv: string): Record<string, string | number>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string | number> = {};
    headers.forEach((header, i) => {
      const num = Number(values[i]);
      row[header] = isNaN(num) ? values[i] : num;
    });
    return row;
  });
}

function parseData(
  fileContent: string,
  fileName: string
): Record<string, string | number>[] {
  if (fileName.endsWith(".json")) {
    try {
      const parsed = JSON.parse(fileContent);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }
  return parseCSV(fileContent);
}

export default function DataViewer({ fileContent, fileName }: DataViewerProps) {
  const data = useMemo(
    () => parseData(fileContent, fileName),
    [fileContent, fileName]
  );
  const columns = useMemo(
    () => (data.length > 0 ? Object.keys(data[0]) : []),
    [data]
  );

  const [charts, setCharts] = useState<Chart[]>([]);
  const [stats, setStats] = useState<Record<string, ColumnStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileContent || data.length === 0) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch("/api/visualize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent, fileName }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Visualization failed");
        }
        const result = await res.json();
        setCharts(result.charts || []);
        setStats(result.stats || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "Visualization failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [fileContent, fileName, data.length]);

  if (data.length === 0) {
    return (
      <div className="border border-gray-800 rounded-lg p-6">
        <p className="text-gray-500">Could not parse data from file.</p>
      </div>
    );
  }

  const statCols = Object.keys(stats);

  return (
    <div className="space-y-8">
      <div className="border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Raw Data</h2>
          <span className="text-xs text-gray-500">
            {data.length} rows, {columns.length} columns
          </span>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-gray-900">
              <tr className="border-b border-gray-700">
                <th className="px-3 py-2 text-gray-500 font-mono text-xs w-8">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-gray-400 font-medium"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-800 hover:bg-gray-900/50"
                >
                  <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                    {i + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2 text-gray-300 font-mono">
                      {typeof row[col] === "number"
                        ? (row[col] as number) % 1 === 0
                          ? row[col]
                          : (row[col] as number).toFixed(4)
                        : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {statCols.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Descriptive Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-3 py-2 text-gray-400 font-medium">
                    Variable
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    n
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Mean
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Std
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Min
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Q1
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Median
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Q3
                  </th>
                  <th className="px-3 py-2 text-gray-400 font-medium text-right">
                    Max
                  </th>
                </tr>
              </thead>
              <tbody>
                {statCols.map((col) => (
                  <tr
                    key={col}
                    className="border-b border-gray-800 hover:bg-gray-900/50"
                  >
                    <td className="px-3 py-2 text-gray-300 font-medium">
                      {col}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-right font-mono">
                      {stats[col].n}
                    </td>
                    <td className="px-3 py-2 text-gray-300 text-right font-mono">
                      {stats[col].mean}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-right font-mono">
                      {stats[col].std}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-right font-mono">
                      {stats[col].min}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-right font-mono">
                      {stats[col].q25}
                    </td>
                    <td className="px-3 py-2 text-gray-300 text-right font-mono">
                      {stats[col].median}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-right font-mono">
                      {stats[col].q75}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-right font-mono">
                      {stats[col].max}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Visualizations</h2>

        {loading && (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-500">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating visualizations...
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm py-4">{error}</p>
        )}

        {!loading && !error && charts.length === 0 && (
          <p className="text-gray-500 text-sm">
            No visualizations available for this data.
          </p>
        )}

        {charts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart, i) => (
              <div key={i} className="space-y-2">
                <p className="text-sm font-medium text-gray-400">
                  {chart.title}
                </p>
                <img
                  src={chart.image}
                  alt={chart.title}
                  className="w-full rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
