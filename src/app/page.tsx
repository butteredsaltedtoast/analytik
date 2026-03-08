import dynamic from "next/dynamic";

const AnimatedHomeContent = dynamic(() => import("../components/AnimatedHomeContent"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6">
      <AnimatedHomeContent />
    </div>
  );
}