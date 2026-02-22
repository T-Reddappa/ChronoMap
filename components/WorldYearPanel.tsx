"use client";

import { useMemo } from "react";
import { useTimelineStore } from "@/store/useTimelineStore";
import { generateYearReport } from "@/lib/yearIntelligenceEngine";
import { formatYear } from "@/lib/timeUtils";

export default function WorldYearPanel() {
  const year = useTimelineStore((s) => Math.floor(s.selectedYear));
  const report = useMemo(() => generateYearReport(year), [year]);

  return (
    <div
      className="absolute bottom-24 left-4 z-10 max-w-[280px] rounded-xl bg-black/60 backdrop-blur-lg border border-white/10 px-4 py-3 transition-opacity duration-300"
      aria-live="polite"
    >
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
        World in {formatYear(year)}
      </p>
      {report.activeEmpires.length > 0 ? (
        <>
          <p className="text-xs text-white/70 mb-0.5">
            <span className="text-white/40">Active: </span>
            {report.activeEmpires.map((e) => e.name).join(" · ")}
          </p>
          {report.dominantEmpire && (
            <p className="text-xs text-white/70 mb-0.5">
              <span className="text-white/40">Dominant: </span>
              {report.dominantEmpire.name}
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-white/50">No empires in view.</p>
      )}
      {report.globalFact && (
        <p className="text-[11px] text-white/40 mt-1.5 border-t border-white/10 pt-1.5">
          {report.globalFact}
        </p>
      )}
    </div>
  );
}
