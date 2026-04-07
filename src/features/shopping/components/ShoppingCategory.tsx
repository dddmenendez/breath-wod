import { useState } from 'react'
import { ChevronDown, Beef, Wheat, Droplets, Salad, Package, Pill } from 'lucide-react'
import ShoppingItemComponent from './ShoppingItem'

import type { ShoppingItem } from '../types/shopping.types'

interface ShoppingCategoryProps {
  category: string
  items: ShoppingItem[]
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof Beef }> = {
  protein: { label: 'Proteínas', icon: Beef },
  carb: { label: 'Carbohidratos', icon: Wheat },
  fat: { label: 'Grasas', icon: Droplets },
  vegetable: { label: 'Vegetales', icon: Salad },
  extra: { label: 'Extras', icon: Package },
  supplement: { label: 'Suplementos', icon: Pill },
}

function ShoppingCategory({ category, items, onToggle, onRemove }: ShoppingCategoryProps) {
  const [expanded, setExpanded] = useState(true)
  const config = CATEGORY_CONFIG[category] ?? { label: category, icon: Package }
  const Icon = config.icon
  const checkedCount = items.filter((i) => i.checked).length

  return (
    <div className="rounded-xl bg-bg-surface">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 p-3"
      >
        <Icon size={18} className="text-primary" />
        <span className="flex-1 text-left text-sm font-semibold text-text">
          {config.label}
        </span>
        <span className="text-xs text-text-dim">
          {checkedCount}/{items.length}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-dim transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-bg-elevated px-1 pb-2">
          {items.map((item) => (
            <ShoppingItemComponent
              key={item.id}
              item={item}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShoppingCategory
