"use client";

import { useTimelineStore } from "@/store/useTimelineStore";

export default function AtmosphereOverlay() {
  const visible = useTimelineStore((s) => s.cinematicAtmosphere);
  if (!visible) return null;
  return <div className="atmosphere-vignette" />;
}
