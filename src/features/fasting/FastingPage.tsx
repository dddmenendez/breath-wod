import Header from '@/shared/components/Header'

function FastingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Ayuno" />
      <main className="flex-1 px-4 pt-4">
        <p className="text-text-muted">Timer de ayuno — próximamente</p>
      </main>
    </div>
  )
}

export default FastingPage
