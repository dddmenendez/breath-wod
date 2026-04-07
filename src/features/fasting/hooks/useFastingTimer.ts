import { useEffect, useState } from 'react'

import type { FastingSession } from '../types/fasting.types'

interface UseFastingTimerReturn {
  elapsedMs: number
  remainingMs: number
  progress: number
  isComplete: boolean
  elapsedFormatted: string
  remainingFormatted: string
}

function formatTime(ms: number): string {
  const totalMinutes = Math.floor(Math.abs(ms) / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function useFastingTimer(session: FastingSession | null): UseFastingTimerReturn {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!session || session.status !== 'active') return

    const id = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(id)
    }
  }, [session])

  if (!session || session.status !== 'active') {
    return {
      elapsedMs: 0,
      remainingMs: 0,
      progress: 0,
      isComplete: false,
      elapsedFormatted: '0h 00m',
      remainingFormatted: '0h 00m',
    }
  }

  const startTime = session.startTime instanceof Date
    ? session.startTime
    : new Date(session.startTime)
  const startMs = startTime.getTime()
  const targetMs = session.targetHours * 60 * 60 * 1000
  const elapsedMs = now - startMs
  const remainingMs = Math.max(0, targetMs - elapsedMs)
  const progress = Math.min(1, elapsedMs / targetMs)
  const isComplete = elapsedMs >= targetMs

  return {
    elapsedMs,
    remainingMs,
    progress,
    isComplete,
    elapsedFormatted: formatTime(elapsedMs),
    remainingFormatted: formatTime(remainingMs),
  }
}
