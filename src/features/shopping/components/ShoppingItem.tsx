import { Check, Trash2 } from 'lucide-react'

import type { ShoppingItem as ShoppingItemType } from '../types/shopping.types'

interface ShoppingItemProps {
  item: ShoppingItemType
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

function ShoppingItem({ item, onToggle, onRemove }: ShoppingItemProps) {
  const handleToggle = () => {
    if (item.id !== undefined) onToggle(item.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.id !== undefined) onRemove(item.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => { if (e.key === 'Enter') handleToggle() }}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors active:bg-bg-elevated"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          item.checked ? 'bg-primary' : 'border border-text-muted'
        }`}
      >
        {item.checked && <Check size={12} className="text-bg" />}
      </span>

      <div className="flex-1">
        <span className={`text-sm ${item.checked ? 'text-text-dim line-through' : 'text-text'}`}>
          {item.name}
        </span>
        <span className="ml-2 text-xs text-text-dim">
          {item.amount} {item.unit}
        </span>
        {item.isStaple && (
          <span className="ml-2 text-[10px] text-accent">despensa</span>
        )}
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className="shrink-0 p-1 text-text-dim transition-colors hover:text-danger"
        aria-label={`Eliminar ${item.name}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default ShoppingItem
