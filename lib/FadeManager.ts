import type mapboxgl from "mapbox-gl";

export const FILL_OPACITY_TARGET = 0.35;
export const LINE_OPACITY_TARGET = 0.8;
export const FADE_DURATION_MS = 400;

const HIGHLIGHT_FADE_MS = 600;
const PULSE_DURATION_MS = 700;
const LINE_WIDTH_BASE = 2;
const LINE_WIDTH_PEAK = 5;

type EasingFn = (t: number) => number;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Overshoots to ~1.17 then settles back to 1.0.
 * Applied to normalized opacity during highlight, this creates a visible
 * "flash" (fill-opacity peaks at 0.41 vs. target 0.35) without needing
 * a separate settle animation.
 */
function easeOutBack(t: number): number {
  const c1 = 2.0;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ── Animation types ────────────────────────────────────────

interface FadeAnimation {
  direction: "in" | "out";
  startTime: number;
  fromNormalized: number;
  toNormalized: number;
  duration: number;
  easing: EasingFn;
  onComplete?: () => void;
}

interface PulseAnimation {
  startTime: number;
  duration: number;
}

// ── FadeManager ────────────────────────────────────────────

/**
 * Manages fade-in / fade-out transitions and highlight pulses
 * for empire map layers.
 *
 * Two animation tracks share one rAF loop:
 *   1. Opacity fades (fill-opacity, line-opacity) via `animations` map
 *   2. Line-width pulses via `pulses` map
 *
 * The loop auto-starts when work is queued and auto-stops when both
 * maps are empty — zero CPU at rest.
 *
 * Highlight mode:
 *   - Uses easeOutBack for the opacity fade → natural overshoot + settle
 *   - Simultaneously runs a line-width pulse (sin bell curve)
 *   - Interruption-safe: a fadeOut during highlight just replaces the
 *     opacity animation. The pulse continues harmlessly on a fading layer.
 */
export class FadeManager {
  private map: mapboxgl.Map;
  private animations = new Map<string, FadeAnimation>();
  private currentOpacity = new Map<string, number>();
  private pulses = new Map<string, PulseAnimation>();
  private rafId: number | null = null;
  private disposed = false;

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  fadeIn(
    empireId: string,
    duration = FADE_DURATION_MS,
    options?: { highlight?: boolean }
  ): void {
    const current = this.currentOpacity.get(empireId) ?? 0;
    const highlight = options?.highlight ?? false;

    this.animations.set(empireId, {
      direction: "in",
      startTime: performance.now(),
      fromNormalized: current,
      toNormalized: 1,
      duration: highlight ? HIGHLIGHT_FADE_MS : duration,
      easing: highlight ? easeOutBack : easeOutCubic,
    });

    if (highlight) {
      this.pulses.set(empireId, {
        startTime: performance.now(),
        duration: PULSE_DURATION_MS,
      });
    }

    this.ensureLoop();
  }

  fadeOut(
    empireId: string,
    duration = FADE_DURATION_MS,
    onComplete?: () => void
  ): void {
    const current = this.currentOpacity.get(empireId) ?? 1;

    this.animations.set(empireId, {
      direction: "out",
      startTime: performance.now(),
      fromNormalized: current,
      toNormalized: 0,
      duration,
      easing: easeOutCubic,
      onComplete,
    });

    this.ensureLoop();
  }

  isFadingOut(empireId: string): boolean {
    return this.animations.get(empireId)?.direction === "out";
  }

  dispose(): void {
    this.disposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.animations.clear();
    this.currentOpacity.clear();
    this.pulses.clear();
  }

  // ── Private ───────────────────────────────────────────────

  private ensureLoop(): void {
    if (this.rafId === null && !this.disposed) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private get hasWork(): boolean {
    return this.animations.size > 0 || this.pulses.size > 0;
  }

  private tick = (now: number): void => {
    if (this.disposed) return;
    this.rafId = null;

    this.tickOpacity(now);
    this.tickPulses(now);

    if (this.hasWork) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  // ── Opacity track ─────────────────────────────────────────

  private tickOpacity(now: number): void {
    const completed: string[] = [];

    for (const [id, anim] of this.animations) {
      const elapsed = now - anim.startTime;
      const rawProgress = Math.min(elapsed / anim.duration, 1);
      const eased = anim.easing(rawProgress);
      const normalized =
        anim.fromNormalized +
        (anim.toNormalized - anim.fromNormalized) * eased;

      this.applyOpacity(id, normalized);
      this.currentOpacity.set(id, normalized);

      if (rawProgress >= 1) {
        completed.push(id);
      }
    }

    for (const id of completed) {
      const anim = this.animations.get(id)!;
      this.animations.delete(id);

      if (anim.direction === "out") {
        this.currentOpacity.delete(id);
        anim.onComplete?.();
      }
    }
  }

  // ── Line-width pulse track ────────────────────────────────

  private tickPulses(now: number): void {
    const completed: string[] = [];

    for (const [id, pulse] of this.pulses) {
      const elapsed = now - pulse.startTime;
      const progress = Math.min(elapsed / pulse.duration, 1);

      // sin bell curve: 0 → 1 → 0
      const intensity = Math.sin(Math.PI * progress);
      const width =
        LINE_WIDTH_BASE + (LINE_WIDTH_PEAK - LINE_WIDTH_BASE) * intensity;

      this.applyLineWidth(id, width);

      if (progress >= 1) {
        completed.push(id);
      }
    }

    for (const id of completed) {
      this.pulses.delete(id);
      this.applyLineWidth(id, LINE_WIDTH_BASE);
    }
  }

  // ── Paint helpers ─────────────────────────────────────────

  private applyOpacity(empireId: string, normalized: number): void {
    const fillId = `fill-${empireId}`;
    const lineId = `line-${empireId}`;

    try {
      if (this.map.getLayer(fillId)) {
        this.map.setPaintProperty(
          fillId,
          "fill-opacity",
          normalized * FILL_OPACITY_TARGET
        );
      }
      if (this.map.getLayer(lineId)) {
        this.map.setPaintProperty(
          lineId,
          "line-opacity",
          normalized * LINE_OPACITY_TARGET
        );
      }
    } catch {
      // Layer may have been removed externally
    }
  }

  private applyLineWidth(empireId: string, width: number): void {
    const lineId = `line-${empireId}`;
    try {
      if (this.map.getLayer(lineId)) {
        this.map.setPaintProperty(lineId, "line-width", width);
      }
    } catch {
      // Layer may have been removed externally
    }
  }
}
