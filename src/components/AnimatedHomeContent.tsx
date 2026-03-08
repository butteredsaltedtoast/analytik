"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import upload from "../assets/upload.png";
import ai from "../assets/ai.png";
import chat from "../assets/chat.png";
import { useRouter } from "next/navigation";
import { useApiKey } from "@/context/ApiKeyContext";

export default function AnimatedHomeContent() {
  const router = useRouter();
  const { isSignedIn, showModal } = useApiKey();
  function gatedPush(href: string) {
    if (isSignedIn) router.push(href);
    else showModal();
  }
  return (
    <motion.div
      className="w-full max-w-5xl space-y-4"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Hero */}
      <div className="space-y-2 max-w-3xl -mt-4">
        <h1 className="text-2xl md:text-4xl font-bold leading-tight">
          Your AI lab partner
        </h1>
        <p className="text-base md:text-xl text-gray-400 leading-relaxed">
          Upload experimental data. Get AI-powered analysis with key findings,
          hidden problems, and suggested next experiments. Visualize everything
          with publication-quality charts.
        </p>
        <div className="flex gap-4 items-center pt-4 pb-6">
          <button onClick={() => gatedPush("/experiments/new")} className="inline-block bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-gray-200 text-sm md:text-base transition-colors">
            Upload New Experiment
          </button>
          <button onClick={() => gatedPush("/experiments")} className="text-gray-400 hover:text-white text-sm md:text-base transition-colors">
            View Old Experiments
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-gray-800 rounded-lg p-3 md:p-4 space-y-1">
          <Image src={upload} alt="Upload" width={50} height={50} />
          <h3 className="font-semibold">Upload & Visualize</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Upload data through a CSV or JSON file. See the data in an interactive table with descriptive statistics. Analytik also automatically generates accurate graphs.
          </p>
        </div>
        <div className="border border-gray-800 rounded-lg p-3 md:p-4 space-y-1">
          <Image src={ai} alt="AI" width={50} height={50} />
          <h3 className="font-semibold">AI Analysis</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Get a structured analysis covering key findings, hidden problems you might have missed, and proposed next experiments.
          </p>
        </div>
        <div className="border border-gray-800 rounded-lg p-3 md:p-4 space-y-1">
          <Image src={chat} alt="Chat" width={50} height={50} />
          <h3 className="font-semibold">Chat & Explore</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ask questions, test hypotheses, and explore your data. Analytik has full context of your experiment. Chat history saves across sessions.
          </p>
        </div>
      </div>
    </motion.div>
  );
}