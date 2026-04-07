// CANONICAL TEMPLATE — copy and adapt.
// Do NOT import this file. Use it as a reference when creating new stores.
//
// Pattern: Zustand store with Dexie persistence.
// Replace "Example" with the feature name (e.g., "Fasting", "Menu").

import { create } from 'zustand';
import { db } from '@/db/database';
import type { ExampleRecord, ExampleInput } from '../types/example.types';

interface ExampleState {
  // --- Data (what the UI reads) ---
  items: ExampleRecord[];
  current: ExampleRecord | null;
  loading: boolean;
  error: string | null;

  // --- Actions (what the UI calls) ---
  load: () => Promise<void>;
  add: (input: ExampleInput) => Promise<void>;
  update: (id: number, patch: Partial<ExampleRecord>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  items: [],
  current: null,
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const items = await db.example.orderBy('createdAt').reverse().toArray();
      set({ items, loading: false });
    } catch (err) {
      console.error('[exampleStore] load failed', err);
      set({ error: 'No se pudieron cargar los datos', loading: false });
    }
  },

  add: async (input) => {
    set({ error: null });
    try {
      const record: ExampleRecord = {
        ...input,
        createdAt: new Date(),
      };
      const id = await db.example.add(record);
      set((state) => ({ items: [{ ...record, id }, ...state.items] }));
    } catch (err) {
      console.error('[exampleStore] add failed', err);
      set({ error: 'No se pudo guardar' });
    }
  },

  update: async (id, patch) => {
    set({ error: null });
    try {
      await db.example.update(id, patch);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      }));
    } catch (err) {
      console.error('[exampleStore] update failed', err);
      set({ error: 'No se pudo actualizar' });
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      await db.example.delete(id);
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch (err) {
      console.error('[exampleStore] remove failed', err);
      set({ error: 'No se pudo eliminar' });
    }
  },

  clearError: () => set({ error: null }),
}));
