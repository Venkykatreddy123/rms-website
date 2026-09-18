import { useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  onOpenRegister: () => void;
}

export const FinalCTA: FC<FinalCTAProps> = ({ onOpenRegister }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const redLineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const goldDetailRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const redLine = redLineRef.current;
    const heading = headingRef.current;
    const goldDetail = goldDetailRef.current;
    const ctaButton = ctaButtonRef.current;

    if (!section || !redLine || !heading || !goldDetail || !ctaButton) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'center 50%',
          scrub: 1,
        },
      });

      // 1. Red Line: 0 -> 100%
      tl.fromTo(
        redLine,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, ease: 'power2.out', duration: 1.2 },
        0
      );

      // 2. Heading: scale 0.92 -> 1
      tl.fromTo(
        heading,
        { scale: 0.92, opacity: 0.7 },
        { scale: 1.0, opacity: 1.0, ease: 'power2.out', duration: 1.2 },
        0.2
      );

      // 3. Gold Detail: opacity 0 -> 1
      tl.fromTo(
        goldDetail,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        0.5
      );

      // 4. CTA: Y: 20px -> 0
      tl.fromTo(
        ctaButton,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="final"
      ref={sectionRef}
      className="relative w-full min-h-[90vh] bg-[#F4F0E8] py-32 md:py-44 flex flex-col justify-center overflow-hidden border-t border-[#D8D3CA]"
    >
      {/* FULL CONCERT IMAGE BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/images/band1.jpg"
          alt="Rithmos live concert"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.1]"
        />
        {/* Warm editorial overlay — maintains off-white feel on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4F0E8]/95 via-[#F4F0E8]/80 to-[#F4F0E8]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F0E8]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 editorial-container">
        {/* EXPANDING RED ACCENT LINE (0 -> 100%) */}
        <div className="w-full mb-12">
          <div ref={redLineRef} className="w-full h-[2px] bg-[#C91F25]" />
        </div>

        <div className="max-w-4xl space-y-8">
          {/* HUGE RED TYPOGRAPHY: WHERE BANDS RISE */}
          <h2
            ref={headingRef}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.03em] text-[#C91F25] leading-[0.95]"
          >
            WHERE
            <br />
            BANDS
            <br />
            RISE.
          </h2>

          {/* GOLD DETAIL: RITHMOS LOGO */}
          <div ref={goldDetailRef} className="flex items-center gap-4 pt-2 opacity-0">
            <Sparkles className="w-5 h-5 text-[#C9A45C]" />
            <img
              src="/assets/images/rithmos_logo.png"
              alt="RITHMOS"
              className="h-8 w-auto object-contain"
              style={{ filter: 'sepia(1) saturate(3) hue-rotate(5deg) brightness(0.85)' }}
            />
            <span className="text-xs font-sans-clean uppercase tracking-[0.3em] text-[#65625D]">
              — NATIONAL ARCHIVE &amp; LIVE GRAND PRIX
            </span>
          </div>

          <p className="font-serif-sub italic text-xl sm:text-2xl text-[#171717] max-w-xl leading-relaxed">
            The amplifier is warmed up. The auditorium is waiting. Step up and take your place in history.
          </p>

          {/* REGISTER YOUR BAND CTA BUTTON */}
          <div className="pt-6">
            <button
              ref={ctaButtonRef}
              onClick={onOpenRegister}
              className="group inline-flex items-center gap-4 px-10 py-5 bg-[#C91F25] text-[#F4F0E8] text-xs sm:text-sm font-sans-clean uppercase tracking-[0.25em] font-bold hover:bg-[#8F171C] transition-all duration-300 shadow-sm"
            >
              <span>REGISTER YOUR BAND</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
