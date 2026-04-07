import { create } from 'zustand'
import { db } from '@/db/database'

import type { FastingSession } from '../types/fasting.types'

const HISTORY_LIMIT = 30

interface FastingState {
  current: FastingSession | null
  history: FastingSession[]
  streak: number
  loading: boolean
  error: string | null

  startFast: (targetHours: number) => Promise<void>
  breakFast: () => Promise<void>
  loadCurrent: () => Promise<void>
  loadHistory: () => Promise<void>
  computeStreak: () => Promise<void>
  clearError: () => void
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getPreviousDay(date: Date): Date {
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 1)
  return prev
}

export const useFastingStore = create<FastingState>((set, get) => ({
  current: null,
  history: [],
  streak: 0,
  loading: false,
  error: null,

  startFast: async (targetHours) => {
    set({ error: null })
    try {
      const session: FastingSession = {
        startTime: new Date(),
        targetHours,
        status: 'active',
      }
      const id = await db.fasting.add(session)
      const created = { ...session, id }
      set({ current: created })
    } catch (err) {
      console.error('[fastingStore] startFast failed', err)
      set({ error: 'No se pudo iniciar el ayuno' })
    }
  },

  breakFast: async () => {
    const { current } = get()
    if (!current?.id) return

    set({ error: null })
    try {
      const endTime = new Date()
      const elapsed = endTime.getTime() - current.startTime.getTime()
      const actualHours = elapsed / (1000 * 60 * 60)
      const reachedTarget = actualHours >= current.targetHours
      const status = reachedTarget ? 'completed' : 'broken'

      await db.fasting.update(current.id, {
        endTime,
        actualHours,
        status,
      })

      const finished = { ...current, endTime, actualHours, status } as FastingSession
      set({ current: null })
      set((state) => ({ history: [finished, ...state.history] }))

      await get().computeStreak()
    } catch (err) {
      console.error('[fastingStore] breakFast failed', err)
      set({ error: 'No se pudo romper el ayuno' })
    }
  },

  loadCurrent: async () => {
    set({ loading: true, error: null })
    try {
      const active = await db.fasting
        .where('status')
        .equals('active')
        .first()
      set({ current: active ?? null, loading: false })
    } catch (err) {
      console.error('[fastingStore] loadCurrent failed', err)
      set({ error: 'No se pudo cargar el ayuno actual', loading: false })
    }
  },

  loadHistory: async () => {
    set({ loading: true, error: null })
    try {
      const records = await db.fasting
        .orderBy('startTime')
        .reverse()
        .limit(HISTORY_LIMIT)
        .toArray()
      set({ history: records, loading: false })
    } catch (err) {
      console.error('[fastingStore] loadHistory failed', err)
      set({ error: 'No se pudo cargar el historial', loading: false })
    }
  },

  computeStreak: async () => {
    try {
      const records = await db.fasting
        .orderBy('startTime')
        .reverse()
        .toArray()

      let count = 0
      let checkDate = new Date()

      for (const record of records) {
        if (record.status !== 'completed') {
          if (isSameDay(record.startTime, checkDate)) continue
          break
        }

        if (isSameDay(record.startTime, checkDate)) {
          count++
          checkDate = getPreviousDay(checkDate)
        } else if (isSameDay(record.startTime, getPreviousDay(checkDate))) {
          count++
          checkDate = record.startTime
        } else {
          break
        }
      }

      set({ streak: count })
    } catch (err) {
      console.error('[fastingStore] computeStreak failed', err)
    }
  },

  clearError: () => set({ error: null }),
}))
