import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import MealDetail from './MealDetail'

import type { Meal } from '../types/menu.types'

interface MealCardProps {
  meal: Meal
  onToggle: () => void
}

function MealCard({ meal, onToggle }: MealCardProps) {
  const [expanded, setExpanded] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded((prev) => !prev)}
      className="w-full rounded-xl bg-bg-surface p-4 text-left transition-colors"
    >
      <div className="flex items-center gap-3">
        <span
          onClick={handleToggle}
          role="checkbox"
          aria-checked={meal.completed}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
            meal.completed ? 'bg-primary' : 'border border-text-muted'
          }`}
        >
          {meal.completed && <Check size={14} className="text-bg" />}
        </span>

        <div className="flex-1">
          <h4
            className={`text-sm font-semibold ${
              meal.completed ? 'text-text-dim line-through' : 'text-text'
            }`}
          >
            {meal.name}
          </h4>
          <div className="mt-1 flex gap-1.5">
            {meal.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-text-dim transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      <AnimatePresence>
        {expanded && <MealDetail ingredients={meal.ingredients} />}
      </AnimatePresence>
    </button>
  )
}

export default MealCard
