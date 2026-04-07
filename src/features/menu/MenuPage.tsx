import Header from '@/shared/components/Header'

function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Menú Semanal" />
      <main className="flex-1 px-4 pt-4">
        <p className="text-text-muted">Menú semanal — próximamente</p>
      </main>
    </div>
  )
}

export default MenuPage
