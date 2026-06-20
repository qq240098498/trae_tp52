import { create } from 'zustand';
import type { Lens } from '../types';
import { generateId, getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils';

interface LensState {
  lenses: Lens[];
  loading: boolean;
  loadData: () => void;
  addLens: (lens: Omit<Lens, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLens: (id: string, lens: Partial<Lens>) => void;
  deleteLens: (id: string) => void;
  getLensById: (id: string) => Lens | undefined;
  updateStock: (id: string, change: number) => void;
  searchLenses: (keyword: string) => Lens[];
  getLowStockLenses: () => Lens[];
}

export const useLensStore = create<LensState>((set, get) => ({
  lenses: [],
  loading: false,

  loadData: () => {
    const lenses = getStorageItem<Lens[]>(STORAGE_KEYS.LENSES, []);
    set({ lenses });
  },

  addLens: (lens) => {
    const now = new Date().toISOString();
    const newLens: Lens = {
      ...lens,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const lenses = [...get().lenses, newLens];
    set({ lenses });
    setStorageItem(STORAGE_KEYS.LENSES, lenses);
  },

  updateLens: (id, lens) => {
    const now = new Date().toISOString();
    const lenses = get().lenses.map((l) =>
      l.id === id ? { ...l, ...lens, updatedAt: now } : l
    );
    set({ lenses });
    setStorageItem(STORAGE_KEYS.LENSES, lenses);
  },

  deleteLens: (id) => {
    const lenses = get().lenses.filter((l) => l.id !== id);
    set({ lenses });
    setStorageItem(STORAGE_KEYS.LENSES, lenses);
  },

  getLensById: (id) => {
    return get().lenses.find((l) => l.id === id);
  },

  updateStock: (id, change) => {
    const now = new Date().toISOString();
    const lenses = get().lenses.map((l) =>
      l.id === id ? { ...l, stock: Math.max(0, l.stock + change), updatedAt: now } : l
    );
    set({ lenses });
    setStorageItem(STORAGE_KEYS.LENSES, lenses);
  },

  searchLenses: (keyword) => {
    if (!keyword.trim()) return get().lenses;
    const lowerKeyword = keyword.toLowerCase();
    return get().lenses.filter(
      (l) =>
        l.brand.toLowerCase().includes(lowerKeyword) ||
        l.coating.toLowerCase().includes(lowerKeyword) ||
        l.type.toLowerCase().includes(lowerKeyword) ||
        l.refractiveIndex.toString().includes(keyword)
    );
  },

  getLowStockLenses: () => {
    return get().lenses.filter((l) => l.stock <= l.warningStock);
  },
}));
