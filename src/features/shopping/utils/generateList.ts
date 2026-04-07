import { stapleItems } from '@/data/stapleItems'

import type { DayMenu } from '@/features/menu/types/menu.types'
import type { ShoppingItem } from '../types/shopping.types'

interface AggregatedItem {
  name: string
  amount: number
  unit: string
  category: string
}

const CATEGORY_ORDER: Record<string, number> = {
  protein: 0,
  carb: 1,
  fat: 2,
  vegetable: 3,
  extra: 4,
  supplement: 5,
}

function aggregateIngredients(menus: DayMenu[]): AggregatedItem[] {
  const map = new Map<string, AggregatedItem>()

  for (const day of menus) {
    for (const meal of day.meals) {
      for (const ing of meal.ingredients) {
        const key = `${ing.name}__${ing.unit}`
        const existing = map.get(key)

        if (existing) {
          existing.amount += ing.amount
        } else {
          map.set(key, {
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            category: ing.category,
          })
        }
      }
    }
  }

  return Array.from(map.values())
}

export function generateShoppingList(
  menus: DayMenu[],
  weekId: string,
): ShoppingItem[] {
  const aggregated = aggregateIngredients(menus)

  const ingredientItems: ShoppingItem[] = aggregated.map((item) => ({
    weekId,
    name: item.name,
    amount: item.amount,
    unit: item.unit,
    category: item.category as ShoppingItem['category'],
    checked: false,
    isStaple: false,
  }))

  const stapleNames = new Set(ingredientItems.map((i) => i.name))
  const filteredStaples: ShoppingItem[] = stapleItems
    .filter((s) => !stapleNames.has(s.name))
    .map((s) => ({ ...s, weekId }))

  const allItems = [...ingredientItems, ...filteredStaples]

  allItems.sort((a, b) => {
    const orderA = CATEGORY_ORDER[a.category] ?? 99
    const orderB = CATEGORY_ORDER[b.category] ?? 99
    if (orderA !== orderB) return orderA - orderB
    return a.name.localeCompare(b.name)
  })

  return allItems
}

// --- Verification (sample case) ---
//
// Given 7 days where each day has 3 eggs:
//   aggregateIngredients produces { name: 'Huevos', amount: 21, unit: 'unidades' }
//
// Given menus already include "Aceite de oliva" as ingredient:
//   stapleItems "Aceite de oliva" is NOT duplicated (filtered out by name)
//
// Output is sorted by category: protein → carb → fat → vegetable → extra
