import { useState, useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPETITION_STAGES } from '../data/rithmosData';
import { Trophy, ArrowRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Competition: FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      stagesRef.current.forEach((el, index) => {
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveStageIndex(index),
          onEnterBack: () => setActiveStageIndex(index),
        });

        const numberEl = el.querySelector('.stage-number');
        const headingEl = el.querySelector('.stage-heading');
        const accentLineEl = el.querySelector('.stage-accent-line');

        if (numberEl && headingEl && accentLineEl) {
          gsap.fromTo(
            numberEl,
            { opacity: 0.3 },
            {
              opacity: 1,
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          gsap.fromTo(
            headingEl,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          gsap.fromTo(
            accentLineEl,
            { width: 0 },
            {
              width: 120,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Visual styling mapped to each stage's color progression
  const getStageThemeClasses = (index: number) => {
    switch (index) {
      case 0:
        // Stage 01: Off-white
        return {
          bg: 'bg-[#F4F0E8]',
          border: 'border-[#D8D3CA]',
          number: 'text-[#65625D]',
          title: 'text-[#171717]',
          line: 'bg-[#D8D3CA]',
          pill: 'bg-[#EDE8DE] text-[#171717]',
        };
      case 1:
        // Stage 02: Auditions (Small red details)
        return {
          bg: 'bg-[#EDE8DE]',
          border: 'border-[#D8D3CA]',
          number: 'text-[#C91F25]/70',
          title: 'text-[#171717]',
          line: 'bg-[#C91F25]/60',
          pill: 'bg-[#F4F0E8] text-[#C91F25] border border-[#C91F25]/30',
        };
      case 2:
        // Stage 03: Live Rounds (Red becomes stronger)
        return {
          bg: 'bg-[#EDE8DE]',
          border: 'border-[#C91F25]/40',
          number: 'text-[#C91F25]',
          title: 'text-[#171717]',
          line: 'bg-[#C91F25]',
          pill: 'bg-[#C91F25]/10 text-[#C91F25] border border-[#C91F25]',
        };
      case 3:
        // Stage 04: Semi Finals (Large red typography)
        return {
          bg: 'bg-[#F4F0E8]',
          border: 'border-[#C91F25]',
          number: 'text-[#C91F25]',
          title: 'text-[#C91F25]',
          line: 'bg-[#C91F25]',
          pill: 'bg-[#C91F25] text-[#F4F0E8]',
        };
      case 4:
        // Stage 05: Grand Finale (Red + Gold)
        return {
          bg: 'bg-[#EDE8DE]',
          border: 'border-[#C9A45C]',
          number: 'text-[#C9A45C]',
          title: 'text-[#171717]',
          line: 'bg-gradient-to-r from-[#C91F25] to-[#C9A45C]',
          pill: 'bg-[#C9A45C] text-[#171717] font-semibold',
        };
      case 5:
        // Stage 06: Champion (Gold accent)
        return {
          bg: 'bg-[#F4F0E8]',
          border: 'border-[#C9A45C]',
          number: 'text-[#C9A45C]',
          title: 'text-[#C9A45C]',
          line: 'bg-[#C9A45C]',
          pill: 'bg-[#C9A45C] text-[#171717] font-bold shadow-sm',
        };
      default:
        return {
          bg: 'bg-[#F4F0E8]',
          border: 'border-[#D8D3CA]',
          number: 'text-[#171717]',
          title: 'text-[#171717]',
          line: 'bg-[#C91F25]',
          pill: 'bg-[#EDE8DE] text-[#171717]',
        };
    }
  };

  return (
    <section
      id="competition"
      ref={containerRef}
      className="relative w-full bg-[#F4F0E8] py-28 md:py-40 border-t border-[#D8D3CA]"
    >
      <div className="editorial-container">
        {/* HEADER */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[11px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-semibold block">
            04 / The Progression
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#171717]">
            SIX STAGES.
            <br />
            ONE RISING CHAMPION.
          </h2>
          <p className="font-serif-sub text-lg sm:text-xl text-[#65625D] max-w-xl leading-relaxed">
            The user literally feels the competition escalating through color. From the calm off-white registration to the radiant gold coronation.
          </p>
        </div>

        {/* STAGES CHRONOLOGY */}
        <div className="space-y-16 lg:space-y-24">
          {COMPETITION_STAGES.map((stage, idx) => {
            const theme = getStageThemeClasses(idx);
            const isActive = activeStageIndex === idx;

            return (
              <div
                key={stage.number}
                ref={(el) => {
                  stagesRef.current[idx] = el;
                }}
                className={`relative p-8 sm:p-12 md:p-16 border transition-all duration-700 ${theme.bg} ${theme.border} ${
                  isActive ? 'opacity-100 scale-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)]' : 'opacity-70 md:opacity-40 scale-[0.99]'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                  {/* LEFT: NUMBER & STAGE STATUS */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className={`stage-number font-display text-6xl sm:text-7xl md:text-8xl font-black tracking-tight ${theme.number}`}>
                        {stage.number}
                      </span>
                      {idx === 5 && (
                        <Trophy className="w-8 h-8 text-[#C9A45C]" />
                      )}
                    </div>
                    <span className={`inline-block px-3 py-1 text-[10px] uppercase font-sans-clean tracking-[0.25em] ${theme.pill}`}>
                      {stage.subtitle}
                    </span>
                  </div>

                  {/* RIGHT: DETAILS, TIMELINE & CRITERIA */}
                  <div className="lg:col-span-9 space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-sans-clean uppercase tracking-[0.2em] text-[#65625D]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C91F25]" />
                          {stage.timeline}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#D8D3CA]" />
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C91F25]" />
                          {stage.venue}
                        </span>
                      </div>

                      <h3 className={`stage-heading font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${theme.title}`}>
                        {stage.title}
                      </h3>

                      {/* Accent horizontal line expanding 0 -> 120px */}
                      <div className={`stage-accent-line h-[3px] ${theme.line} rounded-full mt-2`} />
                    </div>

                    <p className="font-sans-clean text-sm sm:text-base text-[#171717] leading-relaxed max-w-3xl">
                      {stage.description}
                    </p>

                    {/* JUDGING CRITERIA */}
                    <div className="pt-4 border-t border-[#D8D3CA]">
                      <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#65625D] font-bold block mb-3">
                        Evaluated By Editorial Jury:
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {stage.criteria.map((crit, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F4F0E8] border border-[#D8D3CA] text-xs font-sans-clean text-[#171717]"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C91F25]" />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* GRAND FINALE ATMOSPHERE BANNER */}
        <div className="mt-20 relative overflow-hidden border border-[#C9A45C] bg-[#EDE8DE]">
          <div className="aspect-[16/8] sm:aspect-[21/8] relative overflow-hidden">
            <img
              src="/assets/images/band1.jpg"
              alt="Grand Finale Arena — Rithmos Season 01"
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F0E8]/90 via-[#F4F0E8]/40 to-transparent flex items-center p-8 sm:p-16">
              <div className="max-w-xl space-y-4">
                <span className="text-xs font-sans-clean uppercase tracking-[0.3em] text-[#C9A45C] font-bold block">
                  The Ultimate Destination
                </span>
                <h4 className="font-display text-3xl sm:text-5xl font-bold text-[#171717] leading-tight">
                  HYDERABAD GACHIBOWLI ARENA
                </h4>
                <p className="font-serif-sub italic text-sm sm:text-base text-[#65625D]">
                  Ten thousand ticketed audience members, twenty-four high-definition cameras, and five bands fighting for eternity.
                </p>
                <div className="pt-2">
                  <a
                    href="#final"
                    className="inline-flex items-center gap-2 text-xs font-sans-clean uppercase tracking-[0.2em] text-[#C91F25] font-bold hover:underline"
                  >
                    <span>SECURE YOUR BAND'S AUDITION SLOT</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
