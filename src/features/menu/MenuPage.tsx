import { useEffect, useState } from 'react'
import Header from '@/shared/components/Header'
import { useMenuStore, getTodayMenu, getWeekMenu } from './store/menuStore'
import DailyView from './components/DailyView'
import WeeklyMenu from './components/WeeklyMenu'

type ViewMode = 'today' | 'week'

const DEFAULT_WEEK_ID = 'default'

function MenuPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const weekMenus = useMenuStore((s) => s.weekMenus)
  const loading = useMenuStore((s) => s.loading)
  const error = useMenuStore((s) => s.error)
  const loadWeek = useMenuStore((s) => s.loadWeek)
  const toggleMealCompleted = useMenuStore((s) => s.toggleMealCompleted)

  const todayDayOfWeek = new Date().getDay()

  useEffect(() => {
    loadWeek(DEFAULT_WEEK_ID)
  }, [loadWeek])

  const handleToggle = (dayOfWeek: number, mealType: string) => {
    toggleMealCompleted(DEFAULT_WEEK_ID, dayOfWeek, mealType)
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Menú Semanal" />

      <div className="flex gap-1 px-4 pb-3">
        <button
          type="button"
          onClick={() => setViewMode('today')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            viewMode === 'today'
              ? 'bg-primary text-bg'
              : 'bg-bg-surface text-text-muted'
          }`}
        >
          Hoy
        </button>
        <button
          type="button"
          onClick={() => setViewMode('week')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            viewMode === 'week'
              ? 'bg-primary text-bg'
              : 'bg-bg-surface text-text-muted'
          }`}
        >
          Semana
        </button>
      </div>

      <main className="flex-1 px-4">
        {loading && (
          <p className="text-text-muted">Cargando...</p>
        )}

        {error && (
          <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && viewMode === 'today' && (
          <DailyView
            day={getTodayMenu(weekMenus)}
            onToggleMeal={handleToggle}
          />
        )}

        {!loading && !error && viewMode === 'week' && (
          <WeeklyMenu
            days={getWeekMenu(weekMenus)}
            todayDayOfWeek={todayDayOfWeek}
            onToggleMeal={handleToggle}
          />
        )}
      </main>
    </div>
  )
}

export default MenuPage
