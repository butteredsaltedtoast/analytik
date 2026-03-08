import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AnalysisResult({ analysis }: { analysis: string }) {
  return (
    <div className="border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Analysis</h2>
      <div className="prose prose-invert max-w-none max-h-96 overflow-y-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
      </div>
    </div>
  );
}
