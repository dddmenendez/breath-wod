import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

import type { FastingSession } from '../types/fasting.types'

interface FastingHistoryProps {
  history: FastingSession[]
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const DAYS_TO_SHOW = 30

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function buildDayGrid(history: FastingSession[]): DayCell[] {
  const days: DayCell[] = []
  const today = new Date()

  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const session = history.find((s) => isSameDay(s.startTime, date))
    days.push({ date, session: session ?? null })
  }

  return days
}

interface DayCell {
  date: Date
  session: FastingSession | null
}

function getCellColor(session: FastingSession | null): string {
  if (!session) return 'bg-bg-elevated'
  if (session.status === 'completed') return 'bg-success'
  if (session.status === 'broken') return 'bg-danger'
  return 'bg-accent'
}

function DetailModal({
  cell,
  onClose,
}: {
  cell: DayCell
  onClose: () => void
}) {
  const { date, session } = cell

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl bg-bg-surface p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize text-text">
            {formatDate(date)}
          </h3>
          <button type="button" onClick={onClose} className="text-text-dim">
            <X size={20} />
          </button>
        </div>

        {!session ? (
          <p className="text-sm text-text-muted">Sin registro de ayuno</p>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Estado</span>
              <span className={`font-medium ${
                session.status === 'completed' ? 'text-success' : 'text-danger'
              }`}>
                {session.status === 'completed' ? 'Completado' : 'Roto'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Objetivo</span>
              <span className="text-text">{session.targetHours}h</span>
            </div>
            {session.actualHours !== undefined && (
              <div className="flex justify-between">
                <span className="text-text-muted">Duración real</span>
                <span className="text-text">
                  {formatHours(session.actualHours)}
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function FastingHistory({ history }: FastingHistoryProps) {
  const [selectedCell, setSelectedCell] = useState<DayCell | null>(null)
  const days = buildDayGrid(history)

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-text">Últimos 30 días</h3>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <span
            key={label}
            className="text-center text-[10px] font-medium text-text-dim"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((cell) => (
          <button
            key={cell.date.toISOString()}
            type="button"
            onClick={() => setSelectedCell(cell)}
            className={`aspect-square rounded-md ${getCellColor(cell.session)} transition-colors`}
            aria-label={formatDate(cell.date)}
          />
        ))}
      </div>

      <div className="mt-3 flex gap-4 text-[10px] text-text-dim">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-success" />
          Completado
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-danger" />
          Roto
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-bg-elevated" />
          Sin registro
        </span>
      </div>

      <AnimatePresence>
        {selectedCell && (
          <DetailModal
            cell={selectedCell}
            onClose={() => setSelectedCell(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default FastingHistory
