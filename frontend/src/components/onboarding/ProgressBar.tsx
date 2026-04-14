import { motion } from 'framer-motion'

interface ProgressBarProps {
  percentage: number
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full h-1 rounded-full overflow-hidden bg-rust-200">
      <motion.div
        className="h-full bg-brand-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  )
}