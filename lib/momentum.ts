import { CHAPTERS } from "./chapters";

const CHAPTER_YEARS = CHAPTERS.map((c) => c.year);

const BRAKE_RADIUS = 20;
const BRAKE_FLOOR = 0.6;
const ACCEL_RADIUS = 200;
const ACCEL_FACTOR = 1.15;
const RAMP_SECONDS = 3;
const MAX_FACTOR = 1.2;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Shapes playback speed to create organic documentary pacing.
 *
 * Three multiplied components:
 *   1. Ramp — eases from 0 to 1 over first 3 seconds of playback
 *      so the timeline doesn't jolt to full speed instantly.
 *   2. Chapter brake — slows to 0.6x within ±20 years of any chapter
 *      boundary, giving the ChapterOverlay time to breathe.
 *   3. Mid-era boost — speeds up to 1.15x when deep in stable periods
 *      (no chapter within 200 years), skimming quieter centuries.
 *
 * @param year Current timeline year
 * @param elapsedPlaybackSeconds Seconds since playback started
 */
export function momentumFactor(
  year: number,
  elapsedPlaybackSeconds: number
): number {
  // 1. Startup ramp
  const ramp = smoothstep(0, RAMP_SECONDS, elapsedPlaybackSeconds);

  // 2. Chapter proximity brake — take the minimum brake across all chapters
  let closestDist = Infinity;
  for (const cy of CHAPTER_YEARS) {
    const dist = Math.abs(year - cy);
    if (dist < closestDist) closestDist = dist;
  }

  let chapterFactor: number;
  if (closestDist < BRAKE_RADIUS) {
    // lerp from BRAKE_FLOOR at distance=0 to 1.0 at distance=BRAKE_RADIUS
    chapterFactor = BRAKE_FLOOR + (1 - BRAKE_FLOOR) * (closestDist / BRAKE_RADIUS);
  } else if (closestDist > ACCEL_RADIUS) {
    // 3. Mid-era acceleration
    chapterFactor = ACCEL_FACTOR;
  } else {
    chapterFactor = 1;
  }

  return Math.min(ramp * chapterFactor, MAX_FACTOR);
}
