"use client";

import { useEffect, useRef, useState } from "react";
import { useTimelineStore } from "@/store/useTimelineStore";
import { getChapterIndex, CHAPTERS, type Chapter } from "@/lib/chapters";

const ANIMATION_TOTAL_MS = 2400; // 600 fade-in + 1200 hold + 600 fade-out

/**
 * Full-screen chapter title overlay that triggers during autoplay
 * when the timeline crosses into a new historical era.
 *
 * Detection strategy:
 *   - External store subscription (not a React selector) tracks
 *     selectedYear changes.
 *   - A `prevChapterIdx` ref records the current chapter at all times.
 *   - When NOT playing: silently updates the ref (no overlay).
 *   - When playing AND index changes: triggers the overlay.
 *   - This prevents false-triggers when the user drags the slider
 *     to a new era and then resumes playback.
 *
 * Animation:
 *   CSS keyframe `chapter-enter` (defined in globals.css) handles
 *   the full fade-in / hold / fade-out sequence. A React `key`
 *   remounts the element to restart the animation on consecutive triggers.
 *
 * Re-render cost: at most ~5 renders per full playthrough (one per chapter).
 */
export default function ChapterOverlay() {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const prevChapterIdx = useRef(-1);
  const animKey = useRef(0);

  useEffect(() => {
    const initYear = Math.floor(
      useTimelineStore.getState().selectedYear
    );
    prevChapterIdx.current = getChapterIndex(initYear);

    const unsub = useTimelineStore.subscribe((state) => {
      const intYear = Math.floor(state.selectedYear);
      const idx = getChapterIndex(intYear);

      if (!state.isPlaying) {
        // Silent tracking — update ref without showing overlay
        prevChapterIdx.current = idx;
        return;
      }

      if (idx >= 0 && idx !== prevChapterIdx.current) {
        prevChapterIdx.current = idx;
        animKey.current += 1;
        setChapter(CHAPTERS[idx]);
        // Hook point for future sound cue:
        // onChapterEnter?.(CHAPTERS[idx]);
      }
    });

    return unsub;
  }, []);

  // Auto-clear after CSS animation completes
  useEffect(() => {
    if (!chapter) return;
    const timer = setTimeout(() => setChapter(null), ANIMATION_TOTAL_MS);
    return () => clearTimeout(timer);
  }, [chapter]);

  if (!chapter) return null;

  return (
    <div
      key={animKey.current}
      className="chapter-enter fixed inset-0 z-25 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center px-8">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          {chapter.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/60 font-light tracking-wide">
          {chapter.subtitle}
        </p>
      </div>
    </div>
  );
}
