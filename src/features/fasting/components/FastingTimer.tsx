import ProgressRing from '@/shared/components/ProgressRing'
import { useFastingTimer } from '../hooks/useFastingTimer'

import type { FastingSession } from '../types/fasting.types'

interface FastingTimerProps {
  session: FastingSession
}

function FastingTimer({ session }: FastingTimerProps) {
  const {
    progress,
    isComplete,
    elapsedFormatted,
    remainingFormatted,
  } = useFastingTimer(session)

  const percentage = Math.round(progress * 100)

  return (
    <div className="flex flex-col items-center gap-4">
      <ProgressRing
        progress={progress}
        color={isComplete ? 'var(--color-success, #22c55e)' : undefined}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-bold text-text">
            {isComplete ? remainingFormatted : remainingFormatted}
          </span>
          <span className="text-sm text-text-muted">
            {isComplete ? '¡Objetivo alcanzado!' : 'restantes'}
          </span>
        </div>
      </ProgressRing>

      <div className="flex gap-6 text-sm text-text-muted">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-text">{elapsedFormatted}</span>
          <span>transcurrido</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-text">{percentage}%</span>
          <span>completado</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-text">{session.targetHours}h</span>
          <span>objetivo</span>
        </div>
      </div>
    </div>
  )
}

export default FastingTimer
