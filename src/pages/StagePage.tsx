import { lazy, Suspense } from 'react';

const StageExperience = lazy(() => import('../components/StageExperience').then(m => ({ default: m.StageExperience })));
const Footer          = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const Fallback = () => <div className="w-full h-screen bg-[#EDE8DE] animate-pulse" aria-hidden="true" />;

export default function StagePage() {
  return (
    <main>
      {/* Page title banner */}
      <div className="editorial-container pt-28 pb-10 border-b border-[#D8D3CA]">
        <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-2">
          Interactive — Build the Rig
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-[#171717] tracking-tight">
          THE STAGE
        </h1>
        <p className="font-sans-clean text-sm text-[#65625D] mt-3 max-w-xl">
          Scroll to assemble the full live rig — mic, drums, guitar, brass. Experience the stage before the bands take it.
        </p>
      </div>

      {/* Interactive Stage Assembly */}
      <Suspense fallback={<Fallback />}><StageExperience /></Suspense>

      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
}
