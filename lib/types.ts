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

export interface Empire {
  id: string;
  name: string;
  startYear: number; // BCE as negative, e.g. 500 BCE = -500
  endYear: number;
  capital: string;
  description: string;
  color: string;
  geojson: FeatureCollection<Polygon | MultiPolygon>;
  rulers: Ruler[];
  events: HistoricalEvent[];
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
