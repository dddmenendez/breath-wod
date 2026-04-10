import { create } from 'zustand'
import { db } from '@/db/database'
import {
  scheduleNotification,
  cancelScheduledNotification,
} from '@/shared/utils/notifications'

import type { FastingSession } from '../types/fasting.types'

const NOTIF_WARNING_ID = 'fasting-warning'
const NOTIF_TARGET_ID = 'fasting-target'

const HISTORY_LIMIT = 30

function ensureDate(value: Date | string | number): Date {
  if (value instanceof Date) return value
  return new Date(value)
}

function normalizeSession(session: FastingSession): FastingSession {
  return {
    ...session,
    startTime: ensureDate(session.startTime),
    endTime: session.endTime ? ensureDate(session.endTime) : undefined,
  }
}

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

      const targetMs = targetHours * 60 * 60 * 1000
      const warningMs = targetMs - 30 * 60 * 1000

      if (warningMs > 0) {
        scheduleNotification({
          id: NOTIF_WARNING_ID,
          title: 'A.R.M. Protocol',
          body: '¡Faltan 30 minutos para completar tu ayuno!',
          at: new Date(session.startTime.getTime() + warningMs),
        })
      }

      scheduleNotification({
        id: NOTIF_TARGET_ID,
        title: 'A.R.M. Protocol',
        body: '¡Objetivo de ayuno alcanzado! 💪',
        at: new Date(session.startTime.getTime() + targetMs),
      })
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
      const startTime = ensureDate(current.startTime)
      const elapsed = endTime.getTime() - startTime.getTime()
      const actualHours = elapsed / (1000 * 60 * 60)
      const reachedTarget = actualHours >= current.targetHours
      const status = reachedTarget ? 'completed' : 'broken'

      await db.fasting.update(current.id, {
        endTime,
        actualHours,
        status,
      })

      cancelScheduledNotification(NOTIF_WARNING_ID)
      cancelScheduledNotification(NOTIF_TARGET_ID)

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
      set({ current: active ? normalizeSession(active) : null, loading: false })
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
      set({ history: records.map(normalizeSession), loading: false })
    } catch (err) {
      console.error('[fastingStore] loadHistory failed', err)
      set({ error: 'No se pudo cargar el historial', loading: false })
    }
  },

  computeStreak: async () => {
    try {
      const raw = await db.fasting
        .orderBy('startTime')
        .reverse()
        .toArray()
      const records = raw.map(normalizeSession)

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
