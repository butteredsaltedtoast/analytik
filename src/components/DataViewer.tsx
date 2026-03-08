export default function DataViewer({
  fileContent: _fc,
  fileName: _fn,
}: {
  fileContent: string;
  fileName: string;
}) {
  return (
    <div className="border border-gray-800 rounded-lg p-6">
      <p className="text-gray-500">
        Data visualization loading... (waiting for frontend1 merge)
      </p>
    </div>
  );
}
