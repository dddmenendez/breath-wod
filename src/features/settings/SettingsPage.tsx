import Header from '@/shared/components/Header'
import DataManagement from './components/DataManagement'

function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Ajustes" />
      <main className="flex-1 px-4 pt-4">
        <DataManagement />
      </main>
    </div>
  )
}

export default SettingsPage
