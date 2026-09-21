"use client";

import ScrollFrameCanvas from "./ScrollFrameCanvas";

interface HeroCinematicBackgroundProps {
  isFullPage?: boolean;
}

export default function HeroCinematicBackground({
  isFullPage = true,
}: HeroCinematicBackgroundProps) {
  return <ScrollFrameCanvas isFullPage={isFullPage} />;
}
