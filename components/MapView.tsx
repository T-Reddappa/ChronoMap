"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTimelineStore } from "@/store/useTimelineStore";
import { FadeManager, FADE_DURATION_MS } from "@/lib/FadeManager";
import {
  computeCombinedBounds,
  computeEmpireCentroid,
  setsEqual,
} from "@/lib/camera";
import { CameraScheduler } from "@/lib/CameraScheduler";
import { EngraveLabelManager } from "@/lib/EngraveLabelManager";
import {
  hideModernMapLayers,
  setModernBoundariesVisible,
} from "@/lib/baseMapPurity";
import * as empireLoader from "@/lib/empireLoader";
import { getActiveGeometry } from "@/lib/geometrySwitch";
import {
  loadPlaces,
  getPlacesSync,
  buildPlacesGeoJSON,
} from "@/lib/historicalPlaces";
import type { Empire } from "@/lib/types";
import type {
  Feature,
  FeatureCollection,
  Point,
  Polygon,
  MultiPolygon,
} from "geojson";

const ENGRAVE_START_DELAY_MS = 800; // Align with CameraScheduler focus timeout

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// ────────────────────────────────────────────────────────────
// Layer helpers — pure imperative Mapbox operations.
// Layers are added at opacity 0; FadeManager handles transitions.
// ────────────────────────────────────────────────────────────

const EMPIRE_NAME_LABELS_LAYER_ID = "empire-name-labels-layer";

function addEmpireLayers(
  map: mapboxgl.Map,
  empire: Empire,
  geojson: FeatureCollection<Polygon | MultiPolygon>
): void {
  const sourceId = `source-${empire.id}`;
  if (map.getSource(sourceId)) return;

  map.addSource(sourceId, { type: "geojson", data: geojson });

  const beforeId = map.getLayer(EMPIRE_NAME_LABELS_LAYER_ID)
    ? EMPIRE_NAME_LABELS_LAYER_ID
    : undefined;

  map.addLayer(
    {
      id: `fill-${empire.id}`,
      type: "fill",
      source: sourceId,
      paint: { "fill-color": empire.color, "fill-opacity": 0 },
    },
    beforeId
  );

  map.addLayer(
    {
      id: `line-${empire.id}`,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": empire.color,
        "line-width": 2,
        "line-opacity": 0,
      },
    },
    beforeId
  );
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

function updateEmpireNameLabels(map: mapboxgl.Map, year: number): void {
  const source = map.getSource("empire-name-labels") as
    | mapboxgl.GeoJSONSource
    | undefined;
  if (!source) return;

  const visibleIds = empireLoader.getVisibleIds(year);
  const features: Feature<Point, { name: string; color: string }>[] = [];

  for (const id of visibleIds) {
    const empire = empireLoader.get(id);
    if (!empire) continue;
    const centroid = computeEmpireCentroid(empire, year);
    if (!centroid) continue;
    features.push({
      type: "Feature",
      properties: { name: empire.name, color: empire.color },
      geometry: { type: "Point", coordinates: centroid },
    });
  }

  source.setData({
    type: "FeatureCollection",
    features,
  });
}

// ────────────────────────────────────────────────────────────
// Diff-based sync — returns the new visible ID set.
// Uses manifest for visible ids, loader for empire data; geometry switching via setData.
// activeGeometryByEmpire tracks which slice is currently drawn per empire.
// ────────────────────────────────────────────────────────────

