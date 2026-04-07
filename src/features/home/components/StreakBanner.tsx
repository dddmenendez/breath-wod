import { Flame } from 'lucide-react'

interface StreakBannerProps {
  streak: number
}

function StreakBanner({ streak }: StreakBannerProps) {
  if (streak === 0) return null

  return (
    <div className="flex items-center gap-3 rounded-xl bg-accent/10 px-4 py-3">
      <Flame size={24} className="text-accent" />
      <div>
        <p className="text-lg font-bold text-text">
          {streak} {streak === 1 ? 'día' : 'días'} de racha
        </p>
        <p className="text-xs text-text-muted">Sigue así con tus ayunos</p>
      </div>
    </div>
  )
}

export default StreakBanner
