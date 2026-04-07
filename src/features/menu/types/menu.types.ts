type MealType = 'bone-broth' | 'meal1' | 'meal2'

type IngredientCategory = 'protein' | 'carb' | 'fat' | 'vegetable' | 'extra'

export interface Ingredient {
  name: string
  amount: number
  unit: string
  category: IngredientCategory
}

export interface Meal {
  type: MealType
  name: string
  ingredients: Ingredient[]
  tags: string[]
  completed: boolean
}

export interface DayMenu {
  id?: number
  weekId: string
  dayOfWeek: number
  dayName: string
  meals: Meal[]
  userId?: string
}
