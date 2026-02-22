import type { Empire, EmpireGeometry } from "./types";

/**
 * Returns the geometry slice active at the given year.
 * If multiple slices match (overlapping ranges), returns the first in array order.
 */
export function getActiveGeometry(
  empire: Empire,
  year: number
): EmpireGeometry | undefined {
  if (empire.geometries?.length) {
    return empire.geometries.find(
      (s) => s.startYear <= year && year <= s.endYear
    );
  }
  if (empire.geojson && empire.startYear <= year && year <= empire.endYear) {
    return {
      startYear: empire.startYear,
      endYear: empire.endYear,
      geojson: empire.geojson,
    };
  }
  return undefined;
}
