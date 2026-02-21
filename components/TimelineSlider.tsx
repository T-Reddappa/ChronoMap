"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTimelineStore } from "@/store/useTimelineStore";
import { formatYear, MIN_YEAR, MAX_YEAR } from "@/lib/timeUtils";
import { momentumFactor } from "@/lib/momentum";

const ERA_MARKERS = [
  { year: -3000, label: "3000 BCE" },
  { year: -2000, label: "2000 BCE" },
  { year: -1000, label: "1000 BCE" },
  { year: -500, label: "500 BCE" },
  { year: 0, label: "1 CE" },
  { year: 500, label: "500 CE" },
  { year: 1000, label: "1000 CE" },
  { year: 1500, label: "1500 CE" },
  { year: 2000, label: "2000 CE" },
];

const SPEED_PRESETS = [
  { label: "1×", value: 50 },
  { label: "2×", value: 100 },
  { label: "5×", value: 250 },
  { label: "10×", value: 500 },
];

export default function TimelineSlider() {
  const selectedYear = useTimelineStore((s) => s.selectedYear);
  const setSelectedYear = useTimelineStore((s) => s.setSelectedYear);
  const isPlaying = useTimelineStore((s) => s.isPlaying);
  const setIsPlaying = useTimelineStore((s) => s.setIsPlaying);
  const playbackSpeed = useTimelineStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useTimelineStore((s) => s.setPlaybackSpeed);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedYear(Math.round(Number(e.target.value)));
    },
    [setSelectedYear]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  const playbackStartRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    playbackStartRef.current = performance.now();
    let lastTime: number | null = null;
    let rafId: number;

    function frame(now: number) {
      if (lastTime !== null) {
        const dt = (now - lastTime) / 1000;
        const { selectedYear, playbackSpeed, setSelectedYear, setIsPlaying } =
          useTimelineStore.getState();

        const elapsed = (now - playbackStartRef.current) / 1000;
        const momentum = momentumFactor(selectedYear, elapsed);
        const next = selectedYear + playbackSpeed * momentum * dt;

        if (next >= MAX_YEAR) {
          setSelectedYear(MAX_YEAR);
          setIsPlaying(false);
          return;
        }

        setSelectedYear(next);
      }
      lastTime = now;
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const progress =
    ((selectedYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      <div className="mx-4 mb-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 px-6 py-4 shadow-2xl">
        {/* Controls row */}
        <div className="flex items-center justify-between mb-3">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2l10 6-10 6V2z" />
              </svg>
            )}
          </button>

          {/* Year display */}
          <div className="text-center">
            <span className="text-2xl font-bold text-white tracking-wide tabular-nums">
              {formatYear(selectedYear)}
            </span>
          </div>

          {/* Speed presets */}
          <div className="flex items-center gap-1">
            {SPEED_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setPlaybackSpeed(preset.value)}
                className={`
                  px-2 py-1 rounded-md text-xs font-medium transition-colors
                  ${
                    playbackSpeed === preset.value
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }
                `}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider track */}
        <div className="relative">
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-linear-to-r from-amber-500 to-orange-500 will-change-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step="any"
            value={selectedYear}
            onChange={handleSliderChange}
            className="timeline-slider absolute top-1/2 -translate-y-1/2 left-0 w-full h-5 cursor-pointer"
            aria-label="Timeline year selector"
          />
        </div>

        {/* Era markers */}
        <div className="relative mt-2 h-4">
          {ERA_MARKERS.map((marker) => {
            const left =
              ((marker.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
            return (
              <button
                key={marker.year}
                onClick={() => setSelectedYear(marker.year)}
                className="absolute -translate-x-1/2 text-[10px] text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                style={{ left: `${left}%` }}
              >
                {marker.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
