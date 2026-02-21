import type { FeatureCollection, Polygon, MultiPolygon, Position } from "geojson";
import { empires } from "./empires";
import type { Empire } from "./types";

type BBox = [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

// Pre-indexed for O(1) lookups during camera reframe
const empireMap = new Map<string, Empire>(empires.map((e) => [e.id, e]));

// Lazily computed, cached forever (GeoJSON is static)
const bboxCache = new Map<string, BBox>();

function computeFeatureCollectionBBox(
  fc: FeatureCollection<Polygon | MultiPolygon>
): BBox {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const feature of fc.features) {
    const rings: Position[][] =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates
        : feature.geometry.coordinates.flat();

    for (const ring of rings) {
      for (const coord of ring) {
        if (coord[0] < minLng) minLng = coord[0];
        if (coord[1] < minLat) minLat = coord[1];
        if (coord[0] > maxLng) maxLng = coord[0];
        if (coord[1] > maxLat) maxLat = coord[1];
      }
    }
  }

  return [minLng, minLat, maxLng, maxLat];
}

function getEmpireBBox(empire: Empire): BBox {
  let bbox = bboxCache.get(empire.id);
  if (!bbox) {
    bbox = computeFeatureCollectionBBox(empire.geojson);
    bboxCache.set(empire.id, bbox);
  }
  return bbox;
}

/**
 * Merge bounding boxes of all empires in the set.
 * Returns Mapbox-compatible [[sw], [ne]] or null if empty.
 */
export function computeCombinedBounds(
  empireIds: Set<string>
): [[number, number], [number, number]] | null {
  if (empireIds.size === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const id of empireIds) {
    const empire = empireMap.get(id);
    if (!empire) continue;

    const [eLng1, eLat1, eLng2, eLat2] = getEmpireBBox(empire);
    if (eLng1 < minLng) minLng = eLng1;
    if (eLat1 < minLat) minLat = eLat1;
    if (eLng2 > maxLng) maxLng = eLng2;
    if (eLat2 > maxLat) maxLat = eLat2;
  }

  if (!isFinite(minLng)) return null;

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

/** Centroid of an empire's geometry (bbox center). Used for engrave label placement. */
export function computeEmpireCentroid(empire: Empire): [number, number] {
  const [minLng, minLat, maxLng, maxLat] = getEmpireBBox(empire);
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

export const GLOBAL_BOUNDS: [[number, number], [number, number]] = [
  [-170, -60],
  [170, 70],
];

export function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) {
    if (!b.has(v)) return false;
  }
  return true;
}
