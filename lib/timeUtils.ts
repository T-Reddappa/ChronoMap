import type { Empire } from "./types";

export const MIN_YEAR = -500;
export const MAX_YEAR = 1900;

export function formatYear(year: number): string {
  const y = Math.round(year);
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y === 0) return "1 BCE";
  return `${y} CE`;
}

export function isEmpireVisibleAtYear(empire: Empire, year: number): boolean {
  return empire.startYear <= year && year <= empire.endYear;
}

export function getVisibleEmpires(empires: Empire[], year: number): Empire[] {
  return empires.filter((e) => isEmpireVisibleAtYear(e, year));
}

/**
 * Convert a slider position (0–1) to a year in range [MIN_YEAR, MAX_YEAR].
 */
export function sliderToYear(ratio: number): number {
  return Math.round(MIN_YEAR + ratio * (MAX_YEAR - MIN_YEAR));
}

/**
 * Convert a year to slider position (0–1).
 */
export function yearToSlider(year: number): number {
  return (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR);
}
