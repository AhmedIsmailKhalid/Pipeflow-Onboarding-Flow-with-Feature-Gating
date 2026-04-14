import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GateReason } from '@/lib/featureFlags'
import { Plan } from '@/types/plan.types'
import { PLAN_LABELS } from '@/lib/constants'

interface LockedOverlayProps {
  reason: GateReason
  requiredPlan?: Plan
  requiredStep?: number
  label: string
  onClick: () => void
  className?: string
}

export function LockedOverlay({
  reason,
  requiredPlan,
  requiredStep,
  label,
  onClick,
  className,
}: LockedOverlayProps) {
  const message =
    reason === 'plan'
      ? `Upgrade to ${PLAN_LABELS[requiredPlan!]} to unlock ${label}`
      : `Complete Step ${requiredStep} to unlock ${label}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center gap-3',
        'bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-700 text-center max-w-48 leading-snug">
        {message}
      </p>
      <span className="text-xs text-brand-600 font-semibold">
        {reason === 'plan' ? 'Upgrade plan →' : 'Continue setup →'}
      </span>
    </motion.div>
  )
}