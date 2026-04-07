import MealCard from './MealCard'
import DigestProtocol from './DigestProtocol'

import type { DayMenu } from '../types/menu.types'

interface DailyViewProps {
  day: DayMenu | undefined
  onToggleMeal: (dayOfWeek: number, mealType: string) => void
}

function DailyView({ day, onToggleMeal }: DailyViewProps) {
  if (!day) {
    return (
      <p className="text-sm text-text-muted">No hay menú para hoy</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <DigestProtocol />
      {day.meals.map((meal) => (
        <MealCard
          key={meal.type}
          meal={meal}
          onToggle={() => onToggleMeal(day.dayOfWeek, meal.type)}
        />
      ))}
    </div>
  )
}

export default DailyView
