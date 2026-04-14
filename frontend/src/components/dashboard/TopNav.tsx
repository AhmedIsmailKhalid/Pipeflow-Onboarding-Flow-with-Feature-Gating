import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const PLAN_STYLES = {
  STARTER: 'bg-rust-100 text-rust-600 border-rust-300',
  GROWTH:  'bg-brand-50 text-brand-700 border-brand-200',
  SCALE:   'bg-brand-100 text-brand-800 border-brand-300',
}

export function TopNav() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { completedSteps } = useOnboardingStore()
  const onboardingIncomplete = !user?.onboardingComplete && completedSteps.length > 0

  return (
    <header className="h-11 border-b border-rust-200 bg-white flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        {onboardingIncomplete && (
          <button
            onClick={() => navigate('/onboarding')}
            className="hidden sm:flex items-center gap-1.5 text-2xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-sm hover:bg-amber-100 transition-colors"
          >
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse-dot" />
            Setup incomplete
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {user && (
          <span className={cn(
            'text-2xs font-semibold px-2 py-0.5 rounded-sm border capitalize',
            PLAN_STYLES[user.plan]
          )}>
            {user.plan.charAt(0) + user.plan.slice(1).toLowerCase()}
          </span>
        )}
      </div>
    </header>
  )
}