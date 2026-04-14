import { Plan } from '@/types/plan.types'
import { cn } from '@/lib/utils'

const PLAN_STYLES: Record<Plan, string> = {
  STARTER: 'bg-rust-100 text-rust-600 border-rust-300',
  GROWTH:  'bg-brand-50 text-brand-700 border-brand-200',
  SCALE:   'bg-brand-100 text-brand-800 border-brand-300',
}

const PLAN_LABELS: Record<Plan, string> = {
  STARTER: 'Starter',
  GROWTH:  'Growth',
  SCALE:   'Scale',
}

interface PlanBadgeProps {
  plan: Plan
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-sm text-2xs font-semibold border capitalize',
      PLAN_STYLES[plan],
      className
    )}>
      {PLAN_LABELS[plan]}
    </span>
  )
}