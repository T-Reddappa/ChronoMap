import { empires } from "./empires";
import type { Empire } from "./types";
import type { Polygon, MultiPolygon, Position } from "geojson";

/**
 * Shoelace formula on unprojected lng/lat coordinates.
 * Gives approximate *relative* areas — sufficient for ranking, not for
 * cartographic measurement.
 */
function shoelaceArea(ring: Position[]): number {
  let area = 0;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += ring[i][0] * ring[j][1];
    area -= ring[j][0] * ring[i][1];
  }
  return Math.abs(area) / 2;
}

function geometryArea(geom: Polygon | MultiPolygon): number {
  if (geom.type === "Polygon") {
    // Outer ring only (holes would subtract, but we only care about ranking)
    return shoelaceArea(geom.coordinates[0]);
  }
  let total = 0;
  for (const polygon of geom.coordinates) {
    total += shoelaceArea(polygon[0]);
  }
  return total;
}

function computeEmpireArea(empire: Empire): number {
  const geojson =
    empire.geometries?.[0]?.geojson ?? empire.geojson;
  if (!geojson) return 0;
  let total = 0;
  for (const feature of geojson.features) {
    total += geometryArea(feature.geometry as Polygon | MultiPolygon);
  }
  return total;
}

// Precompute raw areas at module load
const rawAreas = new Map<string, number>();
let maxArea = 0;

for (const emp of empires) {
  const area = computeEmpireArea(emp);
  rawAreas.set(emp.id, area);
  if (area > maxArea) maxArea = area;
}

// Normalized [0, 1] relative to the largest empire
const normalizedAreas = new Map<string, number>();
for (const [id, area] of rawAreas) {
  normalizedAreas.set(id, maxArea > 0 ? area / maxArea : 0);
}

export function getEmpireArea(id: string): number {
  return normalizedAreas.get(id) ?? 0;
}

export function getDominantEmpire(
  visibleIds: string[],
  year: number
): { empire: Empire; area: number; yearsActive: number } | null {
  if (visibleIds.length === 0) return null;

  let dominant: Empire | null = null;
  let dominantArea = -1;

  for (const id of visibleIds) {
    const area = normalizedAreas.get(id) ?? 0;
    if (area > dominantArea) {
      dominantArea = area;
      dominant = empires.find((e) => e.id === id) ?? null;
    }
  }

  if (!dominant) return null;

  return {
    empire: dominant,
    area: dominantArea,
    yearsActive: year - dominant.startYear,
  };
}
