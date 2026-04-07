export interface SupplementDefinition {
  id: string
  name: string
  dose: string
  timing: 'morning' | 'pre-workout' | 'post-workout' | 'night' | 'weekly'
  purpose: string
  notes: string
}

export const defaultSupplements: SupplementDefinition[] = [
  {
    id: 'creatine-pre',
    name: 'Creatina monohidrato',
    dose: '5g',
    timing: 'pre-workout',
    purpose: 'Rendimiento muscular y energía celular',
    notes: 'Mezclar con agua. Tomar antes del entrenamiento.',
  },
  {
    id: 'creatine-night',
    name: 'Creatina monohidrato',
    dose: '10g',
    timing: 'night',
    purpose: 'Recuperación muscular y síntesis proteica nocturna',
    notes: 'Tomar antes de dormir con agua.',
  },
  {
    id: 'magnesium',
    name: 'Glicinato de magnesio',
    dose: '300–400mg',
    timing: 'night',
    purpose: 'Relajación muscular y calidad del sueño',
    notes: 'Tomar 30 minutos antes de dormir.',
  },
  {
    id: 'bicarb',
    name: 'Bicarbonato de sodio',
    dose: '0.5 cucharadita en agua',
    timing: 'post-workout',
    purpose: 'Equilibrio ácido-base post-ejercicio',
    notes: 'Diluir en un vaso grande de agua.',
  },
  {
    id: 'epsom',
    name: 'Sales de Epsom',
    dose: 'Baño de inmersión',
    timing: 'weekly',
    purpose: 'Recuperación muscular y absorción de magnesio transdérmica',
    notes: '1–2 veces por semana. Añadir al agua caliente del baño.',
  },
  {
    id: 'shilajit',
    name: 'Shilajit crudo',
    dose: 'Porción tamaño guisante',
    timing: 'morning',
    purpose: 'Minerales traza y ácido fúlvico para energía celular',
    notes: 'Disolver en agua tibia por la mañana.',
  },
  {
    id: 'bee-bread',
    name: 'Pan de abeja',
    dose: '1 cucharadita',
    timing: 'morning',
    purpose: 'Enzimas, vitaminas del grupo B y energía natural',
    notes: 'Tomar por la mañana en ayunas o con el desayuno.',
  },
]
