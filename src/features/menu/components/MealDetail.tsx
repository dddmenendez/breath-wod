import { motion } from 'framer-motion'

import type { Ingredient } from '../types/menu.types'

interface MealDetailProps {
  ingredients: Ingredient[]
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    protein: 'Proteína',
    carb: 'Carbohidrato',
    fat: 'Grasa',
    vegetable: 'Vegetal',
    extra: 'Extra',
  }
  return labels[category] ?? category
}

function MealDetail({ ingredients }: MealDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <ul className="mt-3 flex flex-col gap-2 border-t border-bg-elevated pt-3">
        {ingredients.map((ing) => (
          <li key={ing.name} className="flex items-center justify-between text-sm">
            <span className="text-text">{ing.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">
                {ing.amount} {ing.unit}
              </span>
              <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-dim">
                {categoryLabel(ing.category)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default MealDetail
