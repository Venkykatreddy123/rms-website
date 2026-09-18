import { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CinematicMotionBackground } from '../components/CinematicMotionBackground';

const Story           = lazy(() => import('../components/Story').then(m => ({ default: m.Story })));
const StageExperience = lazy(() => import('../components/StageExperience').then(m => ({ default: m.StageExperience })));
const Bands           = lazy(() => import('../components/Bands').then(m => ({ default: m.Bands })));
const Competition     = lazy(() => import('../components/Competition').then(m => ({ default: m.Competition })));
const Experience      = lazy(() => import('../components/Experience').then(m => ({ default: m.Experience })));
const Watch           = lazy(() => import('../components/Watch').then(m => ({ default: m.Watch })));
const Hyderabad       = lazy(() => import('../components/Hyderabad').then(m => ({ default: m.Hyderabad })));
const Partners        = lazy(() => import('../components/Partners').then(m => ({ default: m.Partners })));
const FinalCTA        = lazy(() => import('../components/FinalCTA').then(m => ({ default: m.FinalCTA })));
const Footer          = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const Fallback = () => <div className="w-full h-32 bg-[#EDE8DE] animate-pulse" aria-hidden="true" />;

interface OutletCtx { onOpenRegister: () => void }

export default function HomePage() {
  const { onOpenRegister } = useOutletContext<OutletCtx>();

  return (
    <div className="cinematic-home-page relative">
      {/* GLOBAL CINEMATIC MOTION BACKGROUND ACROSS WHOLE HOME PAGE */}
      <CinematicMotionBackground isGlobal={true} />

      <main className="relative z-10">
        {/* 1. Hero */}
        <Hero onOpenRegister={onOpenRegister} />

        {/* 2. Story — Why Rithmos */}
        <Suspense fallback={<Fallback />}>
          <Story />
        </Suspense>

        {/* 3. Stage Experience — Interactive Instrument Rig */}
        <Suspense fallback={<Fallback />}>
          <StageExperience />
        </Suspense>

        {/* 4. Bands — Horizontal Editorial Gallery */}
        <Suspense fallback={<Fallback />}>
          <Bands />
        </Suspense>

        {/* 5. Competition — 6-Stage Color Progression */}
        <Suspense fallback={<Fallback />}>
          <Competition />
        </Suspense>

        {/* 6. Experience — The 5-Word Scroll */}
        <Suspense fallback={<Fallback />}>
          <Experience />
        </Suspense>

        {/* 7. Watch — Performance Archive */}
        <Suspense fallback={<Fallback />}>
          <Watch />
        </Suspense>

        {/* 8. Hyderabad — Origin Story */}
        <Suspense fallback={<Fallback />}>
          <Hyderabad />
        </Suspense>

        {/* 9. Partners */}
        <Suspense fallback={<Fallback />}>
          <Partners />
        </Suspense>

        {/* 10. Final CTA */}
        <Suspense fallback={<Fallback />}>
          <FinalCTA onOpenRegister={onOpenRegister} />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}
