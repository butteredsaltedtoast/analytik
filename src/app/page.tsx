import dynamic from "next/dynamic";

const AnimatedHomeContent = dynamic(() => import("../components/AnimatedHomeContent"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center px-6" style={{ height: 'calc(100vh - 73px)' }}>
      <AnimatedHomeContent />
    </div>
  );
}