import { useNavigate } from 'react-router-dom'
import { Timer, UtensilsCrossed, Pill, Play } from 'lucide-react'
import { useFastingTimer } from '@/features/fasting/hooks/useFastingTimer'

import type { FastingSession } from '@/features/fasting/types/fasting.types'
import type { DayMenu } from '@/features/menu/types/menu.types'
import type { SupplementLog } from '@/features/supplements/types/supplement.types'

interface TodaySummaryProps {
  currentFast: FastingSession | null
  todayMenu: DayMenu | undefined
  todaySupplements: SupplementLog[]
}

function TodaySummary({ currentFast, todayMenu, todaySupplements }: TodaySummaryProps) {
  const navigate = useNavigate()
  const { remainingFormatted, isComplete } = useFastingTimer(currentFast)

  const pendingSupplements = todaySupplements.filter((s) => !s.taken).length
  const nextMeal = todayMenu?.meals.find((m) => !m.completed)

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => navigate('/fasting')}
        className="flex items-center gap-3 rounded-xl bg-bg-surface p-4 text-left transition-colors active:bg-bg-elevated"
      >
        <Timer size={20} className="shrink-0 text-primary" />
        <div className="flex-1">
          {currentFast ? (
            <>
              <p className="text-sm font-semibold text-text">
                {isComplete ? 'Objetivo alcanzado' : `${remainingFormatted} restantes`}
              </p>
              <p className="text-xs text-text-muted">
                Ayuno de {currentFast.targetHours}h en curso
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Play size={14} className="text-primary" />
              <p className="text-sm font-medium text-primary">Empezar ayuno</p>
            </div>
          )}
        </div>
      </button>

      {nextMeal && (
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="flex items-center gap-3 rounded-xl bg-bg-surface p-4 text-left transition-colors active:bg-bg-elevated"
        >
          <UtensilsCrossed size={20} className="shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold text-text">Próxima comida</p>
            <p className="text-xs text-text-muted">{nextMeal.name}</p>
          </div>
        </button>
      )}

      <button
        type="button"
        onClick={() => navigate('/supplements')}
        className="flex items-center gap-3 rounded-xl bg-bg-surface p-4 text-left transition-colors active:bg-bg-elevated"
      >
        <Pill size={20} className="shrink-0 text-success" />
        <div>
          <p className="text-sm font-semibold text-text">Suplementos</p>
          <p className="text-xs text-text-muted">
            {pendingSupplements > 0
              ? `${pendingSupplements} pendiente${pendingSupplements > 1 ? 's' : ''}`
              : 'Todo tomado hoy'}
          </p>
        </div>
      </button>
    </div>
  )
}

export default TodaySummary
