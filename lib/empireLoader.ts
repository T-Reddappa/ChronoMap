import type { Empire, EmpireGeometry } from "./types";
import type { Polygon, MultiPolygon, Position } from "geojson";
import { empires as legacyEmpires } from "./empires";

const MANIFEST_URL = "/data/empires/manifest.json";
const EMPIRE_BASE = "/data/empires";

/** Ids that have a dedicated JSON file (time-sliced); others come from legacy static data. */
const HAS_JSON = new Set(["roman-empire"]);

export interface ManifestEntry {
  id: string;
  startYear: number;
  endYear: number;
  name?: string;
  era?: string;
}

let manifestCache: ManifestEntry[] | null = null;
const cache = new Map<string, Empire>();
const loading = new Map<string, Promise<Empire>>();

let onLoadComplete: (() => void) | null = null;

export function setOnLoadComplete(cb: (() => void) | null): void {
  onLoadComplete = cb;
}

// ── Area precompute (shoelace) ─────────────────────────────────────────────

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

function featureCollectionArea(geojson: EmpireGeometry["geojson"]): number {
  let total = 0;
  for (const feature of geojson.features) {
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

// ── Manifest ───────────────────────────────────────────────────────────────

export async function loadManifest(): Promise<ManifestEntry[]> {
  if (manifestCache) return manifestCache;
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`);
  manifestCache = (await res.json()) as ManifestEntry[];
  return manifestCache;
}

/** Synchronous: returns manifest if already loaded; otherwise empty array. */
export function getManifestSync(): ManifestEntry[] {
  return manifestCache ?? [];
}

/** Call after loadManifest() to get visible empire ids for a year. Falls back to legacy list when manifest not yet loaded. */
export function getVisibleIds(year: number): string[] {
  const manifest = getManifestSync();
  if (manifest.length > 0) {
    return manifest
      .filter((e) => e.startYear <= year && year <= e.endYear)
      .map((e) => e.id);
  }
  return legacyEmpires
    .filter((e) => e.startYear <= year && year <= e.endYear)
    .map((e) => e.id);
}

// ── Legacy adapter ─────────────────────────────────────────────────────────

function legacyToEmpire(legacy: (typeof legacyEmpires)[number]): Empire {
  const geojson = legacy.geojson!;
  const slice: EmpireGeometry = {
    startYear: legacy.startYear,
    endYear: legacy.endYear,
    geojson,
  };
  return {
    id: legacy.id,
    name: legacy.name,
    startYear: legacy.startYear,
    endYear: legacy.endYear,
    capital: legacy.capital,
    color: legacy.color,
    description: legacy.description,
    rulers: legacy.rulers,
    events: legacy.events,
    geometries: [slice],
  };
}

// ── Cache get / load ───────────────────────────────────────────────────────

export function get(id: string): Empire | undefined {
  const cached = cache.get(id);
  if (cached) return cached;
  const legacy = legacyEmpires.find((e) => e.id === id);
  if (legacy && !HAS_JSON.has(id)) {
    const empire = legacyToEmpire(legacy);
    cache.set(id, empire);
    return empire;
  }
  return undefined;
}

export function load(id: string): Promise<Empire> {
  const cached = cache.get(id);
  if (cached) return Promise.resolve(cached);
  const existing = loading.get(id);
  if (existing) return existing;

  const promise = (async (): Promise<Empire> => {
    const res = await fetch(`${EMPIRE_BASE}/${id}.json`);
    if (!res.ok) throw new Error(`Failed to load empire ${id}: ${res.status}`);
    const raw = (await res.json()) as {
      id: string;
      name: string;
      capital: string;
      color: string;
      era?: string;
      description?: string;
      geometries: Array<{
        startYear: number;
        endYear: number;
        geojson: EmpireGeometry["geojson"];
      }>;
    };
    const geometries: EmpireGeometry[] = raw.geometries.map((g) => ({
      startYear: g.startYear,
      endYear: g.endYear,
      geojson: g.geojson,
      precomputedArea: featureCollectionArea(g.geojson),
    }));
    const startYear = Math.min(...geometries.map((g) => g.startYear));
    const endYear = Math.max(...geometries.map((g) => g.endYear));
    const empire: Empire = {
      id: raw.id,
      name: raw.name,
      capital: raw.capital,
      color: raw.color,
      startYear,
      endYear,
      era: raw.era as Empire["era"],
      description: raw.description,
      geometries,
    };
    cache.set(id, empire);
    loading.delete(id);
    onLoadComplete?.();
    return empire;
  })();
  loading.set(id, promise);
  return promise;
}
