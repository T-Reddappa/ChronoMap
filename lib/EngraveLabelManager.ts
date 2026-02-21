import type mapboxgl from "mapbox-gl";
import type { Empire } from "./types";
import { computeEmpireCentroid } from "./camera";

const SOURCE_ID = "engrave-label-source";
const LAYER_ID = "engrave-label-layer";

const PHASE1_MS = 800;
const PHASE2_MS = 2000;
const PHASE3_MS = 1200;

const OPACITY_PEAK = 0.35;
const HALO_WIDTH_PEAK = 3.5; // Slightly stronger halo for globe projection
const HALO_WIDTH_END = 1;
const HALO_BLUR_START = 1;
const HALO_BLUR_PEAK = 0.5;

const TEXT_COLOR = "#e8e4d8";
const HALO_COLOR = "rgba(0,0,0,0.85)";

type Phase = "idle" | "phase1" | "phase2" | "phase3" | "removing";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Geographic Engrave Effect: when the camera focuses on a single empire,
 * its name is revealed as if engraved into the terrain (low opacity fill,
 * strong halo, subtle emboss), then dissolves.
 *
 * Animation timing (aligned with CameraScheduler zoom settle):
 *   Phase 1 (800ms): Fade in — text and halo appear during zoom.
 *     Matches the 800ms delay after which fitBounds runs, so the label
 *     reveals while the view is settling (intentional, not before).
 *   Phase 2 (2000ms): Hold — lets the label sit so it’s readable and
 *     gives a clear “engraved” moment before dissolution.
 *   Phase 3 (1200ms): Fade out — opacity and halo shrink, then layer
 *     removed. Slightly longer than Phase 1 for a gentle exit.
 *
 * Interruption: scheduleStart() and stop() clear any pending timeout and
 * rAF, and remove the layer/source so a new solo focus or loss of focus
 * never leaves a stuck label.
 *
 * All animation is driven by rAF; no React.
 */
export class EngraveLabelManager {
  private map: mapboxgl.Map;
  private phase: Phase = "idle";
  private phaseStartTime = 0;
  private currentEmpireId: string | null = null;
  private startTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;
  private disposed = false;

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  /**
   * Schedule the engrave to start after `delayMs` (e.g. 800ms to align
   * with CameraScheduler focus execution). Cancels any pending or
   * running engrave for a previous empire.
   */
  scheduleStart(empire: Empire, delayMs: number): void {
    this.cancelPending();
    this.stop();

    this.startTimeoutId = setTimeout(() => {
      this.startTimeoutId = null;
      if (this.disposed) return;
      this.startAnimation(empire);
    }, delayMs);
  }

  /**
   * Cancel any scheduled start and any running animation; remove the
   * engrave layer and source. Call when focus is lost or visibility
   * is no longer a single empire.
   */
  stop(): void {
    this.cancelPending();

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.phase = "idle";
    this.currentEmpireId = null;
    this.removeLayer();
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
  }

  private cancelPending(): void {
    if (this.startTimeoutId !== null) {
      clearTimeout(this.startTimeoutId);
      this.startTimeoutId = null;
    }
  }

  private removeLayer(): void {
    try {
      if (this.map.getLayer(LAYER_ID)) this.map.removeLayer(LAYER_ID);
      if (this.map.getSource(SOURCE_ID)) this.map.removeSource(SOURCE_ID);
    } catch {
      // Ignore if already removed or map disposed
    }
  }

  private startAnimation(empire: Empire): void {
    this.removeLayer();
    this.currentEmpireId = empire.id;

    const [lng, lat] = computeEmpireCentroid(empire);
    const label = empire.name.toUpperCase();

    this.map.addSource(SOURCE_ID, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { name: label },
        geometry: { type: "Point", coordinates: [lng, lat] },
      },
    });

    this.map.addLayer({
      id: LAYER_ID,
      type: "symbol",
      source: SOURCE_ID,
      layout: {
        "text-field": ["get", "name"],
        "text-transform": "uppercase",
        "text-size": 29, // ~5% larger baseline for globe legibility
        "text-letter-spacing": 0.08,
        "text-anchor": "center",
        "text-pitch-alignment": "map", // Keeps label legible on globe/terrain
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": TEXT_COLOR,
        "text-opacity": 0,
        "text-halo-color": HALO_COLOR,
        "text-halo-width": 0,
        "text-halo-blur": HALO_BLUR_START,
      },
    });

    this.phase = "phase1";
    this.phaseStartTime = performance.now();
    this.ensureLoop();
  }

  private ensureLoop(): void {
    if (this.rafId !== null || this.disposed) return;
    const loop = (): void => {
      this.rafId = null;
      if (this.disposed || this.phase === "idle" || this.phase === "removing") return;
      if (!this.map.getLayer(LAYER_ID)) return;

      const now = performance.now();
      const elapsed = now - this.phaseStartTime;

      if (this.phase === "phase1") {
        const t = Math.min(1, elapsed / PHASE1_MS);
        const smooth = t * (2 - t); // easeOutQuad
        this.map.setPaintProperty(LAYER_ID, "text-opacity", lerp(0, OPACITY_PEAK, smooth));
        this.map.setPaintProperty(LAYER_ID, "text-halo-width", lerp(0, HALO_WIDTH_PEAK, smooth));
        this.map.setPaintProperty(LAYER_ID, "text-halo-blur", lerp(HALO_BLUR_START, HALO_BLUR_PEAK, smooth));

        if (t >= 1) {
          this.phase = "phase2";
          this.phaseStartTime = now;
        }
      } else if (this.phase === "phase2") {
        if (elapsed >= PHASE2_MS) {
          this.phase = "phase3";
          this.phaseStartTime = now;
        }
      } else if (this.phase === "phase3") {
        const t = Math.min(1, elapsed / PHASE3_MS);
        const smooth = t * (2 - t);
        this.map.setPaintProperty(LAYER_ID, "text-opacity", lerp(OPACITY_PEAK, 0, smooth));
        this.map.setPaintProperty(LAYER_ID, "text-halo-width", lerp(HALO_WIDTH_PEAK, HALO_WIDTH_END, smooth));

        if (t >= 1) {
          this.phase = "idle";
          this.currentEmpireId = null;
          this.removeLayer();
          return;
        }
      }

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}
