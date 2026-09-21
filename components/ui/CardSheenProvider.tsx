"use client";

import { useEffect } from "react";

export default function CardSheenProvider() {
  useEffect(() => {
    let rafId: number | null = null;
    let activeCard: HTMLElement | null = null;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(".card-stage");
      activeCard = target || null;

      if (!rafId) {
        rafId = requestAnimationFrame(updateCardPosition);
      }
    };

    const updateCardPosition = () => {
      rafId = null;
      if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        activeCard.style.setProperty("--card-x", `${Math.round(x)}px`);
        activeCard.style.setProperty("--card-y", `${Math.round(y)}px`);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
