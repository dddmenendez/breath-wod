import type { ShoppingItem } from '@/features/shopping/types/shopping.types'

export const stapleItems: Omit<ShoppingItem, 'id' | 'weekId'>[] = [
  { name: 'Sal', amount: 1, unit: 'paquete', category: 'extra', checked: false, isStaple: true },
  { name: 'Aceite de oliva', amount: 1, unit: 'botella', category: 'fat', checked: false, isStaple: true },
  { name: 'Pimienta de cayena', amount: 1, unit: 'bote', category: 'extra', checked: false, isStaple: true },
  { name: 'Vinagre', amount: 1, unit: 'botella', category: 'extra', checked: false, isStaple: true },
  { name: 'Café', amount: 1, unit: 'paquete', category: 'extra', checked: false, isStaple: true },
]
