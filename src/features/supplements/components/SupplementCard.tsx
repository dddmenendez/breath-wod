import { Check, Info } from 'lucide-react'

import type { SupplementLog } from '../types/supplement.types'

interface SupplementCardProps {
  log: SupplementLog
  onToggle: () => void
  onInfo: () => void
}

function SupplementCard({ log, onToggle, onInfo }: SupplementCardProps) {
  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation()
    onInfo()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter') onToggle() }}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors active:bg-bg-elevated"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          log.taken ? 'bg-primary' : 'border border-text-muted'
        }`}
      >
        {log.taken && <Check size={12} className="text-bg" />}
      </span>

      <div className="flex-1">
        <span className={`text-sm ${log.taken ? 'text-text-dim line-through' : 'text-text'}`}>
          {log.name}
        </span>
        <span className="ml-2 text-xs text-text-dim">{log.dose}</span>
      </div>

      <button
        type="button"
        onClick={handleInfo}
        className="shrink-0 p-1 text-text-dim transition-colors hover:text-primary"
        aria-label={`Info sobre ${log.name}`}
      >
        <Info size={16} />
      </button>
    </div>
  )
}

export default SupplementCard
