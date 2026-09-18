import { useEffect, useRef, useState, type FC, type MouseEvent, type TouchEvent } from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface StringData {
  note: string;
  name: string;
  freq: number;
  thickness: number;
  color: string;
  currentY: number;
  targetY: number;
  velocity: number;
  isPlucked: boolean;
  amplitude: number;
}

const STRINGS_CONFIG = [
  { note: 'E', name: '6th / Low E', freq: 82.41, thickness: 3.5, color: '#C9A45C' },
  { note: 'A', name: '5th / A', freq: 110.00, thickness: 3.0, color: '#C9A45C' },
  { note: 'D', name: '4th / D', freq: 146.83, thickness: 2.4, color: '#D8D3CA' },
  { note: 'G', name: '3rd / G', freq: 196.00, thickness: 1.8, color: '#D8D3CA' },
  { note: 'B', name: '2nd / B', freq: 246.94, thickness: 1.4, color: '#D8D3CA' },
  { note: 'e', name: '1st / High E', freq: 329.63, thickness: 1.0, color: '#C91F25' },
];

export const InteractiveStrings: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stringsRef = useRef<StringData[]>([]);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);

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

  const playPluckSound = (freq: number) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      gain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain2.gain.setValueAtTime(0.04, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(gain);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 6, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 1.2);

      osc1.connect(filter);
      filter.connect(gain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.0);
      osc2.stop(now + 2.0);
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const spacing = rect.height / (STRINGS_CONFIG.length + 1);
      stringsRef.current = STRINGS_CONFIG.map((cfg, i) => {
        const baseY = spacing * (i + 1);
        return {
          ...cfg,
          currentY: baseY,
          targetY: baseY,
          velocity: 0,
          isPlucked: false,
          amplitude: 0,
        };
      });
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const strings = stringsRef.current;
      strings.forEach((str) => {
        const k = 0.08;
        const damp = 0.92;
        const displacement = str.currentY - str.targetY;
        const force = -k * displacement;
        str.velocity = (str.velocity + force) * damp;
        str.currentY += str.velocity;
        str.amplitude = Math.abs(str.currentY - str.targetY);

        ctx.beginPath();
        ctx.moveTo(0, str.targetY);

        const midX = rect.width / 2;
        ctx.quadraticCurveTo(midX, str.currentY, rect.width, str.targetY);

        const isVibrating = str.amplitude > 0.5;
        ctx.lineWidth = str.thickness;
        ctx.strokeStyle = isVibrating ? '#C91F25' : str.color;

        if (isVibrating) {
          ctx.shadowColor = '#C91F25';
          ctx.shadowBlur = Math.min(str.amplitude * 1.5, 12);
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        ctx.stroke();

        ctx.fillStyle = isVibrating ? '#C91F25' : '#D8D3CA';
        ctx.beginPath();
        ctx.arc(10, str.targetY, 3, 0, Math.PI * 2);
        ctx.arc(rect.width - 10, str.targetY, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handlePointerMove = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (lastMousePosRef.current) {
      const prevY = lastMousePosRef.current.y;
      const currentY = y;

      stringsRef.current.forEach((str) => {
        const minCrossY = Math.min(prevY, currentY);
        const maxCrossY = Math.max(prevY, currentY);

        if (str.targetY >= minCrossY && str.targetY <= maxCrossY) {
          const direction = currentY > prevY ? 1 : -1;
          const speed = Math.min(Math.abs(currentY - prevY), 25);
          str.velocity = direction * (12 + speed);
          playPluckSound(str.freq);
          setActiveNote(`${str.note} (${str.name})`);
        }
      });
    }

    lastMousePosRef.current = { x, y };
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const strumChord = () => {
    stringsRef.current.forEach((str, idx) => {
      setTimeout(() => {
        str.velocity = 18;
        playPluckSound(str.freq);
        setActiveNote(`${str.note} (${str.name})`);
      }, idx * 60);
    });
  };

  return (
    <section className="relative w-full py-10 sm:py-14 bg-[#EDE8DE] border-y border-[#D8D3CA] overflow-hidden">
      <div className="editorial-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[#D8D3CA]/60">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C91F25] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#171717] font-bold">
              ACOUSTIC TONEBOARD // STRUM THE 6 GUITAR STRINGS
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {activeNote && (
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#C91F25] px-2.5 py-1 bg-white/70 border border-[#D8D3CA] rounded-sm animate-fadeIn">
                NOTE: {activeNote}
              </span>
            )}

            <button
              onClick={strumChord}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-[#171717] text-[#F4F0E8] text-[10px] sm:text-xs font-sans-clean uppercase tracking-[0.2em] font-semibold hover:bg-[#C91F25] transition-colors rounded-sm cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-[#C9A45C]" />
              <span>STRUM CHORD</span>
            </button>
          </div>
        </div>

        <div className="relative w-full h-40 sm:h-48 md:h-56 mt-4 bg-[#F4F0E8] border border-[#D8D3CA] shadow-inner rounded-sm overflow-hidden flex items-center justify-center cursor-crosshair">
          <div className="absolute inset-0 flex justify-between px-8 sm:px-16 md:px-24 pointer-events-none opacity-20">
            <div className="w-[1px] h-full bg-[#171717]" />
            <div className="w-[1px] h-full bg-[#171717]" />
            <div className="w-[1px] h-full bg-[#171717]" />
            <div className="w-[1px] h-full bg-[#171717]" />
            <div className="w-[1px] h-full bg-[#171717]" />
          </div>

          <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-30">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D8D3CA] border border-[#171717]/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#D8D3CA] border border-[#171717]/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#D8D3CA] border border-[#171717]/20" />
          </div>

          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseLeave={() => (lastMousePosRef.current = null)}
            onTouchEnd={() => (lastMousePosRef.current = null)}
            className="relative z-10 w-full h-full"
          />

          <div className="absolute bottom-2.5 left-3 sm:left-4 pointer-events-none flex items-center gap-1.5 text-[9px] sm:text-[10px] font-sans-clean uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#65625D]">
            <Volume2 className="w-3 h-3 text-[#C91F25]" />
            <span>Swipe cursor or finger across the strings to play real notes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
