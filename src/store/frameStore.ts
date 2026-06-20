import { create } from 'zustand';
import type { Frame } from '../types';
import { generateId, getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils';

interface FrameState {
  frames: Frame[];
  loading: boolean;
  loadData: () => void;
  addFrame: (frame: Omit<Frame, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFrame: (id: string, frame: Partial<Frame>) => void;
  deleteFrame: (id: string) => void;
  getFrameById: (id: string) => Frame | undefined;
  updateStock: (id: string, change: number) => void;
  searchFrames: (keyword: string) => Frame[];
  getLowStockFrames: () => Frame[];
}

export const useFrameStore = create<FrameState>((set, get) => ({
  frames: [],
  loading: false,

  loadData: () => {
    const frames = getStorageItem<Frame[]>(STORAGE_KEYS.FRAMES, []);
    set({ frames });
  },

  addFrame: (frame) => {
    const now = new Date().toISOString();
    const newFrame: Frame = {
      ...frame,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const frames = [...get().frames, newFrame];
    set({ frames });
    setStorageItem(STORAGE_KEYS.FRAMES, frames);
  },

  updateFrame: (id, frame) => {
    const now = new Date().toISOString();
    const frames = get().frames.map((f) =>
      f.id === id ? { ...f, ...frame, updatedAt: now } : f
    );
    set({ frames });
    setStorageItem(STORAGE_KEYS.FRAMES, frames);
  },

  deleteFrame: (id) => {
    const frames = get().frames.filter((f) => f.id !== id);
    set({ frames });
    setStorageItem(STORAGE_KEYS.FRAMES, frames);
  },

  getFrameById: (id) => {
    return get().frames.find((f) => f.id === id);
  },

  updateStock: (id, change) => {
    const now = new Date().toISOString();
    const frames = get().frames.map((f) =>
      f.id === id ? { ...f, stock: Math.max(0, f.stock + change), updatedAt: now } : f
    );
    set({ frames });
    setStorageItem(STORAGE_KEYS.FRAMES, frames);
  },

  searchFrames: (keyword) => {
    if (!keyword.trim()) return get().frames;
    const lowerKeyword = keyword.toLowerCase();
    return get().frames.filter(
      (f) =>
        f.brand.toLowerCase().includes(lowerKeyword) ||
        f.model.toLowerCase().includes(lowerKeyword) ||
        f.material.toLowerCase().includes(lowerKeyword) ||
        f.color.toLowerCase().includes(lowerKeyword)
    );
  },

  getLowStockFrames: () => {
    return get().frames.filter((f) => f.stock <= f.warningStock);
  },
}));
