import { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';

const Competition = lazy(() => import('../components/Competition').then(m => ({ default: m.Competition })));
const Experience  = lazy(() => import('../components/Experience').then(m => ({ default: m.Experience })));
const FinalCTA    = lazy(() => import('../components/FinalCTA').then(m => ({ default: m.FinalCTA })));
const Footer      = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const Fallback = () => <div className="w-full h-64 bg-[#EDE8DE] animate-pulse" aria-hidden="true" />;

interface OutletCtx { onOpenRegister: () => void }

export default function CompetitionPage() {
  const { onOpenRegister } = useOutletContext<OutletCtx>();

  return (
    <main className="pt-20">
      {/* Page title banner */}
      <div className="editorial-container py-10 border-b border-[#D8D3CA]">
        <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-2">
          Season 01 — National Circuit
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-[#171717] tracking-tight">
          THE COMPETITION
        </h1>
        <p className="font-sans-clean text-sm text-[#65625D] mt-3 max-w-xl">
          Six stages. One national champion. From city auditions to the grand finale — the complete Rithmos competitive journey.
        </p>
      </div>

      {/* 6-Stage Competition */}
      <Suspense fallback={<Fallback />}><Competition /></Suspense>

      {/* The 5-Word Scroll Experience */}
      <Suspense fallback={<Fallback />}><Experience /></Suspense>

      {/* Final CTA */}
      <Suspense fallback={<Fallback />}><FinalCTA onOpenRegister={onOpenRegister} /></Suspense>

      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
}
