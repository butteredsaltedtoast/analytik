import ReactMarkdown from "react-markdown";

export default function AnalysisResult({ analysis }: { analysis: string }) {
  if (!analysis || analysis === "Analysis not implemented yet.") {
    return (
      <div className="border border-gray-800 rounded-lg p-6">
        <p className="text-gray-500">No analysis available yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">AI Analysis</h2>
      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-gray-100 prose-headings:border-b prose-headings:border-gray-800 prose-headings:pb-2 prose-headings:mb-3
        prose-p:text-gray-300
        prose-li:text-gray-300
        prose-strong:text-white
        prose-ul:space-y-1
      ">
        <ReactMarkdown>{analysis}</ReactMarkdown>
      </div>
    </div>
  );
}
