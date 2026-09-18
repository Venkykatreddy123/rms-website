import { useRef, useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Sparkles, Mic, Disc3, Zap, Music, Volume2, ArrowRight, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

interface Hotspot {
  id: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  title: string;
  detail: string;
}

interface InstrumentStage {
  id: string;
  tabLabel: string;
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  alt: string;
  soundType: 'mic' | 'drums' | 'guitar' | 'brass';
  icon: typeof Mic;
  specs: { label: string; value: string }[];
  accentColor: string;
  align: 'left' | 'right';
  hotspots: Hotspot[];
}

const instruments: InstrumentStage[] = [
  {
    id: '01',
    tabLabel: '01 / MIC',
    step: 'PHASE 01 // SOUNDCHECK',
    title: 'THE LEAD CONDENSER',
    subtitle: 'HYPERCARDIOID VOCAL RIG',
    desc: 'Engineered for extreme acoustic pressure and raw vocal grit. Isolates the frontman in deafening arena volumes with zero bleed and razor-sharp high-frequency detail.',
    image: '/assets/images/instrument_mic.jpg',
    alt: 'Studio Vocal Microphone Rig',
    soundType: 'mic',
    icon: Mic,
    specs: [
      { label: 'TRANSDUCER', value: 'Gold Vapor Capsule' },
      { label: 'PATTERN', value: 'Precision Hypercardioid' },
      { label: 'OUTPUT TRIM', value: 'Crimson LED High-Gain' },
    ],
    accentColor: '#C91F25',
    align: 'left',
    hotspots: [
      { id: 'h1', x: 62, y: 16, title: 'CAPSULE', detail: 'Gold-vapor sputtered hypercardioid diaphragm' },
      { id: 'h2', x: 49, y: 44, title: 'SHOCKMOUNT', detail: 'Internal pneumatic vibration absorption ring' },
      { id: 'h3', x: 50, y: 88, title: 'BASE RIG', detail: 'Cast-iron weighted stage dampening pedestal' },
    ],
  },
  {
    id: '02',
    tabLabel: '02 / DRUMS',
    step: 'PHASE 02 // THE PULSE',
    title: 'THE THUNDER ENGINE',
    subtitle: 'CUSTOM RESONANCE SHELL KIT',
    desc: 'Reinforced birch and acoustic steel rims tuned to shake the foundations. Features the signature Rithmos red-line waveform resonant head for punishing low-end impact.',
    image: '/assets/images/instrument_drums.jpg',
    alt: 'Pro Stage Drum Kit',
    soundType: 'drums',
    icon: Disc3,
    specs: [
      { label: 'SHELL BUILD', value: '7-Ply Scandinavian Birch' },
      { label: 'KICK CONFIG', value: '24" Bass Sub-Trigger' },
      { label: 'CYMBALS', value: 'Crimson Alloy Brass' },
    ],
    accentColor: '#C91F25',
    align: 'right',
    hotspots: [
      { id: 'h1', x: 26, y: 22, title: 'CRASH CYMBAL', detail: '18" Hand-hammered dark crimson alloy' },
      { id: 'h2', x: 50, y: 68, title: 'BASS DRUM', detail: '24" Birch kick with waveform resonator head' },
      { id: 'h3', x: 74, y: 56, title: 'SNARE RIG', detail: '14" Acoustic steel rim with high-tension coils' },
    ],
  },
  {
    id: '03',
    tabLabel: '03 / GUITAR',
    step: 'PHASE 03 // THE DISTORTION',
    title: 'THE CRIMSON AXE',
    subtitle: 'HIGH-OUTPUT LEAD WEAPON',
    desc: 'Double-cut carved top with active high-output humbuckers. Built for blistering harmonic squeals, razor riffs, and sustain that cuts straight through the mix.',
    image: '/assets/images/instrument_guitar.jpg',
    alt: 'Electric Rock Guitar',
    soundType: 'guitar',
    icon: Zap,
    specs: [
      { label: 'PICKUPS', value: 'Dual High-Gain Humbuckers' },
      { label: 'BRIDGE', value: 'Double-Locking Tremolo' },
      { label: 'FRETBOARD', value: '24 Jumbo Blade Inlays' },
    ],
    accentColor: '#C91F25',
    align: 'left',
    hotspots: [
      { id: 'h1', x: 80, y: 14, title: 'HEADSTOCK', detail: 'Reverse headstock with Gotoh locking tuners' },
      { id: 'h2', x: 52, y: 55, title: 'HUMBUCKERS', detail: 'Dual active ceramic high-output pickups' },
      { id: 'h3', x: 44, y: 73, title: 'TREMOLO', detail: 'Double-locking floating tremolo for divebombs' },
    ],
  },
  {
    id: '04',
    tabLabel: '04 / BRASS',
    step: 'PHASE 04 // THE CLIMAX',
    title: 'THE BRASS MAJESTY',
    subtitle: 'ORCHESTRAL SYMPHONIC BELL',
    desc: 'High-register horn lacquered in deep scarlet and polished chrome. Delivers soaring brass fanfares, heroic melodic lines, and symphonic grandeur to the finale.',
    image: '/assets/images/instrument_brass.jpg',
    alt: 'Orchestral French Horn',
    soundType: 'brass',
    icon: Music,
    specs: [
      { label: 'BELL DESIGN', value: 'Hand-Hammered Flare' },
      { label: 'VALVES', value: 'Quad High-Speed Rotary' },
      { label: 'FINISH', value: 'Chrome & Ruby Lacquer' },
    ],
    accentColor: '#C9A45C',
    align: 'right',
    hotspots: [
      { id: 'h1', x: 26, y: 26, title: 'BELL FLARE', detail: 'Wide hand-hammered scarlet acoustic flare' },
      { id: 'h2', x: 67, y: 64, title: 'ROTARY VALVES', detail: 'Quad mechanical high-speed linkage' },
      { id: 'h3', x: 91, y: 24, title: 'LEADPIPE', detail: 'Silver-plated high-register mouthpiece taper' },
    ],
  },
];

export const StageExperience: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const finaleRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFinaleActive, setIsFinaleActive] = useState(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Web Audio Context Getter
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize realistic audio previews for each instrument
  const playSoundSample = (soundType: 'mic' | 'drums' | 'guitar' | 'brass') => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      setPlayingSound(soundType);

      if (soundType === 'mic') {
        // Vocal Soundcheck Formant Sweep
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.001, now);
        master.gain.linearRampToValueAtTime(0.16, now + 0.08);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
        master.connect(ctx.destination);

        [340, 750, 2400].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq, now);
          filter.Q.setValueAtTime(4.5, now);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220 * (1 + i * 0.4), now);
          osc.connect(filter);
          filter.connect(master);
          osc.start(now);
          osc.stop(now + 1.4);
        });
      } else if (soundType === 'drums') {
        // Heavy Kick + Snare Drum Hit
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(150, now);
        kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.28);
        kickGain.gain.setValueAtTime(0.35, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.4);

        // Snare burst at +180ms
        setTimeout(() => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const t = audioCtxRef.current.currentTime;
          const bufferSize = audioCtxRef.current.sampleRate * 0.25;
          const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = audioCtxRef.current.createBufferSource();
          noise.buffer = buffer;
          const noiseFilter = audioCtxRef.current.createBiquadFilter();
          noiseFilter.type = 'highpass';
          noiseFilter.frequency.setValueAtTime(1100, t);
          const noiseGain = audioCtxRef.current.createGain();
          noiseGain.gain.setValueAtTime(0.2, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(audioCtxRef.current.destination);
          noise.start(t);
        }, 180);
      } else if (soundType === 'guitar') {
        // High-Gain Electric Guitar Power Chord
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        const shaper = ctx.createWaveShaper();
        const n = 4096;
        const curve = new Float32Array(n);
        const deg = Math.PI / 180;
        const k = 60;
        for (let i = 0; i < n; ++i) {
          const x = (i * 2) / n - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        shaper.curve = curve;
        shaper.oversample = '4x';

        const cab = ctx.createBiquadFilter();
        cab.type = 'lowpass';
        cab.frequency.setValueAtTime(3400, now);

        [82.4, 123.5, 164.8, 246.9].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(shaper);
          osc.start(now);
          osc.stop(now + 2.0);
        });

        shaper.connect(cab);
        cab.connect(masterGain);
        masterGain.connect(ctx.destination);
      } else if (soundType === 'brass') {
        // Symphonic Brass Horn Swell
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.16, now + 0.2);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1300, now);
        filter.Q.setValueAtTime(2.8, now);

        [174.6, 261.6, 349.2, 523.3].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(filter);
          osc.start(now);
          osc.stop(now + 1.8);
        });

        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
      }

      setTimeout(() => {
        setPlayingSound(null);
      }, 2000);
    } catch {
      setPlayingSound(null);
    }
  };

  // Mouse tilt tracking
  const handleMouseMoveImage = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (x / rect.width) * 14,
      y: -(y / rect.height) * 14,
    });
  };

  const handleMouseLeaveImage = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let confettiTriggered = false;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=600%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);

            if (self.progress >= 0.8) {
              setActiveTab(4);
              setIsFinaleActive(true);

              if (self.progress >= 0.83 && !confettiTriggered) {
                confettiTriggered = true;
                confetti({
                  particleCount: 45,
                  spread: 65,
                  origin: { y: 0.65 },
                  colors: ['#C91F25', '#C9A45C', '#171717'],
                });
              }
            } else {
              setIsFinaleActive(false);
              const idx = Math.min(3, Math.floor((self.progress / 0.8) * 4));
              setActiveTab(idx);
              if (self.progress < 0.75) {
                confettiTriggered = false;
              }
            }
          },
        },
      });

      // Initialize slide states
      slidesRef.current.forEach((slide, idx) => {
        if (!slide) return;
        const info = slide.querySelector('.instrument-info');
        const img = slide.querySelector('.instrument-image');

        if (idx === 0) {
          gsap.set(slide, { autoAlpha: 1, xPercent: 0 });
          gsap.set(img, { autoAlpha: 1, scale: 1 });
          gsap.set(info, {
            autoAlpha: 0,
            xPercent: isMobile ? 0 : 80,
            yPercent: isMobile ? 35 : 0,
          });
        } else {
          const enterX = idx % 2 === 1 ? 100 : -100;
          gsap.set(slide, { autoAlpha: 0, xPercent: enterX });
          gsap.set(img, { autoAlpha: 1, scale: 1 });
          const infoEnterX = instruments[idx].align === 'left' ? 80 : -80;
          gsap.set(info, {
            autoAlpha: 0,
            xPercent: isMobile ? 0 : infoEnterX,
            yPercent: isMobile ? 35 : 0,
          });
        }
      });

      if (finaleRef.current) {
        gsap.set(finaleRef.current, { autoAlpha: 0, scale: 0.95, yPercent: 20 });
      }

      // SLIDE 0: (Mic)
      const info0 = slidesRef.current[0]?.querySelector('.instrument-info');
      if (info0) {
        tl.to(
          info0,
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 1.2,
            ease: 'power2.out',
          },
          0.3
        );
      }

      // Slide 0 exits left -> Slide 1 (Drums) enters right
      if (slidesRef.current[0] && slidesRef.current[1]) {
        tl.to(
          slidesRef.current[0],
          { xPercent: -100, autoAlpha: 0, duration: 1, ease: 'power2.inOut' },
          2.0
        );
        tl.to(
          slidesRef.current[1],
          { xPercent: 0, autoAlpha: 1, duration: 1, ease: 'power2.inOut' },
          2.0
        );
      }

      // SLIDE 1: (Drums) Info reveals from left
      const info1 = slidesRef.current[1]?.querySelector('.instrument-info');
      if (info1) {
        tl.to(
          info1,
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 1.2,
            ease: 'power2.out',
          },
          3.2
        );
      }

      // Slide 1 exits right -> Slide 2 (Guitar) enters left
      if (slidesRef.current[1] && slidesRef.current[2]) {
        tl.to(
          slidesRef.current[1],
          { xPercent: 100, autoAlpha: 0, duration: 1, ease: 'power2.inOut' },
          4.8
        );
        tl.to(
          slidesRef.current[2],
          { xPercent: 0, autoAlpha: 1, duration: 1, ease: 'power2.inOut' },
          4.8
        );
      }

      // SLIDE 2: (Guitar) Info reveals from right
      const info2 = slidesRef.current[2]?.querySelector('.instrument-info');
      if (info2) {
        tl.to(
          info2,
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 1.2,
            ease: 'power2.out',
          },
          6.0
        );
      }

      // Slide 2 exits left -> Slide 3 (Brass) enters right
      if (slidesRef.current[2] && slidesRef.current[3]) {
        tl.to(
          slidesRef.current[2],
          { xPercent: -100, autoAlpha: 0, duration: 1, ease: 'power2.inOut' },
          7.6
        );
        tl.to(
          slidesRef.current[3],
          { xPercent: 0, autoAlpha: 1, duration: 1, ease: 'power2.inOut' },
          7.6
        );
      }

      // SLIDE 3: (Brass) Info reveals from left
      const info3 = slidesRef.current[3]?.querySelector('.instrument-info');
      if (info3) {
        tl.to(
          info3,
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 1.2,
            ease: 'power2.out',
          },
          8.8
        );
      }

      // Slide 3 exits up -> FINALE CLIMAX
      if (slidesRef.current[3]) {
        tl.to(
          slidesRef.current[3],
          { yPercent: -40, autoAlpha: 0, duration: 1, ease: 'power2.inOut' },
          10.4
        );
      }

      if (finaleRef.current) {
        tl.to(
          finaleRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            yPercent: 0,
            duration: 1.2,
            ease: 'power3.out',
          },
          10.4
        );
      }

      tl.to({}, { duration: 1.2 });
    }, container);

    return () => ctx.revert();
  }, []);

  const scrollToBands = () => navigate('/bands');

  return (
    <section
      id="stage"
      ref={containerRef}
      className="relative w-full h-screen bg-[#F4F0E8] overflow-hidden flex flex-col justify-between border-t border-[#D8D3CA]"
    >
      {/* TOP EDITORIAL HEADER & INSTRUMENT TABS */}
      <div className="relative z-30 pt-16 sm:pt-20 md:pt-24 editorial-container pointer-events-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#D8D3CA] pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFinaleActive ? 'bg-[#C91F25] animate-ping' : 'bg-[#C91F25] animate-pulse'
                }`}
              />
              <span className="text-[10px] sm:text-[11px] font-sans-clean tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C91F25] font-semibold">
                {isFinaleActive ? '02 / LIVE BROADCAST ENGAGED' : '02 / The Interactive Rig'}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#171717]">
              {isFinaleActive ? 'THE STAGE IS LIVE.' : 'THE STAGE IS SET.'}
            </h2>
          </div>

          {/* INSTRUMENT TABS */}
          <div className="mt-3 md:mt-0 flex items-center gap-1.5 sm:gap-3 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {instruments.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === idx;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#171717] text-[#F4F0E8] shadow-md scale-105'
                      : 'bg-white/80 text-[#65625D] border border-[#D8D3CA]/60'
                  }`}
                >
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-[#C91F25]' : 'text-[#65625D]'}`} />
                  <span>{item.tabLabel}</span>
                </div>
              );
            })}

            {/* FINALE TAB */}
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 whitespace-nowrap ${
                isFinaleActive
                  ? 'bg-[#C91F25] text-[#F4F0E8] shadow-lg scale-105'
                  : 'bg-white/60 text-[#65625D] border border-[#D8D3CA]/40 opacity-70'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#C9A45C]" />
              <span>FINALE</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTRAL STAGE DISPLAY: THE 4 SLIDES */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {instruments.map((item, index) => {
          const isLeftAligned = item.align === 'left';
          const isAudioActive = playingSound === item.soundType;

          return (
            <div
              key={item.id}
              ref={(el) => {
                slidesRef.current[index] = el;
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center px-4 sm:px-10 md:px-16"
            >
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center">
                {/* 1. SEAMLESS INSTRUMENT SHOWCASE (Zero white boxes, 3D tilt, hotspot pins, stage light) */}
                <div
                  onMouseMove={handleMouseMoveImage}
                  onMouseLeave={handleMouseLeaveImage}
                  className={`instrument-image relative flex items-center justify-center order-1 py-4 cursor-pointer select-none ${
                    isLeftAligned ? 'md:col-span-6 md:order-1' : 'md:col-span-6 md:order-2'
                  }`}
                  style={{
                    perspective: '1000px',
                  }}
                >
                  {/* Overhead Studio Spotlight Cone */}
                  <div
                    className="absolute -top-12 w-64 sm:w-80 md:w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
                    style={{
                      background: `radial-gradient(circle, ${item.accentColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Stage Turntable / Pedestal Reflection Floor */}
                  <div className="absolute w-52 sm:w-72 md:w-96 h-10 sm:h-12 -bottom-2 rounded-[100%] bg-black/15 blur-lg pointer-events-none" />
                  <div className="absolute w-40 sm:w-56 md:w-72 h-4 -bottom-1 rounded-[100%] bg-black/25 blur-sm pointer-events-none" />

                  {/* 3D Tilting Image Wrapper with Seamless Multiply Blending (NO drop-shadow box) */}
                  <div
                    className="relative z-10 transition-transform duration-200 ease-out flex items-center justify-center"
                    style={{
                      transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    }}
                  >
                    {/* The Instrument Image cleanly blended onto background */}
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-auto h-auto max-h-[26vh] sm:max-h-[36vh] md:max-h-[58vh] max-w-full object-contain filter contrast-[1.04] mix-blend-multiply pointer-events-none"
                    />

                    {/* INTERACTIVE HOTSPOT PINS */}
                    {item.hotspots.map((pin) => {
                      const isPinActive = activeHotspot === pin.id;
                      return (
                        <div
                          key={pin.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(isPinActive ? null : pin.id);
                          }}
                          onMouseEnter={() => setActiveHotspot(pin.id)}
                          onMouseLeave={() => setActiveHotspot(null)}
                          className="absolute z-20 group"
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        >
                          {/* Pulsing Beacon Dot */}
                          <div className="relative flex items-center justify-center w-5 h-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-[#C91F25] opacity-60 animate-ping" />
                            <span className="relative inline-flex w-3 h-3 rounded-full bg-[#C91F25] border-2 border-white shadow-md transition-transform group-hover:scale-125" />
                          </div>

                          {/* Frosted Detail Tooltip */}
                          {isPinActive && (
                            <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 w-48 sm:w-56 bg-[#171717]/95 backdrop-blur-md text-[#F4F0E8] p-3 rounded-sm border border-white/20 shadow-2xl pointer-events-none animate-fadeIn">
                              <span className="text-[9px] font-sans-clean font-bold tracking-[0.2em] text-[#C91F25] uppercase block mb-0.5">
                                {pin.title}
                              </span>
                              <p className="text-[11px] font-sans-clean leading-snug text-[#EDE8DE]">
                                {pin.detail}
                              </p>
                              {/* Pointer Arrow */}
                              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#171717] rotate-45 border-r border-b border-white/20" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. EDITORIAL INFORMATION CARD */}
                <div
                  className={`instrument-info order-2 ${
                    isLeftAligned ? 'md:col-span-6 md:order-2' : 'md:col-span-6 md:order-1'
                  }`}
                >
                  <div className="bg-[#F4F0E8]/95 backdrop-blur-md p-4 sm:p-6 md:p-8 border border-[#D8D3CA] shadow-xl rounded-sm text-[#171717]">
                    {/* Header bar with Phase & Sound Test Button */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C91F25] font-bold">
                        {item.step}
                      </span>

                      {/* TACTILE SOUND TEST BUTTON */}
                      <button
                        onClick={() => playSoundSample(item.soundType)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.15em] font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                          isAudioActive
                            ? 'bg-[#C91F25] text-[#F4F0E8] scale-105 shadow-md'
                            : 'bg-white/80 text-[#171717] border border-[#D8D3CA] hover:border-[#C91F25] hover:text-[#C91F25]'
                        }`}
                      >
                        {isAudioActive ? (
                          <>
                            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                            <span>PLAYING SAMPLE...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current text-[#C91F25]" />
                            <span>TEST RIG SOUND</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717] mb-0.5">
                      {item.title}
                    </h3>
                    <span className="block font-sans-clean text-[11px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-[#C9A45C] uppercase mb-3 sm:mb-4">
                      {item.subtitle}
                    </span>

                    {/* Description */}
                    <p className="font-sans-clean text-xs sm:text-sm text-[#65625D] leading-relaxed mb-4 sm:mb-6">
                      {item.desc}
                    </p>

                    {/* UN-TRUNCATED TECH SPECS (Clean, fully visible labels & values) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-3 sm:pt-4 border-t border-[#D8D3CA]/60">
                      {item.specs.map((spec, i) => (
                        <div
                          key={i}
                          className="bg-white/70 p-2.5 sm:p-3 border border-[#D8D3CA]/50 rounded-sm"
                        >
                          <span className="text-[9px] font-sans-clean uppercase tracking-wider text-[#65625D] font-bold block mb-1">
                            {spec.label}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-[#171717] block leading-snug">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Readiness Bar */}
                    <div className="mt-4 sm:mt-5 pt-2.5 border-t border-[#D8D3CA]/40 flex items-center justify-between text-[9px] sm:text-[10px] font-sans-clean uppercase tracking-widest text-[#65625D]">
                      <span>STAGE RIG READINESS</span>
                      <span className="font-bold text-[#C91F25]">
                        {((index + 1) / instruments.length) * 100}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[#D8D3CA] mt-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C91F25] transition-all duration-300"
                        style={{ width: `${((index + 1) / instruments.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* --- OPTION B: THE STAGE CLIMAX FINALE --- */}
        <div
          ref={finaleRef}
          className="absolute inset-0 w-full h-full flex items-center justify-center px-4 sm:px-8 md:px-16 pointer-events-auto"
        >
          <div className="w-full max-w-6xl mx-auto bg-[#F4F0E8]/98 backdrop-blur-md border border-[#D8D3CA] p-5 sm:p-8 md:p-10 shadow-2xl rounded-sm relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C91F25]/15 blur-3xl animate-pulse pointer-events-none" />
            <div
              className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#C9A45C]/15 blur-3xl animate-pulse pointer-events-none"
              style={{ animationDelay: '1s' }}
            />

            {/* TOP BROADCAST STATUS BAR */}
            <div className="flex items-center justify-between border-b border-[#D8D3CA] pb-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C91F25] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C91F25]" />
                </span>
                <span className="text-[10px] sm:text-xs font-sans-clean font-bold uppercase tracking-[0.25em] text-[#C91F25]">
                  LIVE BROADCAST // ALL 4 RIGS LOCKED & SYNCHRONIZED
                </span>
              </div>

              {/* Animated Realtime Audio Equalizer Waves */}
              <div className="flex items-end gap-1 h-5 px-2 py-1 bg-[#EDE8DE] border border-[#D8D3CA] rounded-sm">
                <span className="w-1 bg-[#C91F25] rounded-full animate-[bounce_0.6s_infinite_0.1s] h-4" />
                <span className="w-1 bg-[#C91F25] rounded-full animate-[bounce_0.8s_infinite_0.3s] h-3" />
                <span className="w-1 bg-[#C91F25] rounded-full animate-[bounce_0.5s_infinite_0.2s] h-5" />
                <span className="w-1 bg-[#C91F25] rounded-full animate-[bounce_0.7s_infinite_0.4s] h-3.5" />
                <span className="w-1 bg-[#C91F25] rounded-full animate-[bounce_0.6s_infinite_0.15s] h-4" />
              </div>
            </div>

            {/* 4 INSTRUMENTS ASSEMBLED TOGETHER */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 my-2 sm:my-4 items-center">
              {instruments.map((inst) => (
                <div
                  key={inst.id}
                  className="relative group flex flex-col items-center bg-[#EDE8DE]/70 border border-[#D8D3CA] p-2 sm:p-4 rounded-sm hover:border-[#C91F25] transition-colors"
                >
                  <img
                    src={inst.image}
                    alt={inst.title}
                    className="h-20 sm:h-28 md:h-40 w-auto object-contain mix-blend-multiply filter contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="mt-2 text-center w-full">
                    <span className="text-[8px] sm:text-[9px] font-sans-clean uppercase tracking-wider text-[#C91F25] font-bold block truncate">
                      {inst.tabLabel}
                    </span>
                    <span className="text-[9px] sm:text-xs font-semibold text-[#171717] block truncate">
                      {inst.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* FINALE MESSAGE & ACTION CTA */}
            <div className="mt-4 sm:mt-6 pt-4 border-t border-[#D8D3CA] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-[#171717] text-center sm:text-left">
                  THE SILENCE IS BROKEN. THE STAGE IS YOURS.
                </h3>
                <p className="font-sans-clean text-xs text-[#65625D] text-center sm:text-left mt-0.5">
                  Microphones hot. Amps humming. The national competition is in session.
                </p>
              </div>

              <button
                onClick={scrollToBands}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.25em] font-semibold hover:bg-[#8F171C] transition-all duration-300 shadow-md whitespace-nowrap cursor-pointer"
              >
                <span>ENTER THE ARTISTS GALLERY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER / SCROLL PROMPT */}
      <div className="relative z-30 editorial-container pb-6 sm:pb-8 pointer-events-none">
        <div className="flex justify-between items-center text-[#65625D] border-t border-[#D8D3CA]/60 pt-3 sm:pt-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#D8D3CA] flex items-center justify-center bg-white/60">
              <ArrowDown className="w-3 h-3 text-[#C91F25] animate-bounce" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium">
              {scrollProgress > 0.8
                ? 'STAGE FULLY ARMED // PROCEED TO ARTISTS'
                : 'SCROLL TO ASSEMBLE NEXT INSTRUMENT RIG'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#65625D] mr-2 hidden sm:inline">
              RIG PROGRESS
            </span>
            <span className="font-display text-sm sm:text-lg text-[#C91F25] font-bold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};



