import ShoppingCategory from './ShoppingCategory'
import ShareButton from './ShareButton'

import type { ShoppingItem } from '../types/shopping.types'

interface ShoppingListProps {
  items: ShoppingItem[]
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

const CATEGORY_ORDER = ['protein', 'carb', 'fat', 'vegetable', 'extra', 'supplement']

function groupByCategory(items: ShoppingItem[]): Map<string, ShoppingItem[]> {
  const grouped = new Map<string, ShoppingItem[]>()
  for (const item of items) {
    const list = grouped.get(item.category) ?? []
    list.push(item)
    grouped.set(item.category, list)
  }
  return grouped
}

function ShoppingList({ items, onToggle, onRemove }: ShoppingListProps) {
  const grouped = groupByCategory(items)
  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped.has(c))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <ShareButton items={items} />
      </div>

      {sortedCategories.map((category) => (
        <ShoppingCategory
          key={category}
          category={category}
          items={grouped.get(category)!}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

export default ShoppingList
