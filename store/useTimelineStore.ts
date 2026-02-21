import { create } from "zustand";
import type { Empire, MapLayer } from "@/lib/types";

interface TimelineState {
  /** Float during playback (e.g. 68.42), integer on manual slider drag. */
  selectedYear: number;
  selectedEmpire: Empire | null;
  layers: MapLayer[];
  isPlaying: boolean;
  /** Continuous playback rate in years per second. */
  playbackSpeed: number;
  /** When true, camera tracks visible empires cinematically. */
  focusMode: boolean;
  /** Radial vignette overlay for cinematic atmosphere. */
  cinematicAtmosphere: boolean;

  setSelectedYear: (year: number) => void;
  setSelectedEmpire: (empire: Empire | null) => void;
  toggleLayer: (type: MapLayer["type"]) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleFocusMode: () => void;
  toggleCinematicAtmosphere: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  selectedYear: 0,
  selectedEmpire: null,
  layers: [{ type: "empires", visible: true }],
  isPlaying: false,
  playbackSpeed: 50,
  focusMode: false,
  cinematicAtmosphere: true,

  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedEmpire: (empire) => set({ selectedEmpire: empire }),
  toggleLayer: (type) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.type === type ? { ...l, visible: !l.visible } : l
      ),
    })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  toggleCinematicAtmosphere: () =>
    set((state) => ({ cinematicAtmosphere: !state.cinematicAtmosphere })),
}));
