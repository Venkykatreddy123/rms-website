import { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';

const Watch    = lazy(() => import('../components/Watch').then(m => ({ default: m.Watch })));
const FinalCTA = lazy(() => import('../components/FinalCTA').then(m => ({ default: m.FinalCTA })));
const Footer   = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const Fallback = () => <div className="w-full h-64 bg-[#EDE8DE] animate-pulse" aria-hidden="true" />;

interface OutletCtx { onOpenRegister: () => void }

export default function WatchPage() {
  const { onOpenRegister } = useOutletContext<OutletCtx>();

  return (
    <main className="pt-20">
      {/* Page title banner */}
      <div className="editorial-container py-10 border-b border-[#D8D3CA]">
        <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-2">
          Rithmos Archive — Live Performances
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-[#171717] tracking-tight">
          WATCH
        </h1>
        <p className="font-sans-clean text-sm text-[#65625D] mt-3 max-w-xl">
          Unedited. Unfiltered. Live. A curated archive of every stage moment captured on the Rithmos circuit.
        </p>
      </div>

      {/* Performance Archive */}
      <Suspense fallback={<Fallback />}><Watch /></Suspense>

      {/* Final CTA */}
      <Suspense fallback={<Fallback />}><FinalCTA onOpenRegister={onOpenRegister} /></Suspense>

      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
}
