import { useEffect, useRef, useState, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenRegister: () => void;
}

// Words of line 1 split so each can animate independently
const LINE_ONE_WORDS = ['EVERY', 'BAND', 'HAS', 'A', 'STORY.'];

// Line 2 prefix (always visible after reveal) and the typewritten word
const LINE_TWO_PREFIX = ['EVERY', 'STORY', 'NEEDS', 'A'];
const TYPEWRITER_WORD = 'STAGE.';

export const Hero: FC<HeroProps> = ({ onOpenRegister }) => {
  const containerRef   = useRef<HTMLDivElement>(null);
  const heroImageRef   = useRef<HTMLDivElement>(null);
  const wordRefs       = useRef<(HTMLSpanElement | null)[]>([]);
  const prefixRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const stageRef       = useRef<HTMLSpanElement>(null);
  const cursorRef      = useRef<HTMLSpanElement>(null);
  const redLineRef     = useRef<HTMLDivElement>(null);
  const supportRef     = useRef<HTMLDivElement>(null);
  const waveformRef    = useRef<HTMLCanvasElement>(null);

  // typewriter state
  const [typedChars, setTypedChars] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [stageFinished, setStageFinished] = useState(false);

  /* ── Waveform Canvas ─────────────────────────────────── */
  useEffect(() => {
    const canvas = waveformRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    let t = 0;
    const resize = () => {
      canvas.width  = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 48;
    };
    resize();
    window.addEventListener('resize', resize);
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height / 2;
      ctx.beginPath();
      ctx.strokeStyle = '#C91F25';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.45;
      for (let x = 0; x < canvas.width; x += 3) {
        const w1  = Math.sin(x * 0.008 + t) * 7;
        const w2  = Math.sin(x * 0.022 - t * 1.5) * 4;
        const w3  = Math.cos(x * 0.05 + t * 0.8) * 2;
        const env = Math.sin((x / canvas.width) * Math.PI);
        const y   = cy + (w1 + w2 + w3) * env;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  /* ── On-load GSAP entrance sequence ─────────────────── */
  useEffect(() => {
    const container = containerRef.current;
    const heroImage = heroImageRef.current;
    if (!container || !heroImage) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Skip motion — just make everything visible instantly
        gsap.set(heroImage, { opacity: 1, scale: 1 });
        const validWords = wordRefs.current.filter(Boolean);
        if (validWords.length) gsap.set(validWords, { opacity: 1, y: 0, rotateX: 0 });
        if (redLineRef.current) gsap.set(redLineRef.current, { scaleY: 1, opacity: 1 });
        const validPrefix = prefixRefs.current.filter(Boolean);
        if (validPrefix.length) gsap.set(validPrefix, { opacity: 1, y: 0, rotateX: 0 });
        if (supportRef.current) gsap.set(supportRef.current, { opacity: 1, y: 0 });
        // Still run typewriter but faster
        setCursorVisible(true);
        let i = 0;
        const type = () => {
          i++;
          setTypedChars(i);
          if (i < TYPEWRITER_WORD.length) setTimeout(type, 40);
          else setTimeout(() => setStageFinished(true), 300);
        };
        setTimeout(type, 100);
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(heroImage,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.4 },
        0
      );

      const validWords = wordRefs.current.filter(Boolean);
      if (validWords.length) {
        tl.fromTo(
          validWords,
          { y: 48, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.55, stagger: 0.1 },
          0.5
        );
      }

      if (redLineRef.current) {
        tl.fromTo(
          redLineRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.7, transformOrigin: 'top center' },
          1.4
        );
      }

      const validPrefix = prefixRefs.current.filter(Boolean);
      if (validPrefix.length) {
        tl.fromTo(
          validPrefix,
          { y: 40, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: 0.09 },
          1.5
        );
      }

      tl.call(() => {
        setCursorVisible(true);
        let i = 0;
        const type = () => {
          i++;
          setTypedChars(i);
          if (i < TYPEWRITER_WORD.length) {
            setTimeout(type, 110);
          } else {
            setTimeout(() => setStageFinished(true), 900);
          }
        };
        setTimeout(type, 160);
      }, [], 2.25);

      if (supportRef.current) {
        tl.fromTo(
          supportRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          3.1
        );
      }

      // Scroll-driven image parallax
      gsap.to(heroImage, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=80%',
          scrub: 0.6,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  /* ── Rendered word with per-span ref ─────────────────── */
  const renderWord = (
    word: string,
    idx: number,
    refs: React.MutableRefObject<(HTMLSpanElement | null)[]>,
    className: string
  ) => (
    <span
      key={idx}
      ref={(el) => { refs.current[idx] = el; }}
      className={`inline-block opacity-0 ${className}`}
    >
      {word}
    </span>
  );

  const displayedStage = TYPEWRITER_WORD.slice(0, typedChars);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-transparent overflow-hidden flex flex-col justify-between hero-section"
    >
      {/* HERO EDITORIAL GRADIENT SCRIMS FOR MAXIMUM TYPOGRAPHY READABILITY */}
      <div ref={heroImageRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4F0E8]/90 via-[#F4F0E8]/50 to-transparent w-full md:w-3/4 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F4F0E8]/80 to-transparent pointer-events-none" />
      </div>

      {/* TOP EDITORIAL TAGLINE (logo is in the fixed nav header) */}
      <div className="relative z-10 pt-20 sm:pt-28 md:pt-36 editorial-container">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-sans-clean tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C91F25] font-semibold block">
            The National Platform For Live Music
          </span>
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-sans-clean uppercase tracking-[0.3em] text-[#65625D]">
              Vol. 01 / Live Circuit
            </div>
            <div className="text-xs font-display tracking-[0.2em] text-[#171717] mt-1">
              HYDERABAD — ALL INDIA
            </div>
          </div>
        </div>
      </div>

      {/* CENTRAL EDITORIAL HEADLINE REGION */}
      <div className="relative z-10 editorial-container my-auto pb-6 sm:pb-12" style={{ perspective: '800px' }}>
        <div className="max-w-3xl space-y-3 sm:space-y-6">

          {/* LINE 1 — Word-by-word slide-up reveal */}
          <div className="overflow-hidden" aria-label="Every Band Has A Story.">
            <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-bold tracking-[-0.02em] text-[#171717] leading-[1.08] flex flex-wrap gap-x-[0.3em] gap-y-1">
              {LINE_ONE_WORDS.map((word, i) =>
                renderWord(word, i, wordRefs, '')
              )}
            </h2>
          </div>

          {/* LINE 2 — Prefix slides in, then STAGE. types out */}
          <div className="flex items-stretch gap-3 sm:gap-6">
            {/* Red accent bar */}
            <div
              ref={redLineRef}
              className="w-[3px] bg-[#C91F25] rounded-full opacity-0 self-stretch"
              style={{ minHeight: '40px', transformOrigin: 'top center' }}
            />

            <h3
              className="font-display text-xl sm:text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] flex flex-wrap items-baseline gap-x-[0.28em] gap-y-1"
              aria-label="Every Story Needs A Stage."
            >
              {/* Prefix words */}
              {LINE_TWO_PREFIX.map((word, i) =>
                renderWord(
                  word,
                  i,
                  prefixRefs,
                  'text-[#C91F25]'
                )
              )}

              {/* Typewritten STAGE. word — aria-live so screen readers announce it */}
              <span className="inline-flex items-baseline">
                <span
                  ref={stageRef}
                  aria-live="polite"
                  aria-atomic="true"
                  className="transition-colors duration-500 text-[#C91F25]"
                >
                  {displayedStage}
                </span>

                {/* Blinking cursor — visible while typing, fades out after done */}
                {cursorVisible && (
                  <span
                    ref={cursorRef}
                    className={`inline-block ml-[2px] w-[3px] rounded-sm align-baseline transition-opacity duration-500 ${
                      stageFinished ? 'opacity-0' : 'animate-[cursorBlink_0.7s_step-end_infinite]'
                    }`}
                    style={{
                      height: '0.85em',
                      background: '#C91F25',
                      verticalAlign: 'baseline',
                      marginBottom: '0.07em',
                    }}
                    aria-hidden="true"
                  />
                )}
              </span>
            </h3>
          </div>

          {/* STATE 4: MANIFESTO & CTA */}
          <div ref={supportRef} className="pt-2 sm:pt-4 space-y-4 sm:space-y-6 opacity-0">
            <p className="font-serif-sub italic text-base sm:text-2xl text-[#171717] max-w-xl leading-relaxed">
              RITHMOS — WHERE BANDS RISE
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <button
                onClick={onOpenRegister}
                className="group inline-flex items-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#C91F25] text-[#F4F0E8] text-[11px] sm:text-xs font-sans-clean uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold hover:bg-[#8F171C] transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>REGISTER YOUR BAND</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#story"
                className="text-[11px] sm:text-xs font-sans-clean uppercase tracking-[0.2em] text-[#65625D] hover:text-[#171717] transition-colors"
              >
                DISCOVER THE MOVEMENT ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM RED WAVEFORM */}
      <div className="relative z-10 w-full pb-2">
        <canvas ref={waveformRef} className="w-full pointer-events-none opacity-80" />
      </div>
    </section>
  );
};
