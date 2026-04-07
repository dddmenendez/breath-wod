import { create } from 'zustand'
import { db } from '@/db/database'
import { defaultSupplements } from '@/data/defaultSupplements'

import type { SupplementLog } from '../types/supplement.types'

interface SupplementState {
  todayLogs: SupplementLog[]
  adherence: number
  loading: boolean
  error: string | null

  loadToday: () => Promise<void>
  toggleTaken: (supplementId: string) => Promise<void>
  getAdherence: (days: number) => Promise<void>
  clearError: () => void
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

async function seedTodayLogs(date: string): Promise<void> {
  const logs: SupplementLog[] = defaultSupplements.map((s) => ({
    date,
    supplementId: s.id,
    name: s.name,
    dose: s.dose,
    timing: s.timing,
    taken: false,
  }))
  await db.supplements.bulkAdd(logs)
}

export const useSupplementStore = create<SupplementState>((set) => ({
  todayLogs: [],
  adherence: 0,
  loading: false,
  error: null,

  loadToday: async () => {
    set({ loading: true, error: null })
    try {
      const date = todayStr()
      let logs = await db.supplements.where('date').equals(date).toArray()

      if (logs.length === 0) {
        await seedTodayLogs(date)
        logs = await db.supplements.where('date').equals(date).toArray()
      }

      set({ todayLogs: logs, loading: false })
    } catch (err) {
      console.error('[supplementStore] loadToday failed', err)
      set({ error: 'No se pudieron cargar los suplementos', loading: false })
    }
  },

  toggleTaken: async (supplementId) => {
    set({ error: null })
    try {
      const date = todayStr()
      const log = await db.supplements
        .where('date')
        .equals(date)
        .filter((l) => l.supplementId === supplementId)
        .first()

      if (!log?.id) return

      const taken = !log.taken
      await db.supplements.update(log.id, { taken })

      set((state) => ({
        todayLogs: state.todayLogs.map((l) =>
          l.id === log.id ? { ...l, taken } : l,
        ),
      }))
    } catch (err) {
      console.error('[supplementStore] toggleTaken failed', err)
      set({ error: 'No se pudo actualizar el suplemento' })
    }
  },

  getAdherence: async (days) => {
    try {
      const today = new Date()
      const dates: string[] = []
      for (let i = 0; i < days; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        dates.push(d.toISOString().slice(0, 10))
      }

      const logs = await db.supplements
        .where('date')
        .anyOf(dates)
        .toArray()

      if (logs.length === 0) {
        set({ adherence: 0 })
        return
      }

      const takenCount = logs.filter((l) => l.taken).length
      const adherence = Math.round((takenCount / logs.length) * 100)
      set({ adherence })
    } catch (err) {
      console.error('[supplementStore] getAdherence failed', err)
    }
  },

  clearError: () => set({ error: null }),
}))
