import type mapboxgl from "mapbox-gl";
import { GLOBAL_BOUNDS } from "./camera";

const FOCUS_DELAY_MS = 800;
const WITHDRAWAL_DELAY_MS = 900;
const COOLDOWN_MS = 2000;

const easeOutQuad = (t: number) => t * (2 - t);

/**
 * Defers and deduplicates camera movements so fade/highlight animations
 * settle before the viewport reframes.
 *
 * Design:
 *   - A single `pendingTimeoutId` serializes all scheduled moves.
 *     Calling `scheduleFocus` or `scheduleGlobalReset` cancels any
 *     pending timer before starting a new one.
 *   - Cooldown is checked inside the timeout callback (not at schedule
 *     time) so it reflects the actual execution moment.
 *   - `hasResetSinceEmpty` prevents repeated withdrawal animations
 *     during long periods with no visible empires.
 */
export class CameraScheduler {
  private map: mapboxgl.Map;
  private pendingTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastMoveTime = 0;
  private hasResetSinceEmpty = false;

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  scheduleFocus(
    bounds: [[number, number], [number, number]],
    options: { solo: boolean }
  ): void {
    this.hasResetSinceEmpty = false;
    this.cancelPending();

    this.pendingTimeoutId = setTimeout(() => {
      this.pendingTimeoutId = null;

      const now = performance.now();
      if (now - this.lastMoveTime < COOLDOWN_MS) return;

      this.map.fitBounds(bounds, {
        padding: options.solo ? 80 : 120,
        maxZoom: options.solo ? 5 : 4,
        duration: 1600,
        pitch: 40,
        easing: easeOutQuad,
      });
      this.lastMoveTime = now;
    }, FOCUS_DELAY_MS);
  }

  scheduleGlobalReset(): void {
    if (this.hasResetSinceEmpty) return;
    this.cancelPending();

    this.pendingTimeoutId = setTimeout(() => {
      this.pendingTimeoutId = null;
      this.hasResetSinceEmpty = true;

      const now = performance.now();
      if (now - this.lastMoveTime < COOLDOWN_MS) return;

      this.map.fitBounds(GLOBAL_BOUNDS, {
        padding: 200,
        pitch: 0,
        duration: 2400,
        easing: easeOutQuad,
      });
      this.lastMoveTime = now;
    }, WITHDRAWAL_DELAY_MS);
  }

  dispose(): void {
    this.cancelPending();
  }

  private cancelPending(): void {
    if (this.pendingTimeoutId !== null) {
      clearTimeout(this.pendingTimeoutId);
      this.pendingTimeoutId = null;
    }
  }
}
