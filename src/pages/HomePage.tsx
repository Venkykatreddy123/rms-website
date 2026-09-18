import { useOutletContext } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CinematicMotionBackground } from '../components/CinematicMotionBackground';
import { Story } from '../components/Story';
import { StageExperience } from '../components/StageExperience';
import { Bands } from '../components/Bands';
import { Competition } from '../components/Competition';
import { Experience } from '../components/Experience';
import { Watch } from '../components/Watch';
import { Hyderabad } from '../components/Hyderabad';
import { Partners } from '../components/Partners';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

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
        <Story />

        {/* 3. Stage Experience — Interactive Instrument Rig */}
        <StageExperience />

        {/* 4. Bands — Horizontal Editorial Gallery */}
        <Bands />

        {/* 5. Competition — 6-Stage Color Progression */}
        <Competition />

        {/* 6. Experience — The 5-Word Scroll */}
        <Experience />

        {/* 7. Watch — Performance Archive */}
        <Watch />

        {/* 8. Hyderabad — Origin Story */}
        <Hyderabad />

        {/* 9. Partners */}
        <Partners />

        {/* 10. Final CTA */}
        <FinalCTA onOpenRegister={onOpenRegister} />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

