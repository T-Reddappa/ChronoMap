"use client";

import dynamic from "next/dynamic";
import TimelineSlider from "@/components/TimelineSlider";
import EmpireDetailsPanel from "@/components/EmpireDetailsPanel";
import ChapterOverlay from "@/components/ChapterOverlay";
import AtmosphereOverlay from "@/components/AtmosphereOverlay";
import DominantPowerOverlay from "@/components/DominantPowerOverlay";
import { useTimelineStore } from "@/store/useTimelineStore";
import { formatYear } from "@/lib/timeUtils";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
      <div className="text-white/40 text-sm animate-pulse">Loading map…</div>
    </div>
  ),
});

function useDisplayYear(): number {
  return useTimelineStore((s) => Math.round(s.selectedYear));
}

function YearBadge() {
  const year = useDisplayYear();
  return (
    <div className="absolute top-4 left-14 z-10 bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3">
      <p className="text-xs text-white/40 uppercase tracking-wider">Year</p>
      <p className="text-lg font-bold text-white tabular-nums">
        {formatYear(year)}
      </p>
    </div>
  );
}

function FocusModeToggle() {
  const focusMode = useTimelineStore((s) => s.focusMode);
  const toggleFocusMode = useTimelineStore((s) => s.toggleFocusMode);

  return (
    <button
      onClick={toggleFocusMode}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        border transition-colors text-sm font-medium
        ${
          focusMode
            ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
            : "bg-black/60 backdrop-blur-lg border-white/10 text-white/50 hover:text-white/80"
        }
      `}
      aria-label="Toggle cinematic focus mode"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="12" height="9" rx="1.5" />
        <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
        <circle cx="8" cy="8.5" r="2" />
      </svg>
      <span>{focusMode ? "Focus On" : "Focus"}</span>
    </button>
  );
}

function AtmosphereToggle() {
  const active = useTimelineStore((s) => s.cinematicAtmosphere);
  const toggle = useTimelineStore((s) => s.toggleCinematicAtmosphere);

  return (
    <button
      onClick={toggle}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        border transition-colors text-sm font-medium
        ${
          active
            ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
            : "bg-black/60 backdrop-blur-lg border-white/10 text-white/50 hover:text-white/80"
        }
      `}
      aria-label="Toggle cinematic atmosphere"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="5.5" />
        <circle cx="8" cy="8" r="2" />
      </svg>
      <span>{active ? "Vignette" : "Vignette"}</span>
    </button>
  );
}

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-950">
      <MapView />
      <AtmosphereOverlay />
      <YearBadge />
      <DominantPowerOverlay />
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
        <FocusModeToggle />
        <AtmosphereToggle />
      </div>
      <ChapterOverlay />
      <TimelineSlider />
      <EmpireDetailsPanel />
    </main>
  );
}