function syncLayers(
  map: mapboxgl.Map,
  year: number,
  fadeManager: FadeManager,
  activeLayers: Set<string>,
  activeGeometryByEmpire: Map<string, { startYear: number; endYear: number }>
): Set<string> {
  const visibleIds = new Set(empireLoader.getVisibleIds(year));

  // Phase 1 — fade out empires that are no longer active
  for (const id of Array.from(activeLayers)) {
    if (visibleIds.has(id)) continue;
    if (fadeManager.isFadingOut(id)) continue;

    fadeManager.fadeOut(id, FADE_DURATION_MS, () => {
      removeEmpireLayers(map, id);
      activeLayers.delete(id);
      activeGeometryByEmpire.delete(id);
    });
  }

  // Phase 2 — fade in or update empires that are active
  for (const id of visibleIds) {
    const empire = empireLoader.get(id);
    if (!empire) {
      empireLoader.load(id);
      continue;
    }
    const slice = getActiveGeometry(empire, year);
    if (!slice) continue;

    if (fadeManager.isFadingOut(id)) {
      fadeManager.fadeIn(id, FADE_DURATION_MS);
      continue;
    }

    if (activeLayers.has(id)) {
      const prev = activeGeometryByEmpire.get(id);
      if (
        prev &&
        (prev.startYear !== slice.startYear || prev.endYear !== slice.endYear)
      ) {
        const source = map.getSource(`source-${id}`) as mapboxgl.GeoJSONSource;
        if (source) source.setData(slice.geojson);
        activeGeometryByEmpire.set(id, {
          startYear: slice.startYear,
          endYear: slice.endYear,
        });
      }
      continue;
    }

    addEmpireLayers(map, empire, slice.geojson);
    activeLayers.add(id);
    activeGeometryByEmpire.set(id, {
      startYear: slice.startYear,
      endYear: slice.endYear,
    });
    fadeManager.fadeIn(id, FADE_DURATION_MS, { highlight: true });
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
  const activeGeometryByEmpire = useRef<
    Map<string, { startYear: number; endYear: number }>
  >(new Map());
  const lastRenderedYear = useRef<number>(Number.MIN_SAFE_INTEGER);
  const previousVisibleIds = useRef<Set<string>>(new Set());
  const previousFocusModeRef = useRef<boolean>(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let disposed = false;
    let unsubscribe: (() => void) | null = null;
    let unsubscribeBorders: (() => void) | null = null;
    let unsubscribeProjection: (() => void) | null = null;

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

    map.on("load", async () => {
      if (disposed) return;
      try {
        await empireLoader.loadManifest();
      } catch {
        // Manifest failed; getVisibleIds will fall back to legacy empires
      }
      try {
        await loadPlaces();
      } catch {
        // Places failed; map will still show empires
      }

      // ── Projection from store (user can switch Globe / 2D Map) ─
      map.setProjection(useTimelineStore.getState().projectionMode);

      // ── Subtle terrain (once per load, documentary tone) ───────
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.terrain-rgb",
          tileSize: 512,
          maxzoom: 14,
        });
      }
      map.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.1,
      });
      hideModernMapLayers(map);
      setModernBoundariesVisible(map, useTimelineStore.getState().compareModernBorders);
      // Performance: globe + terrain are set once in load; no React state, no duplicate
      // DEM source (guard above). FadeManager and layer sync are unchanged; playback
      // remains one rAF in TimelineSlider and one in FadeManager — no extra frame cost.

      mapRef.current = map;

      // React to "Compare with Modern Borders" toggle (no full re-render)
      let lastCompareBorders = useTimelineStore.getState().compareModernBorders;
      unsubscribeBorders = useTimelineStore.subscribe((state) => {
        if (state.compareModernBorders === lastCompareBorders) return;
        lastCompareBorders = state.compareModernBorders;
        if (mapRef.current && !disposed) {
          setModernBoundariesVisible(mapRef.current, lastCompareBorders);
        }
      });

      // React to user switching Globe / 2D Map (only when projectionMode changes)
      let lastProjection: "globe" | "mercator" =
        useTimelineStore.getState().projectionMode;
      unsubscribeProjection = useTimelineStore.subscribe((state) => {
        if (state.projectionMode === lastProjection) return;
        lastProjection = state.projectionMode;
        if (mapRef.current && !disposed) {
          mapRef.current.setProjection(lastProjection);
        }
      });
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

      const getEmpire = (id: string) => empireLoader.get(id);

      const runSync = (year: number) =>
        syncLayers(
          map,
          year,
          fadeManager,
          activeLayerIds.current,
          activeGeometryByEmpire.current
        );

      // Preload JSON-backed empires visible at init so first runSync can draw them
      const initVisibleIds = empireLoader.getVisibleIds(initYear);
      try {
        await Promise.all(
          initVisibleIds.map((id) =>
            empireLoader.get(id) ? Promise.resolve() : empireLoader.load(id)
          )
        );
      } catch {
        // One or more JSON loads failed; runSync will still draw legacy empires
      }

      const places = getPlacesSync();
      map.addSource("historical-places", {
        type: "geojson",
        data: buildPlacesGeoJSON(places, initYear),
      });
      map.addLayer({
        id: "historical-place-labels",
        type: "symbol",
        source: "historical-places",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-anchor": "top",
          "text-offset": [0, 0.6],
          "text-pitch-alignment": "map",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "rgba(232, 228, 216, 0.9)",
          "text-halo-color": "rgba(0,0,0,0.8)",
          "text-halo-width": 1,
        },
      });
      map.addSource("empire-name-labels", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: EMPIRE_NAME_LABELS_LAYER_ID,
        type: "symbol",
        source: "empire-name-labels",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 15,
          "text-anchor": "center",
          "text-pitch-alignment": "map",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "rgba(0,0,0,0.85)",
          "text-halo-width": 1.5,
        },
      });
      const updatePlacesForYear = (year: number) => {
        const src = map.getSource("historical-places") as mapboxgl.GeoJSONSource;
        if (src) src.setData(buildPlacesGeoJSON(getPlacesSync(), year));
      };

      const initVisible = runSync(initYear);
      previousVisibleIds.current = initVisible;
      updateEmpireNameLabels(map, initYear);

      empireLoader.setOnLoadComplete(() => {
        if (disposed || !mapRef.current) return;
        const y = lastRenderedYear.current;
        previousVisibleIds.current = runSync(y);
        updateEmpireNameLabels(mapRef.current, y);
      });

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

        const visibleIds = runSync(intYear);
        updatePlacesForYear(intYear);
        updateEmpireNameLabels(map, intYear);

        const setsChanged = !setsEqual(previousVisibleIds.current, visibleIds);

        // Contemporary clarity: suppress engraved labels when 3+ empires (Part 5)
        if (visibleIds.size > 2) engraveManager.stop();

        if (focusMode && setsChanged) {
          if (visibleIds.size === 1) {
            const bounds = computeCombinedBounds(
              visibleIds,
              intYear,
              getEmpire
            );
            if (bounds) {
              scheduler.scheduleFocus(bounds, { solo: true });
              const empire = getEmpire([...visibleIds][0]);
              if (empire) {
                engraveManager.scheduleStart(
                  empire,
                  intYear,
                  ENGRAVE_START_DELAY_MS
                );
              }
            }
          } else {
            engraveManager.stop();
            if (visibleIds.size > 0) {
              const bounds = computeCombinedBounds(
                visibleIds,
                intYear,
                getEmpire
              );
              if (bounds) {
                scheduler.scheduleFocus(bounds, { solo: false });
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
        const empire = empireLoader.get(empireId);
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
      unsubscribeBorders?.();
      unsubscribeProjection?.();
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
