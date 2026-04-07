import { Flame } from 'lucide-react'

interface FastingStreakProps {
  streak: number
}

function FastingStreak({ streak }: FastingStreakProps) {
  if (streak === 0) return null

  return (
    <div className="flex items-center gap-2 rounded-xl bg-bg-surface px-4 py-3">
      <Flame size={20} className="text-accent" />
      <span className="text-sm font-semibold text-text">
        {streak} {streak === 1 ? 'día' : 'días'}
      </span>
      <span className="text-sm text-text-muted">de racha</span>
    </div>
  )
}

export default FastingStreak
