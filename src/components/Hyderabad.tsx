import { useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hyderabad: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const originDotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const dot = originDotRef.current;

    if (!section || !path || !dot) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      // 1. Origin Dot pulses & scales
      tl.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, transformOrigin: 'center' }
      );

      // 2. Red line travels across section and shoots past screen
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          ease: 'power2.inOut',
          duration: 2.0,
        },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hyderabad"
      ref={sectionRef}
      className="relative w-full bg-[#EDE8DE] py-32 md:py-48 overflow-hidden border-t border-[#D8D3CA]"
    >
      {/* BACKGROUND IMAGE — Sophisticated urban Hyderabad evening ambiance */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/images/hyderabad_bg.jpg"
          alt="Contemporary Hyderabad music ambiance"
          className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.05]"
        />
        {/* Warm editorial overlay — keeps off-white tone while showing image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDE8DE]/90 via-[#EDE8DE]/70 to-[#EDE8DE]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE8DE]/20 via-transparent to-[#EDE8DE]/60" />
      </div>

      {/* DYNAMIC TRAVELING RED LINE SVG */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Origin coordinate point: 17.3850° N, 78.4867° E */}
          <circle
            ref={originDotRef}
            cx="180"
            cy="200"
            r="6"
            fill="#C91F25"
            className="drop-shadow-[0_0_8px_rgba(201,31,37,0.6)]"
          />
          <circle
            cx="180"
            cy="200"
            r="16"
            stroke="#C91F25"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="animate-spin"
            style={{ transformOrigin: '180px 200px', animationDuration: '10s' }}
          />

          {/* Thin red vector line traveling across and extending past the screen */}
          <path
            ref={pathRef}
            d="M 180 200 C 350 200, 450 140, 650 220 S 950 160, 1300 180"
            stroke="#C91F25"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 editorial-container">
        <div className="max-w-4xl space-y-8">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C91F25]" />
            <span className="text-[11px] font-sans-clean tracking-[0.35em] uppercase text-[#C91F25] font-semibold">
              07 / Origin Story
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#171717] leading-[1.08] break-words">
              BORN IN HYDERABAD.
              <br />
              <span className="text-[#C91F25]">BUILT FOR BANDS EVERYWHERE.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-[#D8D3CA]">
            <div className="md:col-span-4 text-xs font-sans-clean uppercase tracking-[0.25em] text-[#65625D]">
              Deccan Rock Heritage
              <br />
              17.3850° N, 78.4867° E
            </div>
            <div className="md:col-span-8 space-y-4">
              <p className="font-serif-sub text-xl sm:text-2xl text-[#171717] leading-relaxed">
                Hyderabad has long held the quiet soul of Indian live rock. From open-air college auditoriums to the underground warehouse sessions of Jubilee Hills, the city understands that music is best served loud, raw, and uncompromised.
              </p>
              <p className="font-sans-clean text-sm text-[#65625D] leading-relaxed">
                We didn't build Rithmos as a regional festival. We built it here because the soil carries centuries of rhythmic innovation and modern acoustic audacity. From this foundation, we stretch across the subcontinent to Europe, the Americas, and wherever live instrumentation thrives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
