export default function AnalysisResult({ analysis }: { analysis: string }) {
  // TODO: Render analysis with proper formatting (markdown or sections)
  return (
    <div className="border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Analysis</h2>
      <pre className="whitespace-pre-wrap text-sm text-gray-300">{analysis}</pre>
    </div>
  );
}
