import type mapboxgl from "mapbox-gl";

/** Substrings in layer id that indicate modern political/label content to hide. */
const HIDE_ID_PATTERNS = [
  "admin",
  "boundary",
  "country",
  "state",
  "place",
  "label",
  "poi",
  "road",
  "settlement",
  "waterway-label",
  "street",
  "building-label",
];

/** Line layer id substrings that are modern boundary outlines only (for comparison toggle). */
const BOUNDARY_LINE_PATTERNS = ["boundary", "admin"];

/** Opacity for modern borders when "Compare with Modern Borders" is on. */
const MODERN_BOUNDARY_OPACITY = 0.18;

/** Layer ids we must keep (physical geography). */
const KEEP_IDS = new Set([
  "land",
  "water",
  "landcover",
  "hillshade",
  "shadow",
  "sky",
]);

/**
 * Hides Mapbox style layers that show modern political boundaries or labels.
 * Keeps only physical geography: land, water, terrain, coastlines.
 * Call once after map load (e.g. after setTerrain). Does not remove layers.
 */
export function hideModernMapLayers(map: mapboxgl.Map): void {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;
    if (KEEP_IDS.has(id)) continue;

    // Hide all symbol layers (place, road, poi labels, etc.)
    if (layer.type === "symbol") {
      try {
        map.setLayoutProperty(id, "visibility", "none");
      } catch {
        // Layer may not support layout or already removed
      }
      continue;
    }

    // Hide line/fill layers that look like admin/boundaries
    const idLower = id.toLowerCase();
    const shouldHide = HIDE_ID_PATTERNS.some((p) => idLower.includes(p));
    if (shouldHide) {
      try {
        map.setLayoutProperty(id, "visibility", "none");
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Show or hide modern country boundary outlines only (no labels, no fill).
 * Independent layer; does not remove or re-run full hide. Use for "Compare with Modern Borders" toggle.
 * Line layers only; opacity 15–20%, thin dashed. Default OFF.
 */
export function setModernBoundariesVisible(
  map: mapboxgl.Map,
  visible: boolean
): void {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    if (layer.type !== "line") continue;
    const idLower = layer.id.toLowerCase();
    const isBoundaryLine = BOUNDARY_LINE_PATTERNS.some((p) => idLower.includes(p));
    if (!isBoundaryLine) continue;

    try {
      map.setLayoutProperty(layer.id, "visibility", visible ? "visible" : "none");
      if (visible) {
        map.setPaintProperty(layer.id, "line-opacity", MODERN_BOUNDARY_OPACITY);
        map.setPaintProperty(layer.id, "line-dasharray", [1, 1]);
      }
    } catch {
      // Layer may not support paint property
    }
  }
}
