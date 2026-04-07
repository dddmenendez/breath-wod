import { useEffect } from 'react'
import Header from '@/shared/components/Header'
import { useNotifications } from '@/shared/hooks/useNotifications'
import { useFastingStore } from './store/fastingStore'
import { useFastingTimer } from './hooks/useFastingTimer'
import FastingTimer from './components/FastingTimer'
import FastingControls from './components/FastingControls'
import FastingStreak from './components/FastingStreak'
import FastingHistory from './components/FastingHistory'

function FastingPage() {
  const current = useFastingStore((s) => s.current)
  const history = useFastingStore((s) => s.history)
  const streak = useFastingStore((s) => s.streak)
  const loading = useFastingStore((s) => s.loading)
  const error = useFastingStore((s) => s.error)
  const loadCurrent = useFastingStore((s) => s.loadCurrent)
  const loadHistory = useFastingStore((s) => s.loadHistory)
  const computeStreak = useFastingStore((s) => s.computeStreak)

  const { isComplete } = useFastingTimer(current)
  const { permission, requestPermission } = useNotifications()

  useEffect(() => {
    loadCurrent()
    loadHistory()
    computeStreak()
  }, [loadCurrent, loadHistory, computeStreak])

  useEffect(() => {
    if (permission === 'default') {
      requestPermission()
    }
  }, [permission, requestPermission])

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Ayuno" />

      <main className="flex flex-1 flex-col items-center gap-6 px-4 pt-4">
        {loading && (
          <p className="text-text-muted">Cargando...</p>
        )}

        {error && (
          <div className="w-full rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && current && (
          <FastingTimer session={current} />
        )}

        <FastingControls current={current} isComplete={isComplete} />

        <FastingStreak streak={streak} />

        {history.length > 0 && (
          <div className="w-full">
            <FastingHistory history={history} />
          </div>
        )}
      </main>
    </div>
  )
}

export default FastingPage
