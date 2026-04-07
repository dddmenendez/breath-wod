import { useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import Header from '@/shared/components/Header'
import { useMenuStore } from '@/features/menu/store/menuStore'
import { useShoppingStore } from './store/shoppingStore'
import ShoppingList from './components/ShoppingList'

const DEFAULT_WEEK_ID = 'default'

function ShoppingPage() {
  const items = useShoppingStore((s) => s.items)
  const loading = useShoppingStore((s) => s.loading)
  const error = useShoppingStore((s) => s.error)
  const loadWeek = useShoppingStore((s) => s.loadWeek)
  const generateFromMenu = useShoppingStore((s) => s.generateFromMenu)
  const toggleChecked = useShoppingStore((s) => s.toggleChecked)
  const removeItem = useShoppingStore((s) => s.removeItem)
  const weekMenus = useMenuStore((s) => s.weekMenus)
  const loadMenuWeek = useMenuStore((s) => s.loadWeek)

  useEffect(() => {
    loadMenuWeek(DEFAULT_WEEK_ID)
    loadWeek(DEFAULT_WEEK_ID)
  }, [loadMenuWeek, loadWeek])

  const handleGenerate = () => {
    generateFromMenu(DEFAULT_WEEK_ID, weekMenus)
  }

  const isEmpty = !loading && items.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-20">
      <Header title="Lista de Compras" />

      <main className="flex-1 px-4 pt-4">
        {loading && (
          <p className="text-text-muted">Cargando...</p>
        )}

        {error && (
          <div className="mb-3 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center gap-4 pt-16">
            <ShoppingCart size={48} className="text-text-dim" />
            <p className="text-center text-sm text-text-muted">
              Genera la lista desde el menú semanal
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-bg transition-colors active:bg-primary-dark"
            >
              Generar lista
            </button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <ShoppingList
            items={items}
            onToggle={toggleChecked}
            onRemove={removeItem}
          />
        )}
      </main>
    </div>
  )
}

export default ShoppingPage
