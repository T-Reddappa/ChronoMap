import type { Empire } from "./types";
import * as empireLoader from "./empireLoader";
import { buildCoexistenceReport } from "./coexistenceEngine";

export interface YearReport {
  year: number;
  activeEmpires: Empire[];
  dominantEmpire?: Empire;
  coexistenceSummary?: string;
  globalFact?: string;
}

/** Predefined curated facts by year range. Deterministic, not AI-generated. */
const GLOBAL_FACTS: Array<{ startYear: number; endYear: number; fact: string }> = [
  { startYear: -500, endYear: -401, fact: "Iron Age civilizations span continents." },
  { startYear: -400, endYear: -301, fact: "Classical Mediterranean and South Asian states rise." },
  { startYear: -300, endYear: -201, fact: "Hellenistic and Mauryan influence peaks." },
  { startYear: -200, endYear: -101, fact: "Roman and Han expansion reshape Eurasia." },
  { startYear: -100, endYear: 100, fact: "Largest territorial extents in their eras." },
  { startYear: 101, endYear: 300, fact: "Imperial consolidation and trade corridors." },
  { startYear: 301, endYear: 500, fact: "Late antiquity and major migrations." },
  { startYear: 501, endYear: 800, fact: "Post-Roman and Tang-era power centers." },
  { startYear: 801, endYear: 1100, fact: "Medieval empires and trade networks." },
  { startYear: 1101, endYear: 1400, fact: "Crusades, Mongols, and maritime trade." },
  { startYear: 1401, endYear: 1600, fact: "Age of exploration and gunpowder empires." },
  { startYear: 1601, endYear: 1900, fact: "Colonial and industrial age boundaries." },
];

function getGlobalFactForYear(year: number): string | undefined {
  for (const entry of GLOBAL_FACTS) {
    if (entry.startYear <= year && year <= entry.endYear) return entry.fact;
  }
  return undefined;
}

/**
 * Generates a deterministic year report using lazy-loaded empires.
 * Synchronous: only uses already-cached empire data (empireLoader.get).
 * No React, no Mapbox. Safe to run on every integer year change.
 */
export function generateYearReport(year: number): YearReport {
  const intYear = Math.floor(year);
  const visibleIds = empireLoader.getVisibleIds(intYear);
  const activeEmpires: Empire[] = [];

  for (const id of visibleIds) {
    const empire = empireLoader.get(id);
    if (empire) activeEmpires.push(empire);
  }

  const report: YearReport = {
    year: intYear,
    activeEmpires,
  };

  if (activeEmpires.length === 0) {
    report.globalFact = getGlobalFactForYear(intYear);
    return report;
  }

  const coexistence = buildCoexistenceReport(activeEmpires, intYear);
  if (coexistence.dominantEmpire) {
    report.dominantEmpire = coexistence.dominantEmpire;
  }

  if (activeEmpires.length >= 2) {
    const names = activeEmpires.map((e) => e.name).join(" and ");
    report.coexistenceSummary =
      activeEmpires.length === 2
        ? `${names} coexist.`
        : `${activeEmpires.length} powers active.`;
  }

  report.globalFact = getGlobalFactForYear(intYear);
  return report;
}
