import { useEffect } from 'react'
import Header from '@/shared/components/Header'
import { useFastingStore } from '@/features/fasting/store/fastingStore'
import { useMenuStore, getTodayMenu } from '@/features/menu/store/menuStore'
import { useSupplementStore } from '@/features/supplements/store/supplementStore'
import TodaySummary from './components/TodaySummary'
import QuickActions from './components/QuickActions'
import StreakBanner from './components/StreakBanner'

const DEFAULT_WEEK_ID = 'default'

function HomePage() {
  const currentFast = useFastingStore((s) => s.current)
  const streak = useFastingStore((s) => s.streak)
  const loadCurrent = useFastingStore((s) => s.loadCurrent)
  const computeStreak = useFastingStore((s) => s.computeStreak)

  const weekMenus = useMenuStore((s) => s.weekMenus)
  const loadMenuWeek = useMenuStore((s) => s.loadWeek)

  const todaySupplements = useSupplementStore((s) => s.todayLogs)
  const loadSupplements = useSupplementStore((s) => s.loadToday)

  useEffect(() => {
    loadCurrent()
    computeStreak()
    loadMenuWeek(DEFAULT_WEEK_ID)
    loadSupplements()
  }, [loadCurrent, computeStreak, loadMenuWeek, loadSupplements])

  const todayMenu = getTodayMenu(weekMenus)

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="A.R.M. Protocol" />

      <main className="flex flex-col gap-4 px-4 pt-4">
        <StreakBanner streak={streak} />

        <TodaySummary
          currentFast={currentFast}
          todayMenu={todayMenu}
          todaySupplements={todaySupplements}
        />

        <QuickActions />
      </main>
    </div>
  )
}

export default HomePage
