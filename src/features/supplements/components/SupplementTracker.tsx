import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sun, Dumbbell, Zap, Moon, CalendarDays } from 'lucide-react'
import SupplementCard from './SupplementCard'
import SupplementInfo from './SupplementInfo'

import type { SupplementLog } from '../types/supplement.types'

interface SupplementTrackerProps {
  logs: SupplementLog[]
  onToggle: (supplementId: string) => void
}

const TIMING_CONFIG: Record<string, { label: string; icon: typeof Sun }> = {
  morning: { label: 'Mañana', icon: Sun },
  'pre-workout': { label: 'Pre-entreno', icon: Dumbbell },
  'post-workout': { label: 'Post-entreno', icon: Zap },
  night: { label: 'Noche', icon: Moon },
  weekly: { label: 'Semanal', icon: CalendarDays },
}

const TIMING_ORDER = ['morning', 'pre-workout', 'post-workout', 'night', 'weekly']

function groupByTiming(logs: SupplementLog[]): Map<string, SupplementLog[]> {
  const grouped = new Map<string, SupplementLog[]>()
  for (const log of logs) {
    const list = grouped.get(log.timing) ?? []
    list.push(log)
    grouped.set(log.timing, list)
  }
  return grouped
}

function SupplementTracker({ logs, onToggle }: SupplementTrackerProps) {
  const [infoLog, setInfoLog] = useState<SupplementLog | null>(null)
  const grouped = groupByTiming(logs)
  const sortedTimings = TIMING_ORDER.filter((t) => grouped.has(t))

  return (
    <div className="flex flex-col gap-3">
      {sortedTimings.map((timing) => {
        const config = TIMING_CONFIG[timing] ?? { label: timing, icon: Sun }
        const Icon = config.icon
        const items = grouped.get(timing)!

        return (
          <div key={timing} className="rounded-xl bg-bg-surface">
            <div className="flex items-center gap-3 p-3">
              <Icon size={18} className="text-primary" />
              <span className="text-sm font-semibold text-text">
                {config.label}
              </span>
            </div>
            <div className="border-t border-bg-elevated px-1 pb-2">
              {items.map((log) => (
                <SupplementCard
                  key={log.supplementId}
                  log={log}
                  onToggle={() => onToggle(log.supplementId)}
                  onInfo={() => setInfoLog(log)}
                />
              ))}
            </div>
          </div>
        )
      })}

      <AnimatePresence>
        {infoLog && (
          <SupplementInfo log={infoLog} onClose={() => setInfoLog(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SupplementTracker
