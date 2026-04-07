import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, StopCircle, X } from 'lucide-react'
import { useFastingStore } from '../store/fastingStore'

import type { FastingSession } from '../types/fasting.types'

interface FastingControlsProps {
  current: FastingSession | null
  isComplete: boolean
}

const TARGET_OPTIONS = [14, 15, 16, 32] as const

function DurationSelector({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (hours: number) => void
}) {
  return (
    <div className="flex gap-2">
      {TARGET_OPTIONS.map((hours) => (
        <button
          key={hours}
          type="button"
          onClick={() => onSelect(hours)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            selected === hours
              ? 'bg-primary text-bg'
              : 'bg-bg-elevated text-text-muted'
          }`}
        >
          {hours}h
        </button>
      ))}
    </div>
  )
}

function ConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
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
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Romper ayuno</h3>
          <button type="button" onClick={onCancel} className="text-text-dim">
            <X size={20} />
          </button>
        </div>
        <p className="mb-6 text-sm text-text-muted">
          No has alcanzado tu objetivo todavía. ¿Seguro que quieres romper el ayuno?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-bg-elevated py-3 text-sm font-medium text-text"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-danger py-3 text-sm font-medium text-white"
          >
            Romper ayuno
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FastingControls({ current, isComplete }: FastingControlsProps) {
  const [targetHours, setTargetHours] = useState(16)
  const [showConfirm, setShowConfirm] = useState(false)
  const startFast = useFastingStore((state) => state.startFast)
  const breakFast = useFastingStore((state) => state.breakFast)

  const handleStart = () => {
    startFast(targetHours)
  }

  const handleBreak = () => {
    if (isComplete) {
      breakFast()
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmBreak = () => {
    setShowConfirm(false)
    breakFast()
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-4">
        <DurationSelector selected={targetHours} onSelect={setTargetHours} />
        <button
          type="button"
          onClick={handleStart}
          className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-bg transition-colors active:bg-primary-dark"
        >
          <Play size={22} />
          Empezar ayuno
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleBreak}
        className={`flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold transition-colors ${
          isComplete
            ? 'bg-success text-bg active:bg-success/80'
            : 'bg-danger text-white active:bg-danger/80'
        }`}
      >
        <StopCircle size={22} />
        {isComplete ? 'Finalizar ayuno' : 'Romper ayuno'}
      </button>

      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            onConfirm={handleConfirmBreak}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default FastingControls
