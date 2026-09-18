import { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';

const Bands   = lazy(() => import('../components/Bands').then(m => ({ default: m.Bands })));
const FinalCTA = lazy(() => import('../components/FinalCTA').then(m => ({ default: m.FinalCTA })));
const Footer  = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const Fallback = () => <div className="w-full h-64 bg-[#EDE8DE] animate-pulse" aria-hidden="true" />;

interface OutletCtx { onOpenRegister: () => void }

export default function BandsPage() {
  const { onOpenRegister } = useOutletContext<OutletCtx>();

  return (
    <main className="pt-20">
      {/* Page title banner */}
      <div className="editorial-container py-10 border-b border-[#D8D3CA]">
        <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-2">
          Season 01 — Artist Roster
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-[#171717] tracking-tight">
          THE BANDS
        </h1>
        <p className="font-sans-clean text-sm text-[#65625D] mt-3 max-w-xl">
          Every act on the Rithmos circuit is here on musical merit alone. No backing tracks. Raw live performance evaluated by an editorial jury.
        </p>
        <button
          onClick={onOpenRegister}
          className="mt-6 px-8 py-3 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.25em] font-bold hover:bg-[#8F171C] transition-colors"
        >
          REGISTER YOUR BAND →
        </button>
      </div>

      {/* Band Gallery */}
      <Suspense fallback={<Fallback />}><Bands /></Suspense>

      {/* Final CTA */}
      <Suspense fallback={<Fallback />}><FinalCTA onOpenRegister={onOpenRegister} /></Suspense>

      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
}
