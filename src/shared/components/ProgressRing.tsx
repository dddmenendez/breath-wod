import { motion, useSpring, useTransform } from 'framer-motion'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  children?: React.ReactNode
}

function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 10,
  color = 'var(--color-primary, #84cc16)',
  trackColor = 'var(--color-bg-elevated, #334155)',
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const clampedProgress = Math.min(1, Math.max(0, progress))
  const springProgress = useSpring(clampedProgress, {
    stiffness: 200,
    damping: 30,
    duration: 0.3,
  })
  const strokeDashoffset = useTransform(
    springProgress,
    (p: number) => circumference * (1 - p),
  )

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>

      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

export default ProgressRing
