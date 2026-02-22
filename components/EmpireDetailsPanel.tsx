"use client";

import { useEffect, useRef } from "react";
import { useTimelineStore } from "@/store/useTimelineStore";
import { formatYear } from "@/lib/timeUtils";

export default function EmpireDetailsPanel() {
  const selectedEmpire = useTimelineStore((s) => s.selectedEmpire);
  const setSelectedEmpire = useTimelineStore((s) => s.setSelectedEmpire);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setSelectedEmpire(null);
      }
    }

    if (selectedEmpire) {
      // Delay attaching to avoid capturing the triggering click
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClick);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClick);
      };
    }
  }, [selectedEmpire, setSelectedEmpire]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedEmpire(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [setSelectedEmpire]);

  return (
    <div
      ref={panelRef}
      className={`
        fixed top-0 right-0 h-full w-full max-w-md z-30
        transform transition-transform duration-300 ease-out
        ${selectedEmpire ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="h-full bg-gray-950/90 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
        {selectedEmpire && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedEmpire.name}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  {formatYear(selectedEmpire.startYear)} —{" "}
                  {formatYear(selectedEmpire.endYear)}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmpire(null)}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close panel"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </button>
            </div>

            {/* Color bar */}
            <div
              className="h-1 w-16 rounded-full mb-6"
              style={{ backgroundColor: selectedEmpire.color }}
            />

            {/* Capital */}
            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">
                Capital
              </h3>
              <p className="text-white/90">{selectedEmpire.capital}</p>
            </section>

            {/* Description */}
            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">
                Overview
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {selectedEmpire.description ?? "—"}
              </p>
            </section>

            {/* Rulers */}
            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                Notable Rulers
              </h3>
              <div className="space-y-2">
                {(selectedEmpire.rulers ?? []).map((ruler) => (
                  <div
                    key={`${ruler.name}-${ruler.reignStart}`}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-white/90">
                      {ruler.name}
                    </span>
                    <span className="text-xs text-white/40 tabular-nums">
                      {formatYear(ruler.reignStart)} — {formatYear(ruler.reignEnd)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Events */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                Key Events
              </h3>
              <div className="relative pl-4 border-l border-white/10">
                {(selectedEmpire.events ?? []).map((event) => (
                  <div key={`${event.year}-${event.description}`} className="mb-4 last:mb-0">
                    <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-gray-950" />
                    <p className="text-xs font-medium text-white/50 tabular-nums mb-0.5">
                      {formatYear(event.year)}
                    </p>
                    <p className="text-sm text-white/70">{event.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
