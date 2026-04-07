import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Timer, UtensilsCrossed, ShoppingCart, Pill } from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/fasting', label: 'Ayuno', icon: Timer },
  { path: '/menu', label: 'Menú', icon: UtensilsCrossed },
  { path: '/shopping', label: 'Compras', icon: ShoppingCart },
  { path: '/supplements', label: 'Suplem.', icon: Pill },
]

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-bg-elevated bg-bg-surface pb-safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-text-dim'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
