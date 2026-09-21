"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";

interface CameraFeed {
  id: string;
  name: string;
  shortName: string;
  folder: string;
  frameCount: number;
}

const CAMERA_FEEDS: CameraFeed[] = [
  {
    id: "cam-guitar",
    name: "ELECTRIC GUITAR",
    shortName: "CAM 01",
    folder: "frames",
    frameCount: 120,
  },
  {
    id: "cam-brass",
    name: "BRASS HORN",
    shortName: "CAM 02",
    folder: "frames_brass",
    frameCount: 60,
  },
  {
    id: "cam-energy",
    name: "SONIC ENERGY",
    shortName: "CAM 03",
    folder: "frames_energy",
    frameCount: 60,
  },
];

interface ScrollFrameCanvasProps {
  isFullPage?: boolean;
}

export default function ScrollFrameCanvas({
  isFullPage = true,
}: ScrollFrameCanvasProps) {
  const [activeCamIndex, setActiveCamIndex] = useState<number>(0);
  const [, startTransition] = useTransition();

  const activeCam = CAMERA_FEEDS[activeCamIndex];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // GPU Decoded ImageBitmap Cache: key = `${camId}_${frameIndex}`
  const bitmapsRef = useRef<Map<string, ImageBitmap>>(new Map());
  // Fallback HTMLImageElement cache: key = `${camId}_${frameIndex}`
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastRenderedKeyRef = useRef<string>("");
  const rafIdRef = useRef<number>(0);

  // Mouse & Scroll Parallax Physics
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const scrollVelocityRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  // Section atmosphere state
  const [sectionIndex, setSectionIndex] = useState<number>(0);

  // Helper to build frame image path
  const getFramePath = useCallback((cam: CameraFeed, index: number) => {
    return `/${cam.folder}/frame_${index.toString().padStart(4, "0")}.webp`;
  }, []);

  // Draw frame on canvas using hardware-accelerated ImageBitmap
  const renderFrame = useCallback((cam: CameraFeed, frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cacheKey = `${cam.id}_${frameIndex}`;

    // 1. Try to get GPU-decoded ImageBitmap
    let source: ImageBitmap | HTMLImageElement | undefined = bitmapsRef.current.get(cacheKey);

    // 2. Fallback to HTMLImageElement if bitmap not ready
    if (!source) {
      source = imagesRef.current.get(cacheKey);
    }

    // 3. If neither ready, find closest available frame for this camera
    if (!source || ("naturalWidth" in source && source.naturalWidth === 0)) {
      let minDiff = Infinity;
      let closestKey = "";
      for (let i = 0; i < cam.frameCount; i++) {
        const k = `${cam.id}_${i}`;
        if (bitmapsRef.current.has(k) || (imagesRef.current.get(k)?.complete && (imagesRef.current.get(k)?.naturalWidth || 0) > 0)) {
          const diff = Math.abs(i - frameIndex);
          if (diff < minDiff) {
            minDiff = diff;
            closestKey = k;
          }
        }
      }
      if (closestKey) {
        source = bitmapsRef.current.get(closestKey) || imagesRef.current.get(closestKey);
      }
    }

    if (!source) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const sW = source.width;
    const sH = source.height;

    const canvasAspect = cW / cH;
    const imgAspect = sW / sH;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasAspect > imgAspect) {
      drawW = cW;
      drawH = cW / imgAspect;
      drawX = 0;
      drawY = (cH - drawH) / 2;
    } else {
      drawH = cH;
      drawW = cH * imgAspect;
      drawX = (cW - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(source, drawX, drawY, drawW, drawH);
    lastRenderedKeyRef.current = cacheKey;
  }, []);

  // Update canvas sizing on resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      lastRenderedKeyRef.current = "";
      renderFrame(CAMERA_FEEDS[activeCamIndex], Math.round(currentFrameRef.current));
    }
  }, [activeCamIndex, renderFrame]);

  // Preload and GPU-decode frames with createImageBitmap
  useEffect(() => {
    let isCancelled = false;
    const currentCam = CAMERA_FEEDS[activeCamIndex];

    // 1. Immediately load & decode Frame 0
    const firstImg = new Image();
    firstImg.src = getFramePath(currentCam, 0);
    firstImg.onload = () => {
      imagesRef.current.set(`${currentCam.id}_0`, firstImg);
      if ("createImageBitmap" in window) {
        createImageBitmap(firstImg).then((bmp) => {
          if (!isCancelled) {
            bitmapsRef.current.set(`${currentCam.id}_0`, bmp);
            renderFrame(currentCam, 0);
          }
        });
      } else {
        renderFrame(currentCam, 0);
      }
    };

    // 2. Progressively preload and decode remaining frames off main thread
    const preloadSequence = async () => {
      // Step A: Load keyframe anchors every 10 frames
      for (let i = 10; i < currentCam.frameCount; i += 10) {
        if (isCancelled) return;
        const key = `${currentCam.id}_${i}`;
        if (!imagesRef.current.has(key)) {
          const img = new Image();
          img.src = getFramePath(currentCam, i);
          img.onload = () => {
            imagesRef.current.set(key, img);
            if ("createImageBitmap" in window) {
              createImageBitmap(img).then((bmp) => {
                if (!isCancelled) bitmapsRef.current.set(key, bmp);
              });
            }
          };
        }
      }

      // Step B: Load all remaining frames
      for (let i = 1; i < currentCam.frameCount; i++) {
        if (isCancelled) return;
        const key = `${currentCam.id}_${i}`;
        if (!imagesRef.current.has(key)) {
          const img = new Image();
          img.src = getFramePath(currentCam, i);
          img.onload = () => {
            imagesRef.current.set(key, img);
            if ("createImageBitmap" in window) {
              createImageBitmap(img).then((bmp) => {
                if (!isCancelled) bitmapsRef.current.set(key, bmp);
              });
            }
          };
        }
      }
    };

    const timeoutId = setTimeout(preloadSequence, 30);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeCamIndex, getFramePath, renderFrame]);

  // Mouse move listener for 3D stage parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Decoupled Main Scroll Sync & RAF Animation Loop (0% CPU when stationary)
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const loop = () => {
      const scrollY = window.scrollY;
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      // Track scroll velocity
      const vel = scrollY - lastScrollYRef.current;
      scrollVelocityRef.current += (vel - scrollVelocityRef.current) * 0.2;
      lastScrollYRef.current = scrollY;

      // Calculate progress across entire page [0..1]
      let progress = 0;
      if (totalScroll > 0) {
        progress = Math.min(1, Math.max(0, scrollY / totalScroll));
        targetFrameRef.current = progress * (activeCam.frameCount - 1);
      }

      // Section-aware atmosphere & Depth of Field trigger
      const sec = progress < 0.15 ? 0 : progress < 0.35 ? 1 : progress < 0.6 ? 2 : progress < 0.85 ? 3 : 4;
      setSectionIndex((prev) => (prev !== sec ? sec : prev));

      // Smooth frame interpolation (lerp)
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * 0.14;
      } else {
        currentFrameRef.current = target;
      }

      // Smooth mouse parallax interpolation
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      // Apply subtle 3D tilt & camera push to container
      if (containerRef.current) {
        const transX = m.x * -14;
        const transY = m.y * -10;
        const scale = 1.02 + progress * 0.05;
        containerRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${scale})`;
      }

      // Decoupled Render: ONLY redraw canvas if frame index or camera changed!
      const frameToDraw = Math.round(currentFrameRef.current);
      const targetKey = `${activeCam.id}_${frameToDraw}`;
      if (targetKey !== lastRenderedKeyRef.current) {
        renderFrame(activeCam, frameToDraw);
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeCam, renderFrame, resizeCanvas]);

  // Section-based atmospheric lighting color schemes
  const getAtmosphereGlow = () => {
    switch (sectionIndex) {
      case 0: // Hero: Crimson & Amber Stage Lights
        return {
          leftBeam: "linear-gradient(158deg, rgba(230, 20, 56, 0.18) 0%, transparent 58%)",
          rightBeam: "linear-gradient(-152deg, rgba(212, 155, 20, 0.14) 0%, transparent 58%)",
          ambientGlow: "radial-gradient(circle at 50% 28%, rgba(230, 20, 56, 0.1) 0%, transparent 68%)",
          overlayDarkness: 0.35,
          isBlurred: false,
        };
      case 1: // Stats & Manifesto
        return {
          leftBeam: "linear-gradient(155deg, rgba(230, 20, 56, 0.22) 0%, transparent 62%)",
          rightBeam: "linear-gradient(-155deg, rgba(255, 255, 255, 0.04) 0%, transparent 62%)",
          ambientGlow: "radial-gradient(circle at 28% 62%, rgba(230, 20, 56, 0.1) 0%, transparent 58%)",
          overlayDarkness: 0.88,
          isBlurred: true,
        };
      case 2: // 4 Stages / Journey
        return {
          leftBeam: "linear-gradient(148deg, rgba(212, 155, 20, 0.18) 0%, transparent 62%)",
          rightBeam: "linear-gradient(-148deg, rgba(230, 20, 56, 0.14) 0%, transparent 62%)",
          ambientGlow: "radial-gradient(circle at 72% 42%, rgba(212, 155, 20, 0.12) 0%, transparent 62%)",
          overlayDarkness: 0.88,
          isBlurred: false,
        };
      case 3: // Band Showcase & Venues
        return {
          leftBeam: "linear-gradient(152deg, rgba(20, 130, 230, 0.15) 0%, transparent 62%)",
          rightBeam: "linear-gradient(-152deg, rgba(230, 20, 56, 0.16) 0%, transparent 62%)",
          ambientGlow: "radial-gradient(circle at 50% 52%, rgba(20, 130, 230, 0.08) 0%, transparent 68%)",
          overlayDarkness: 0.92,
          isBlurred: true,
        };
      case 4: // Grand Finale CTA
      default:
        return {
          leftBeam: "linear-gradient(150deg, rgba(230, 20, 56, 0.22) 0%, transparent 68%)",
          rightBeam: "linear-gradient(-150deg, rgba(212, 155, 20, 0.2) 0%, transparent 68%)",
          ambientGlow: "radial-gradient(circle at 50% 52%, rgba(230, 20, 56, 0.14) 0%, transparent 72%)",
          overlayDarkness: 0.85,
          isBlurred: false,
        };
    }
  };

  const atmosphere = getAtmosphereGlow();

  return (
    <div
      style={{
        position: isFullPage ? "fixed" : "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        contain: "paint",
      }}
    >
      {/* ─── 3D PARALLAX & DOLLY SCALE CONTAINER ─── */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: "-4%",
          width: "108%",
          height: "108%",
          transition: "transform 0.12s cubic-bezier(0.2, 0.8, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* CANVAS LAYER: Hardware-Accelerated 120 FPS Frame Scrubbing */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: atmosphere.isBlurred
              ? "brightness(0.62) contrast(1.18) saturate(1.05) blur(5px)"
              : "brightness(0.78) contrast(1.14) saturate(1.08) blur(0px)",
            transition: "filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "filter",
          }}
        />
      </div>

      {/* ─── HARDWARE-ACCELERATED CSS STAGE EMBERS (0% Canvas 2D CPU Cost) ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="stage-ember"
            style={{
              position: "absolute",
              left: `${(i * 19 + 3) % 94}%`,
              bottom: "-8px",
              width: `${1.5 + (i % 3) * 0.8}px`,
              height: `${1.5 + (i % 3) * 0.8}px`,
              borderRadius: "50%",
              background: i % 3 === 0 ? "rgba(255, 55, 80, 0.8)" : i % 3 === 1 ? "rgba(245, 165, 35, 0.75)" : "rgba(255, 200, 80, 0.65)",
              boxShadow: i % 3 === 0 ? "0 0 6px #FF3750" : i % 3 === 1 ? "0 0 6px #F5A523" : "0 0 5px #FFC850",
              animation: `float-ember ${6 + (i % 6)}s ease-in infinite`,
              animationDelay: `${(i * 0.55) % 7}s`,
            }}
          />
        ))}
      </div>

      {/* ─── SECTION-AWARE AMBIENT STAGE GLOW ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: atmosphere.ambientGlow,
          transition: "background 1.2s ease",
          pointerEvents: "none",
        }}
      />

      {/* ─── GRADIENT OVERLAY: Crystal clear text readability ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            sectionIndex === 0
              ? `linear-gradient(
                  180deg,
                  rgba(5, 6, 8, 0.45) 0%,
                  rgba(5, 6, 8, 0.15) 25%,
                  rgba(5, 6, 8, 0.12) 55%,
                  rgba(5, 6, 8, 0.42) 82%,
                  rgba(5, 6, 8, 0.88) 100%
                )`
              : `rgba(5, 6, 8, ${atmosphere.overlayDarkness})`,
          transition: "background 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      />

      {/* ─── DYNAMIC VOLUMETRIC SPOTLIGHT BEAMS ─── */}
      <div
        style={{
          position: "absolute",
          top: "-25%",
          left: "5%",
          width: "45vw",
          height: "140vh",
          background: atmosphere.leftBeam,
          filter: "blur(70px)",
          opacity: 0.85,
          transition: "background 1.2s ease, opacity 1s ease",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-25%",
          right: "5%",
          width: "45vw",
          height: "140vh",
          background: atmosphere.rightBeam,
          filter: "blur(70px)",
          opacity: 0.85,
          transition: "background 1.2s ease, opacity 1s ease",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* ─── INTERACTIVE CURSOR STAGE SPOTLIGHT ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background: `radial-gradient(circle 550px at ${((mouseRef.current.x + 1) / 2) * 100}% ${((mouseRef.current.y + 1) / 2) * 100}%, rgba(255, 60, 85, 0.14) 0%, rgba(245, 170, 40, 0.06) 45%, transparent 75%)`,
          pointerEvents: "none",
          transition: "background 0.08s linear",
        }}
      />

      {/* ─── SUBTLE ANALOG VIGNETTE & HALATION ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(4, 5, 8, 0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ─── 35MM CONCERT FILM GRAIN ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 7,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
          opacity: 0.1,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* ─── BOTTOM GRADIENT FADE ─── */}
      {sectionIndex > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "25vh",
            background: "linear-gradient(to bottom, transparent, rgba(7, 8, 10, 0.98))",
            zIndex: 8,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ─── DIRECTOR'S MULTI-CAMERA SWITCHER HUD ─── */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 50,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(12, 14, 20, 0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "100px",
          padding: "0.35rem 0.65rem",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "var(--red)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            paddingLeft: "0.4rem",
            paddingRight: "0.2rem",
          }}
        >
          <span className="live-indicator" /> FEED:
        </span>

        {CAMERA_FEEDS.map((cam, idx) => {
          const isActive = idx === activeCamIndex;
          return (
            <button
              key={cam.id}
              onClick={() => {
                startTransition(() => {
                  setActiveCamIndex(idx);
                });
              }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "0.3rem 0.65rem",
                borderRadius: "100px",
                border: isActive ? "1px solid var(--red)" : "1px solid transparent",
                background: isActive ? "rgba(230, 20, 56, 0.25)" : "transparent",
                color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title={cam.name}
            >
              {cam.shortName}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes float-ember {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate3d(-15px, -110vh, 0) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
