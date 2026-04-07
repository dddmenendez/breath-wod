type FastingStatus = 'active' | 'completed' | 'broken'

export interface FastingSession {
  id?: number
  startTime: Date
  endTime?: Date
  targetHours: number
  actualHours?: number
  status: FastingStatus
  userId?: string
}
