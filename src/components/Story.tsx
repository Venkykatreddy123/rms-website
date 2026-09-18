import { useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Story: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const redIndicatorLineRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const redLine = redIndicatorLineRef.current;
    const textGroup = textGroupRef.current;
    const img = imageRef.current;

    if (!section || !redLine || !img) return;

    const ctx = gsap.context(() => {
      // Thin red vertical line progress indicator: 0% -> 100% as user scrolls through the section
      gsap.fromTo(
        redLine,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );

      // Editorial text reveal: Y: 25px -> 0, opacity: 0 -> 1
      if (textGroup) {
        gsap.fromTo(
          textGroup,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textGroup,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Large photograph behavior: scale 1.04 -> 1.0, opacity 0.75 -> 1
      gsap.fromTo(
        img,
        { scale: 1.04, opacity: 0.75 },
        {
          scale: 1.0,
          opacity: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            end: 'center 45%',
            scrub: 0.8,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full bg-[#F4F0E8] py-28 md:py-40 border-t border-[#D8D3CA]"
    >
      <div className="editorial-container relative">
        {/* EDITORIAL TOP GRID: LEFT TITLE, RIGHT MANIFESTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20">
          {/* LEFT: WHY RITHMOS */}
          <div className="lg:col-span-5">
            <span className="text-[11px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-semibold block mb-4">
              01 / The Manifesto
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#171717] leading-[1.05]">
              WHY
              <br />
              <span className="text-[#C91F25]">RITHMOS</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#C91F25] mt-4 sm:mt-6" />
          </div>

          {/* RIGHT: LARGE EDITORIAL PARAGRAPH */}
          <div ref={textGroupRef} className="lg:col-span-7 space-y-4 sm:space-y-6">
            <p className="font-serif-sub text-xl sm:text-3xl md:text-4xl text-[#171717] leading-[1.3] tracking-[-0.01em]">
              In an era dominated by automated streams and solitary bedrooms, the authentic electric shock of five human beings locking into tempo on a wooden stage has become sacred.
            </p>
            <p className="font-sans-clean text-xs sm:text-base text-[#65625D] leading-relaxed max-w-2xl">
              Rithmos was born from a singular conviction: independent Indian live bands are creating some of the most emotionally charged, musically virtuosic, and culturally fearless sounds on the planet. Yet, they fight for sound systems worthy of their craft. Rithmos is not an academic contest. It is the definitive national stage built to elevate, document, and champion the bands that will define Indian music for the next half century.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-8 text-[11px] sm:text-xs font-sans-clean uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#171717]">
              <div>
                <span className="text-[#C91F25] font-bold">100%</span> LIVE SOUND
              </div>
              <div className="w-1 h-1 rounded-full bg-[#D8D3CA]" />
              <div>
                <span className="text-[#C91F25] font-bold">NO</span> PRE-RECORDED STEMS
              </div>
              <div className="w-1 h-1 rounded-full bg-[#D8D3CA]" />
              <div>
                <span className="text-[#C91F25] font-bold">ANALOGUE</span> INTEGRITY
              </div>
            </div>
          </div>
        </div>

        {/* THIN RED VERTICAL LINE CONNECTOR */}
        <div className="relative flex justify-center my-6">
          <div
            ref={redIndicatorLineRef}
            className="w-[2px] h-28 bg-[#C91F25] rounded-full"
          />
        </div>

        {/* BELOW: LARGE EDITORIAL PHOTOGRAPH */}
        <div className="relative mt-8 overflow-hidden border border-[#D8D3CA] bg-[#EDE8DE]">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              ref={imageRef}
              src="/assets/images/band1.jpg"
              alt="Indian live band performing on stage — authentic concert photography"
              className="w-full h-full object-cover object-center filter brightness-[1.01]"
            />
            {/* Subtle editorial vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F4F0E8]/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F0E8]/30 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#EDE8DE]/90 border-t border-[#D8D3CA]">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-[#C91F25]" />
              <span className="text-xs font-sans-clean uppercase tracking-[0.2em] text-[#171717] font-semibold">
                Live at Rithmos Season 01 — The Stage Ignites
              </span>
            </div>
            <p className="text-xs font-serif-sub italic text-[#65625D]">
              Gachibowli Live Arena, Hyderabad — Multi-track live recording, 8,000 capacity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
