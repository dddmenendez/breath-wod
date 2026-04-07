import Header from '@/shared/components/Header'

function ShoppingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Lista de Compras" />
      <main className="flex-1 px-4 pt-4">
        <p className="text-text-muted">Lista de compras — próximamente</p>
      </main>
    </div>
  )
}

export default ShoppingPage
