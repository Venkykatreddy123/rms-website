import { useState, useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  { id: 'sound', text: 'THE SOUND.', sub: 'Analogue warmth hitting eight thousand chests.' },
  { id: 'crowd', text: 'THE CROWD.', sub: 'Strangers chanting the same chorus in the dark.' },
  { id: 'moment', text: 'THE MOMENT.', sub: 'When the distortion pedal drops and time halts.' },
  { id: 'stage', text: 'THE STAGE.', sub: 'Wooden planks where sweat, wood, and steel unite.' },
  { id: 'rise', text: 'THE RISE.', sub: 'From garage rehearsals to the national spotlight.' },
];

export const Experience: FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Pin container and update active phrase based on scroll progress
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const step = Math.min(Math.floor(self.progress * WORDS.length), WORDS.length - 1);
          setActiveIndex(step);
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#F4F0E8] overflow-hidden flex items-center justify-center border-t border-[#D8D3CA]"
    >
      {/* GIANT CONCERT AUDIENCE BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/images/experience_bg.jpg"
          alt="Concert audience facing illuminated stage"
          className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] saturate-[1.1]"
        />
        {/* Editorial overlay — reduced to show more of the concert photo */}
        <div className="absolute inset-0 bg-[#F4F0E8]/55" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#F4F0E8] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#F4F0E8] to-transparent" />
      </div>

      {/* EDITORIAL 5-WORD POEM */}
      <div className="relative z-10 editorial-container text-center max-w-4xl py-12">
        <span className="text-[11px] font-sans-clean tracking-[0.35em] uppercase text-[#C91F25] font-semibold block mb-8">
          05 / The Sensory Cadence
        </span>

        <div ref={wordsContainerRef} className="relative min-h-[220px] flex flex-col items-center justify-center">
          {WORDS.map((word, idx) => {
            const isActive = activeIndex === idx;
            const isPast = activeIndex > idx;

            return (
              <div
                key={word.id}
                className={`transition-all duration-700 ease-out flex flex-col items-center justify-center ${
                  isActive
                    ? 'opacity-100 translate-y-0 scale-100 z-20'
                    : isPast
                    ? 'opacity-15 -translate-y-6 scale-[0.96] absolute pointer-events-none'
                    : 'opacity-0 translate-y-10 scale-[0.96] absolute pointer-events-none'
                }`}
              >
                <h2 className="font-display text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#171717] leading-none mb-3 sm:mb-4 text-center px-4">
                  {word.text}
                </h2>

                {/* Animated Red Underline following active phrase */}
                <div
                  className={`h-[3px] sm:h-[4px] bg-[#C91F25] rounded-full transition-all duration-700 ${
                    isActive ? 'w-24 sm:w-32 md:w-48 opacity-100' : 'w-0 opacity-0'
                  }`}
                />

                {/* Evocative Subtitle */}
                <p
                  className={`font-serif-sub italic text-sm sm:text-2xl text-[#65625D] mt-4 sm:mt-6 max-w-xl transition-opacity duration-500 px-4 text-center ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {word.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* PROGRESS STEP DOTS */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {WORDS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                activeIndex === i ? 'w-10 bg-[#C91F25]' : 'w-2 bg-[#D8D3CA]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
