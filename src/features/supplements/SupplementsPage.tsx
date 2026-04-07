import { useEffect } from 'react'
import Header from '@/shared/components/Header'
import { useSupplementStore } from './store/supplementStore'
import SupplementTracker from './components/SupplementTracker'
import AdherenceChart from './components/AdherenceChart'

function SupplementsPage() {
  const todayLogs = useSupplementStore((s) => s.todayLogs)
  const adherence = useSupplementStore((s) => s.adherence)
  const loading = useSupplementStore((s) => s.loading)
  const error = useSupplementStore((s) => s.error)
  const loadToday = useSupplementStore((s) => s.loadToday)
  const toggleTaken = useSupplementStore((s) => s.toggleTaken)
  const getAdherence = useSupplementStore((s) => s.getAdherence)

  useEffect(() => {
    loadToday()
    getAdherence(7)
  }, [loadToday, getAdherence])

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Suplementos" />

      <main className="flex-1 px-4 pt-4">
        {loading && (
          <p className="text-text-muted">Cargando...</p>
        )}

        {error && (
          <div className="mb-3 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && (
          <div className="flex flex-col gap-4">
            <AdherenceChart adherence={adherence} />
            <SupplementTracker logs={todayLogs} onToggle={toggleTaken} />
          </div>
        )}
      </main>
    </div>
  )
}

export default SupplementsPage
