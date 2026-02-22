import type { FeatureCollection, Polygon, MultiPolygon, Position } from "geojson";
import type { Empire, EmpireGeometry } from "./types";
import { getActiveGeometry } from "./geometrySwitch";

export interface CoexistenceReport {
  activeEmpires: Empire[];
  dominantEmpire: Empire | null;
  comparativeSizes: Map<string, number>;
}

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

function featureCollectionArea(fc: FeatureCollection<Polygon | MultiPolygon>): number {
  let total = 0;
  for (const feature of fc.features) {
    const geom = feature.geometry as Polygon | MultiPolygon;
    if (geom.type === "Polygon") {
      total += shoelaceArea(geom.coordinates[0]);
    } else {
      for (const polygon of geom.coordinates) {
        total += shoelaceArea(polygon[0]);
      }
    }
  }
  return total;
}

function getAreaForSlice(slice: EmpireGeometry): number {
  if (slice.precomputedArea != null) return slice.precomputedArea;
  return featureCollectionArea(slice.geojson);
}

/**
 * Builds a coexistence report for the given empires at the given year.
 * Uses precomputed areas when available; normalizes to [0, 1] by max.
 */
export function buildCoexistenceReport(
  activeEmpires: Empire[],
  year: number
): CoexistenceReport {
  const comparativeSizes = new Map<string, number>();
  let maxArea = 0;
  const areas = new Map<string, number>();

  for (const empire of activeEmpires) {
    const slice = getActiveGeometry(empire, year);
    if (!slice) continue;
    const area = getAreaForSlice(slice);
    areas.set(empire.id, area);
    if (area > maxArea) maxArea = area;
  }

  for (const [id, area] of areas) {
    comparativeSizes.set(id, maxArea > 0 ? area / maxArea : 0);
  }

  let dominantEmpire: Empire | null = null;
  let dominantArea = 0;
  for (const empire of activeEmpires) {
    const area = areas.get(empire.id) ?? 0;
    if (area > dominantArea) {
      dominantArea = area;
      dominantEmpire = empire;
    }
  }

  return {
    activeEmpires,
    dominantEmpire,
    comparativeSizes,
  };
}
