import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";

export interface Ruler {
  name: string;
  reignStart: number;
  reignEnd: number;
}

export interface HistoricalEvent {
  year: number;
  description: string;
}

/** Time-sliced geometry for an empire (scalable model). */
export interface EmpireGeometry {
  startYear: number;
  endYear: number;
  geojson: FeatureCollection<Polygon | MultiPolygon>;
  precomputedArea?: number;
}

export type EmpireEra = "ancient" | "medieval" | "earlyModern";

/**
 * Empire: supports legacy (geojson + startYear/endYear) or scalable (geometries[]).
 * For filtering, startYear/endYear are always used (derived from geometries when loading).
 */
export interface Empire {
  id: string;
  name: string;
  startYear: number; // BCE as negative
  endYear: number;
  capital: string;
  description?: string;
  color: string;
  /** Legacy: single geometry; omit when using geometries[]. */
  geojson?: FeatureCollection<Polygon | MultiPolygon>;
  /** Scalable: multiple time slices; used when present. */
  geometries?: EmpireGeometry[];
  era?: EmpireEra;
  rulers?: Ruler[];
  events?: HistoricalEvent[];
  metadata?: Record<string, unknown>;
}

/** Place with time-varying names (e.g. Byzantium → Constantinople → Istanbul). */
export interface HistoricalPlace {
  id: string;
  coordinates: [number, number];
  names: { startYear: number; endYear: number; name: string }[];
}

/**
 * Future-proofing: layers that can be toggled independently on the map.
 * Religion, trade routes, etc. will be separate layer types.
 */
export type MapLayerType = "empires" | "religion" | "trade_routes";

export interface MapLayer {
  type: MapLayerType;
  visible: boolean;
}
