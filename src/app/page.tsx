import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8 py-12">
      <h1 className="text-4xl font-bold">Analytik</h1>
      <p className="text-xl text-gray-400">
        Surface the invisible architecture in your experimental data.
      </p>

      {/* TODO: Build out landing page — vision statement, feature highlights, CTA */}
      <p className="text-gray-500">Landing page content goes here.</p>

      <Link
        href="/experiments/new"
        className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
      >
        Upload Experiment
      </Link>
    </div>
  );
}
