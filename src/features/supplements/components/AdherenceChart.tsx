interface AdherenceChartProps {
  adherence: number
}

function getColor(value: number): string {
  if (value >= 80) return 'bg-success'
  if (value >= 50) return 'bg-warning'
  return 'bg-danger'
}

function getTextColor(value: number): string {
  if (value >= 80) return 'text-success'
  if (value >= 50) return 'text-warning'
  return 'text-danger'
}

function AdherenceChart({ adherence }: AdherenceChartProps) {
  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Adherencia (7 días)</h3>
        <span className={`text-sm font-bold ${getTextColor(adherence)}`}>
          {adherence}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-bg-elevated">
        <div
          className={`h-full rounded-full transition-all ${getColor(adherence)}`}
          style={{ width: `${Math.min(100, adherence)}%` }}
        />
      </div>
    </div>
  )
}

export default AdherenceChart
