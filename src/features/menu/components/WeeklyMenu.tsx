import MealCard from './MealCard'

import type { DayMenu } from '../types/menu.types'

interface WeeklyMenuProps {
  days: DayMenu[]
  todayDayOfWeek: number
  onToggleMeal: (dayOfWeek: number, mealType: string) => void
}

function WeeklyMenu({ days, todayDayOfWeek, onToggleMeal }: WeeklyMenuProps) {
  return (
    <div className="flex flex-col gap-6">
      {days.map((day) => {
        const isToday = day.dayOfWeek === todayDayOfWeek

        return (
          <section key={day.dayOfWeek}>
            <h3
              className={`mb-2 text-sm font-semibold ${
                isToday ? 'text-primary' : 'text-text-muted'
              }`}
            >
              {day.dayName}
              {isToday && (
                <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                  Hoy
                </span>
              )}
            </h3>
            <div className="flex flex-col gap-2">
              {day.meals.map((meal) => (
                <MealCard
                  key={meal.type}
                  meal={meal}
                  onToggle={() => onToggleMeal(day.dayOfWeek, meal.type)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default WeeklyMenu
