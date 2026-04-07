import { create } from 'zustand'
import { db } from '@/db/database'
import { defaultMenu } from '@/data/defaultMenu'

import type { DayMenu } from '../types/menu.types'

interface MenuState {
  weekMenus: DayMenu[]
  loading: boolean
  error: string | null

  loadWeek: (weekId: string) => Promise<void>
  toggleMealCompleted: (
    weekId: string,
    dayOfWeek: number,
    mealType: string,
  ) => Promise<void>
  clearError: () => void
}

function getTodayDayOfWeek(): number {
  return new Date().getDay()
}

export const useMenuStore = create<MenuState>((set, get) => ({
  weekMenus: [],
  loading: false,
  error: null,

  loadWeek: async (weekId) => {
    set({ loading: true, error: null })
    try {
      let menus = await db.menus.where('weekId').equals(weekId).toArray()

      if (menus.length === 0) {
        const toSeed = defaultMenu.map((day) => ({ ...day, weekId }))
        await db.menus.bulkAdd(toSeed)
        menus = await db.menus.where('weekId').equals(weekId).toArray()
      }

      set({ weekMenus: menus, loading: false })
    } catch (err) {
      console.error('[menuStore] loadWeek failed', err)
      set({ error: 'No se pudo cargar el menú', loading: false })
    }
  },

  toggleMealCompleted: async (weekId, dayOfWeek, mealType) => {
    set({ error: null })
    try {
      const day = get().weekMenus.find(
        (d) => d.weekId === weekId && d.dayOfWeek === dayOfWeek,
      )

      if (!day?.id) return

      const updatedMeals = day.meals.map((meal) =>
        meal.type === mealType
          ? { ...meal, completed: !meal.completed }
          : meal,
      )

      await db.menus.update(day.id, { meals: updatedMeals })

      set((state) => ({
        weekMenus: state.weekMenus.map((d) =>
          d.id === day.id ? { ...d, meals: updatedMeals } : d,
        ),
      }))
    } catch (err) {
      console.error('[menuStore] toggleMealCompleted failed', err)
      set({ error: 'No se pudo actualizar la comida' })
    }
  },

  clearError: () => set({ error: null }),
}))

export function getTodayMenu(weekMenus: DayMenu[]): DayMenu | undefined {
  return weekMenus.find((d) => d.dayOfWeek === getTodayDayOfWeek())
}

export function getWeekMenu(weekMenus: DayMenu[]): DayMenu[] {
  return [...weekMenus].sort((a, b) => {
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek
    return orderA - orderB
  })
}
