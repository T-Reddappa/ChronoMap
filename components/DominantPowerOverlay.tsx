"use client";

import { useTimelineStore } from "@/store/useTimelineStore";
import { getVisibleEmpires, formatYear } from "@/lib/timeUtils";
import { empires } from "@/lib/empires";
import { getDominantEmpire } from "@/lib/territory";

function useDisplayYear(): number {
  return useTimelineStore((s) => Math.round(s.selectedYear));
}

export default function DominantPowerOverlay() {
  const year = useDisplayYear();
  const visible = getVisibleEmpires(empires, year);
  const count = visible.length;
  const dominant = getDominantEmpire(
    visible.map((e) => e.id),
    year
  );

  return (
    <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 min-w-[180px]">
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
            {dominant.empire.name}
          </p>
          <div className="flex items-center justify-between mt-1 text-xs text-white/50">
            <span>{dominant.yearsActive} yrs active</span>
            <span
              className="tabular-nums"
              title="Normalized territory index (1.0 = largest empire in dataset)"
            >
              TI {dominant.area.toFixed(2)}
            </span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500/60"
              style={{ width: `${dominant.area * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
