import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useAuthStore } from '@/stores/auth.store'
import { getOnboardingPercentage, getNextIncompleteStep } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function ResumeBanner() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { completedSteps } = useOnboardingStore()

  // Don't show if onboarding is marked complete in the database
  if (user?.onboardingComplete) return null

  // Don't show if no progress yet
  if (completedSteps.length === 0) return null

  const percentage = getOnboardingPercentage(completedSteps)
  const nextStep = getNextIncompleteStep(completedSteps)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 flex items-center gap-4"
    >
      {/* Progress ring */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke="#e0e7ff"
            strokeWidth="3"
          />
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeDasharray={`${percentage} ${100 - percentage}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-600">
          {percentage}%
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          Finish setting up Pipeflow
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Continue from Step {nextStep} — you're {percentage}% done
        </p>
      </div>

      <Button
        size="sm"
        onClick={() => navigate('/onboarding')}
        className="flex-shrink-0"
      >
        Continue setup
      </Button>
    </motion.div>
  )
}