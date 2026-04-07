import { useNavigate } from 'react-router-dom'
import { Timer, UtensilsCrossed, ShoppingCart, Pill } from 'lucide-react'

interface QuickAction {
  path: string
  label: string
  icon: typeof Timer
}

const ACTIONS: QuickAction[] = [
  { path: '/fasting', label: 'Ayuno', icon: Timer },
  { path: '/menu', label: 'Menú', icon: UtensilsCrossed },
  { path: '/shopping', label: 'Compras', icon: ShoppingCart },
  { path: '/supplements', label: 'Suplementos', icon: Pill },
]

function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-4 gap-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.path}
            type="button"
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-1.5 rounded-xl bg-bg-surface py-3 transition-colors active:bg-bg-elevated"
          >
            <Icon size={22} className="text-primary" />
            <span className="text-[10px] font-medium text-text-muted">
              {action.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default QuickActions
