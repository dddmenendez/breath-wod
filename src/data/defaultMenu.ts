import type { DayMenu } from '@/features/menu/types/menu.types'

const WEEK_ID = 'default'

export const defaultMenu: DayMenu[] = [
  {
    weekId: WEEK_ID,
    dayOfWeek: 1,
    dayName: 'Lunes',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + arroz + aceite de oliva',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Arroz blanco', amount: 150, unit: 'g', category: 'carb' },
          { name: 'Aceite de oliva', amount: 15, unit: 'ml', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: '3 hamburguesas + boniato + aguacate',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Carne de hamburguesa', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Boniato', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Aguacate', amount: 1, unit: 'unidad', category: 'fat' },
        ],
      },
    ],
  },
  {
    weekId: WEEK_ID,
    dayOfWeek: 2,
    dayName: 'Martes',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + patatas + mantequilla',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Patatas', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Mantequilla', amount: 15, unit: 'g', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: 'Salmón + patatas + aguacate',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Salmón', amount: 200, unit: 'g', category: 'protein' },
          { name: 'Patatas', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Aguacate', amount: 1, unit: 'unidad', category: 'fat' },
        ],
      },
    ],
  },
  {
    weekId: WEEK_ID,
    dayOfWeek: 3,
    dayName: 'Miércoles',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + arroz + aceite de oliva',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Arroz blanco', amount: 150, unit: 'g', category: 'carb' },
          { name: 'Aceite de oliva', amount: 15, unit: 'ml', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: 'Bistec + boniato + mantequilla',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Bistec', amount: 250, unit: 'g', category: 'protein' },
          { name: 'Boniato', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Mantequilla', amount: 15, unit: 'g', category: 'fat' },
        ],
      },
    ],
  },
  {
    weekId: WEEK_ID,
    dayOfWeek: 4,
    dayName: 'Jueves',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + boniato + aceite de oliva',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Boniato', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Aceite de oliva', amount: 15, unit: 'ml', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: 'Carne picada + arroz + aguacate',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Carne picada', amount: 250, unit: 'g', category: 'protein' },
          { name: 'Arroz blanco', amount: 150, unit: 'g', category: 'carb' },
          { name: 'Aguacate', amount: 1, unit: 'unidad', category: 'fat' },
        ],
      },
    ],
  },
  {
    weekId: WEEK_ID,
    dayOfWeek: 5,
    dayName: 'Viernes',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + patatas + mantequilla',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Patatas', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Mantequilla', amount: 15, unit: 'g', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: 'Hígado + patatas + cebolla',
        tags: ['proteína', 'carbohidrato', 'vegetal'],
        completed: false,
        ingredients: [
          { name: 'Hígado', amount: 200, unit: 'g', category: 'protein' },
          { name: 'Patatas', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Cebolla', amount: 1, unit: 'unidad', category: 'vegetable' },
        ],
      },
    ],
  },
  {
    weekId: WEEK_ID,
    dayOfWeek: 6,
    dayName: 'Sábado',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + arroz + aceite de oliva',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Arroz blanco', amount: 150, unit: 'g', category: 'carb' },
          { name: 'Aceite de oliva', amount: 15, unit: 'ml', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: 'Bistec + boniato + aguacate',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Bistec', amount: 250, unit: 'g', category: 'protein' },
          { name: 'Boniato', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Aguacate', amount: 1, unit: 'unidad', category: 'fat' },
        ],
      },
    ],
  },
  {
    weekId: WEEK_ID,
    dayOfWeek: 0,
    dayName: 'Domingo',
    meals: [
      {
        type: 'bone-broth',
        name: 'Caldo de huesos',
        tags: ['recuperación'],
        completed: false,
        ingredients: [
          { name: 'Caldo de huesos', amount: 250, unit: 'ml', category: 'protein' },
          { name: 'Pimienta de cayena', amount: 1, unit: 'pizca', category: 'extra' },
        ],
      },
      {
        type: 'meal1',
        name: 'Huevos + boniato + aceite de oliva',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Huevos', amount: 3, unit: 'unidades', category: 'protein' },
          { name: 'Boniato', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Aceite de oliva', amount: 15, unit: 'ml', category: 'fat' },
        ],
      },
      {
        type: 'meal2',
        name: 'Salmón + patatas + mantequilla',
        tags: ['proteína', 'carbohidrato', 'grasa'],
        completed: false,
        ingredients: [
          { name: 'Salmón', amount: 200, unit: 'g', category: 'protein' },
          { name: 'Patatas', amount: 200, unit: 'g', category: 'carb' },
          { name: 'Mantequilla', amount: 15, unit: 'g', category: 'fat' },
        ],
      },
    ],
  },
]
