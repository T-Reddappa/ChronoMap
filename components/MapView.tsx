"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTimelineStore } from "@/store/useTimelineStore";
import { empires } from "@/lib/empires";
import { getVisibleEmpires } from "@/lib/timeUtils";
import { FadeManager, FADE_DURATION_MS } from "@/lib/FadeManager";
import { computeCombinedBounds, setsEqual } from "@/lib/camera";
import { CameraScheduler } from "@/lib/CameraScheduler";
import { EngraveLabelManager } from "@/lib/EngraveLabelManager";
import type { Empire } from "@/lib/types";

const ENGRAVE_START_DELAY_MS = 800; // Align with CameraScheduler focus timeout

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// ────────────────────────────────────────────────────────────
// Layer helpers — pure imperative Mapbox operations.
// Layers are added at opacity 0; FadeManager handles transitions.
// ────────────────────────────────────────────────────────────

function addEmpireLayers(map: mapboxgl.Map, empire: Empire): void {
  const sourceId = `source-${empire.id}`;
  if (map.getSource(sourceId)) return;

  map.addSource(sourceId, { type: "geojson", data: empire.geojson });

  map.addLayer({
    id: `fill-${empire.id}`,
    type: "fill",
    source: sourceId,
    paint: { "fill-color": empire.color, "fill-opacity": 0 },
  });

  map.addLayer({
    id: `line-${empire.id}`,
    type: "line",
    source: sourceId,
    paint: {
      "line-color": empire.color,
      "line-width": 2,
      "line-opacity": 0,
    },
  });
}

