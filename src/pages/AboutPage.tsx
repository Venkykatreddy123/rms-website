import { lazy, Suspense } from 'react';

const Story      = lazy(() => import('../components/Story').then(m => ({ default: m.Story })));
const Experience = lazy(() => import('../components/Experience').then(m => ({ default: m.Experience })));
const Hyderabad  = lazy(() => import('../components/Hyderabad').then(m => ({ default: m.Hyderabad })));
const Partners   = lazy(() => import('../components/Partners').then(m => ({ default: m.Partners })));
const Footer     = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const Fallback = () => <div className="w-full h-32 bg-[#EDE8DE] animate-pulse" aria-hidden="true" />;

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Page title banner */}
      <div className="editorial-container py-10 border-b border-[#D8D3CA]">
        <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-2">
          Rithmos — Season 01
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-[#171717] tracking-tight">
          ABOUT
        </h1>
        <p className="font-sans-clean text-sm text-[#65625D] mt-3 max-w-xl">
          Who we are, where we come from, and why we built the national stage for live Indian music.
        </p>
      </div>

      {/* Story — Manifesto */}
      <Suspense fallback={<Fallback />}><Story /></Suspense>

      {/* Experience — The 5-Word Scroll */}
      <Suspense fallback={<Fallback />}><Experience /></Suspense>

      {/* Hyderabad — Origin Story */}
      <Suspense fallback={<Fallback />}><Hyderabad /></Suspense>

      {/* Partners */}
      <Suspense fallback={<Fallback />}><Partners /></Suspense>

      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
}
