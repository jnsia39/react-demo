import { create } from 'zustand';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function clampPan(offset: { x: number; y: number }, zoom: number) {
  const baseW = 640,
    baseH = 360;
  const scaledW = baseW * zoom,
    scaledH = baseH * zoom;
  const maxX = Math.max(0, (scaledW - baseW) / 2);
  const maxY = Math.max(0, (scaledH - baseH) / 2);
  return {
    x: Math.max(-maxX, Math.min(maxX, offset.x)),
    y: Math.max(-maxY, Math.min(maxY, offset.y)),
  };
}

interface VideoState {
  zoom: number;
  setZoom: (z: number) => void;
  panOffset: { x: number; y: number };
  setPanOffset: (o: { x: number; y: number }) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  finalRect: Rect | null;
  setFinalRect: (r: Rect | null) => void;
  resetAll: () => void;
}

export const useVideoStore = create<VideoState>((set /*, get */) => ({
  zoom: 1,
  setZoom: (z) =>
    set((state) => ({
      zoom: z,
      panOffset: clampPan(state.panOffset, z),
    })),
  panOffset: { x: 0, y: 0 },
  setPanOffset: (o) => set({ panOffset: o }),
  editMode: false,
  setEditMode: (v) => set({ editMode: v }),
  finalRect: null,
  setFinalRect: (r) => set({ finalRect: r }),
  resetAll: () =>
    set({
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      editMode: false,
      finalRect: null,
    }),
}));
