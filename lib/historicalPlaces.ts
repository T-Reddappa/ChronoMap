import type { FeatureCollection, Point } from "geojson";
import type { HistoricalPlace } from "./types";

/**
 * Returns the place name valid at the given year.
 * Uses the first matching name range (startYear <= year <= endYear).
 */
export function getNameForYear(place: HistoricalPlace, year: number): string {
  for (const n of place.names) {
    if (n.startYear <= year && year <= n.endYear) return n.name;
  }
  return "";
}

/**
 * Builds a GeoJSON FeatureCollection of points for map display.
 * Only includes places that have a name at the given year.
 */
export function buildPlacesGeoJSON(
  places: HistoricalPlace[],
  year: number
): FeatureCollection<Point> {
  const features = places
    .map((place) => {
      const name = getNameForYear(place, year);
      if (!name) return null;
      return {
        type: "Feature" as const,
        properties: { name },
        geometry: {
          type: "Point" as const,
          coordinates: place.coordinates,
        },
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  return {
    type: "FeatureCollection",
    features,
  };
}

const PLACES_URL = "/data/places/cities.json";
let placesCache: HistoricalPlace[] | null = null;

export async function loadPlaces(): Promise<HistoricalPlace[]> {
  if (placesCache) return placesCache;
  const res = await fetch(PLACES_URL);
  if (!res.ok) return [];
  placesCache = (await res.json()) as HistoricalPlace[];
  return placesCache;
}

export function getPlacesSync(): HistoricalPlace[] {
  return placesCache ?? [];
}
