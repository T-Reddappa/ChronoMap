"use client";

import { useEffect, useState } from "react";
import { useTimelineStore } from "@/store/useTimelineStore";
import { formatYear } from "@/lib/timeUtils";
import * as empireLoader from "@/lib/empireLoader";
import { buildCoexistenceReport } from "@/lib/coexistenceEngine";

function useDisplayYear(): number {
  return useTimelineStore((s) => Math.round(s.selectedYear));
}

export default function DominantPowerOverlay() {
  const year = useDisplayYear();
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    empireLoader.loadManifest().then(() => {
      setDataReady(true);
    });
  }, []);

  const visibleIds = dataReady ? empireLoader.getVisibleIds(year) : [];
  const activeEmpires = visibleIds
    .map((id) => empireLoader.get(id))
    .filter((e): e is NonNullable<typeof e> => e != null);
  const report = buildCoexistenceReport(activeEmpires, year);
  const count = activeEmpires.length;
  const dominant = report.dominantEmpire;
  const dominantArea = dominant
    ? report.comparativeSizes.get(dominant.id) ?? 0
    : 0;
  const yearsActive = dominant ? year - dominant.startYear : 0;

  return (
    <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 min-w-[180px] shrink-0">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider">Year</p>
          <p className="text-sm font-bold text-white tabular-nums">
            {formatYear(year)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40 uppercase tracking-wider">
            Empires
          </p>
          <p className="text-sm font-bold text-white tabular-nums">{count}</p>
        </div>
      </div>

      {dominant && (
        <div className="border-t border-white/10 pt-2 mt-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
            Dominant Power
          </p>
          <p className="text-sm font-semibold text-white">
            {dominant.name}
          </p>
          <div className="flex items-center justify-between mt-1 text-xs text-white/50">
            <span>{yearsActive} yrs active</span>
            <span
              className="tabular-nums"
              title="Normalized territory index (1.0 = largest among visible)"
            >
              TI {dominantArea.toFixed(2)}
            </span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500/60"
              style={{ width: `${dominantArea * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
