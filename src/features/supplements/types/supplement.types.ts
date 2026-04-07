type SupplementTiming = 'morning' | 'pre-workout' | 'post-workout' | 'night' | 'weekly'

export interface SupplementLog {
  id?: number
  date: string
  supplementId: string
  name: string
  dose: string
  timing: SupplementTiming
  taken: boolean
  userId?: string
}
