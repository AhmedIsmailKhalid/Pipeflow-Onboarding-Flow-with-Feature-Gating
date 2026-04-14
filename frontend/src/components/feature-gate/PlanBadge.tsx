import { Plan } from '@/types/plan.types'
import { PLAN_LABELS, PLAN_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PlanBadgeProps {
  plan: Plan
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        PLAN_COLORS[plan],
        className
      )}
    >
      {PLAN_LABELS[plan]}
    </span>
  )
}