function removeEmpireLayers(map: mapboxgl.Map, empireId: string): void {
  const fillId = `fill-${empireId}`;
  const lineId = `line-${empireId}`;
  const sourceId = `source-${empireId}`;

  try {
    if (map.getLayer(fillId)) map.removeLayer(fillId);
    if (map.getLayer(lineId)) map.removeLayer(lineId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  } catch {
    // Guard against race conditions during rapid year changes
  }
}

// ────────────────────────────────────────────────────────────
// Diff-based sync — returns the new visible ID set.
//
// State machine per empire:
//   absent    → visible year : addLayers + fadeIn(highlight)
//   present   → invisible year: fadeOut → removeOnComplete
//   fadingOut → visible year : reverse to fadeIn (no highlight)
//   fadingIn  → invisible year: replace with fadeOut
// ────────────────────────────────────────────────────────────

function syncLayers(
  map: mapboxgl.Map,
  year: number,
  fadeManager: FadeManager,
  activeLayers: Set<string>
): Set<string> {
  const visible = getVisibleEmpires(empires, year);
  const visibleIds = new Set(visible.map((e) => e.id));

  // Phase 1 — fade out empires that are no longer active
  for (const id of Array.from(activeLayers)) {
    if (visibleIds.has(id)) continue;
    if (fadeManager.isFadingOut(id)) continue;

    fadeManager.fadeOut(id, FADE_DURATION_MS, () => {
      removeEmpireLayers(map, id);
      activeLayers.delete(id);
    });
  }

  // Phase 2 — fade in empires that are newly active
  for (const empire of visible) {
    if (fadeManager.isFadingOut(empire.id)) {
      fadeManager.fadeIn(empire.id, FADE_DURATION_MS);
      continue;
    }

    if (activeLayers.has(empire.id)) continue;

    addEmpireLayers(map, empire);
    activeLayers.add(empire.id);
    fadeManager.fadeIn(empire.id, FADE_DURATION_MS, { highlight: true });
  }

  return visibleIds;
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const fadeManagerRef = useRef<FadeManager | null>(null);
  const schedulerRef = useRef<CameraScheduler | null>(null);
  const engraveManagerRef = useRef<EngraveLabelManager | null>(null);
  const activeLayerIds = useRef<Set<string>>(new Set());
  const lastRenderedYear = useRef<number>(Number.MIN_SAFE_INTEGER);
  const previousVisibleIds = useRef<Set<string>>(new Set());
  const previousFocusModeRef = useRef<boolean>(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let disposed = false;
    let unsubscribe: (() => void) | null = null;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [30, 30],
      zoom: 2.5,
      accessToken: MAPBOX_TOKEN,
      attributionControl: false,
      projection: "mercator",
      renderWorldCopies: false,
      maxBounds: [
        [-180, -85],
        [180, 85],
      ],
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    // ── Map loaded ──────────────────────────────────────────

    map.on("load", () => {
      if (disposed) return;

      mapRef.current = map;
      const fadeManager = new FadeManager(map);
      fadeManagerRef.current = fadeManager;
      const scheduler = new CameraScheduler(map);
      schedulerRef.current = scheduler;
      const engraveManager = new EngraveLabelManager(map);
      engraveManagerRef.current = engraveManager;

      const initState = useTimelineStore.getState();
      const initYear = Math.floor(initState.selectedYear);
      lastRenderedYear.current = initYear;
      previousFocusModeRef.current = initState.focusMode;

      const initVisible = syncLayers(
        map,
        initYear,
        fadeManager,
        activeLayerIds.current
      );
      previousVisibleIds.current = initVisible;

      unsubscribe = useTimelineStore.subscribe((state) => {
        const intYear = Math.floor(state.selectedYear);
        const focusMode = state.focusMode;

        // Year unchanged: still stop engrave when focus is turned off
        if (intYear === lastRenderedYear.current) {
          if (previousFocusModeRef.current && !focusMode) {
            engraveManager.stop();
          }
          previousFocusModeRef.current = focusMode;
          return;
        }

        lastRenderedYear.current = intYear;
        previousFocusModeRef.current = focusMode;

        // ── 1. Sync empire layers ────────────────────────
        const visibleIds = syncLayers(
          map,
          intYear,
          fadeManager,
          activeLayerIds.current
        );

        // ── 2. Camera scheduling + engrave ───────────────
        const setsChanged = !setsEqual(
          previousVisibleIds.current,
          visibleIds
        );

        if (focusMode && setsChanged) {
          if (visibleIds.size === 1) {
            const bounds = computeCombinedBounds(visibleIds);
            if (bounds) {
              scheduler.scheduleFocus(bounds, { solo: true });
              const empire = empires.find((e) => visibleIds.has(e.id));
              if (empire) {
                engraveManager.scheduleStart(empire, ENGRAVE_START_DELAY_MS);
              }
            }
          } else {
            engraveManager.stop();
            if (visibleIds.size > 0) {
              const bounds = computeCombinedBounds(visibleIds);
              if (bounds) {
                scheduler.scheduleFocus(bounds, {
                  solo: false,
                });
              }
            } else if (previousVisibleIds.current.size > 0) {
              scheduler.scheduleGlobalReset();
              engraveManager.stop();
            }
          }
        } else {
          engraveManager.stop();
        }

        previousVisibleIds.current = visibleIds;
      });
    });

    // ── Click: select empire ────────────────────────────────

    map.on("click", (e) => {
      const fillLayers = Array.from(activeLayerIds.current)
        .map((id) => `fill-${id}`)
        .filter((id) => map.getLayer(id));

      if (fillLayers.length === 0) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: fillLayers,
      });

      if (features.length > 0 && features[0].layer) {
        const empireId = features[0].layer.id.replace("fill-", "");
        const empire = empires.find((emp) => emp.id === empireId);
        if (empire) {
          useTimelineStore.getState().setSelectedEmpire(empire);

          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
            className: "empire-popup",
          })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-weight:600;font-size:14px;color:#fff">${empire.name}</div>`
            )
            .addTo(map);
        }
      }
    });

    // ── Hover cursor ────────────────────────────────────────

    map.on("mousemove", (e) => {
      const fillLayers = Array.from(activeLayerIds.current)
        .map((id) => `fill-${id}`)
        .filter((id) => map.getLayer(id));

      if (fillLayers.length === 0) {
        map.getCanvas().style.cursor = "";
        return;
      }

      const features = map.queryRenderedFeatures(e.point, {
        layers: fillLayers,
      });
      map.getCanvas().style.cursor = features.length > 0 ? "pointer" : "";
    });

    // ── Cleanup ─────────────────────────────────────────────

    return () => {
      disposed = true;
      unsubscribe?.();
      engraveManagerRef.current?.dispose();
      engraveManagerRef.current = null;
      schedulerRef.current?.dispose();
      schedulerRef.current = null;
      fadeManagerRef.current?.dispose();
      fadeManagerRef.current = null;
      map.remove();
      mapRef.current = null;
      activeLayerIds.current.clear();
      previousVisibleIds.current.clear();
      lastRenderedYear.current = Number.MIN_SAFE_INTEGER;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
