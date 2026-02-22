import type { FeatureCollection, Polygon, MultiPolygon, Position } from "geojson";
import type { Empire } from "./types";
import { getActiveGeometry } from "./geometrySwitch";

type BBox = [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

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

function getEmpireBBoxForYear(empire: Empire, year: number): BBox | null {
  const slice = getActiveGeometry(empire, year);
  if (!slice) return null;
  return computeFeatureCollectionBBox(slice.geojson);
}

/**
 * Merge bounding boxes of all empires in the set using active geometry at year.
 * getEmpire(id) should return from loader cache (or legacy).
 */
export function computeCombinedBounds(
  empireIds: Set<string>,
  year: number,
  getEmpire: (id: string) => Empire | undefined
): [[number, number], [number, number]] | null {
  if (empireIds.size === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const id of empireIds) {
    const empire = getEmpire(id);
    if (!empire) continue;
    const bbox = getEmpireBBoxForYear(empire, year);
    if (!bbox) continue;
    const [eLng1, eLat1, eLng2, eLat2] = bbox;
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

/** Centroid of an empire's active geometry at year (bbox center). Used for engrave label. */
export function computeEmpireCentroid(
  empire: Empire,
  year: number
): [number, number] | null {
  const bbox = getEmpireBBoxForYear(empire, year);
  if (!bbox) return null;
  const [minLng, minLat, maxLng, maxLat] = bbox;
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
