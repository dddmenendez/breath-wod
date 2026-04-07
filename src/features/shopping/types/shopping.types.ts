type ShoppingCategory = 'protein' | 'carb' | 'fat' | 'vegetable' | 'extra' | 'supplement'

export interface ShoppingItem {
  id?: number
  weekId: string
  name: string
  amount: number
  unit: string
  category: ShoppingCategory
  checked: boolean
  isStaple: boolean
  userId?: string
}
