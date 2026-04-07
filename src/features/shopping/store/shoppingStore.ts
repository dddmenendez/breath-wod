import { create } from 'zustand'
import { db } from '@/db/database'
import { generateShoppingList } from '../utils/generateList'

import type { ShoppingItem } from '../types/shopping.types'
import type { DayMenu } from '@/features/menu/types/menu.types'

interface ShoppingState {
  items: ShoppingItem[]
  loading: boolean
  error: string | null

  loadWeek: (weekId: string) => Promise<void>
  generateFromMenu: (weekId: string, menus: DayMenu[]) => Promise<void>
  toggleChecked: (id: number) => Promise<void>
  addManualItem: (item: Omit<ShoppingItem, 'id'>) => Promise<void>
  removeItem: (id: number) => Promise<void>
  clearWeek: (weekId: string) => Promise<void>
  clearError: () => void
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  loadWeek: async (weekId) => {
    set({ loading: true, error: null })
    try {
      const items = await db.shopping.where('weekId').equals(weekId).toArray()
      set({ items, loading: false })
    } catch (err) {
      console.error('[shoppingStore] loadWeek failed', err)
      set({ error: 'No se pudo cargar la lista', loading: false })
    }
  },

  generateFromMenu: async (weekId, menus) => {
    set({ loading: true, error: null })
    try {
      await db.shopping.where('weekId').equals(weekId).delete()

      const generated = generateShoppingList(menus, weekId)
      await db.shopping.bulkAdd(generated)

      const items = await db.shopping.where('weekId').equals(weekId).toArray()
      set({ items, loading: false })
    } catch (err) {
      console.error('[shoppingStore] generateFromMenu failed', err)
      set({ error: 'No se pudo generar la lista', loading: false })
    }
  },

  toggleChecked: async (id) => {
    set({ error: null })
    try {
      const item = get().items.find((i) => i.id === id)
      if (!item) return

      const checked = !item.checked
      await db.shopping.update(id, { checked })

      set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, checked } : i,
        ),
      }))
    } catch (err) {
      console.error('[shoppingStore] toggleChecked failed', err)
      set({ error: 'No se pudo actualizar el ítem' })
    }
  },

  addManualItem: async (item) => {
    set({ error: null })
    try {
      const id = await db.shopping.add(item as ShoppingItem)
      set((state) => ({ items: [...state.items, { ...item, id }] }))
    } catch (err) {
      console.error('[shoppingStore] addManualItem failed', err)
      set({ error: 'No se pudo añadir el ítem' })
    }
  },

  removeItem: async (id) => {
    set({ error: null })
    try {
      await db.shopping.delete(id)
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
    } catch (err) {
      console.error('[shoppingStore] removeItem failed', err)
      set({ error: 'No se pudo eliminar el ítem' })
    }
  },

  clearWeek: async (weekId) => {
    set({ error: null })
    try {
      await db.shopping.where('weekId').equals(weekId).delete()
      set({ items: [] })
    } catch (err) {
      console.error('[shoppingStore] clearWeek failed', err)
      set({ error: 'No se pudo limpiar la lista' })
    }
  },

  clearError: () => set({ error: null }),
}))
