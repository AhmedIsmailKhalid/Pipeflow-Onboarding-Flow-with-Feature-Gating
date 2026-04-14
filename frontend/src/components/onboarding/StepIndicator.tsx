import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ONBOARDING_STEPS_STARTER, ONBOARDING_STEPS_FULL } from '@/lib/constants'

interface StepIndicatorProps {
  currentStep: number
  completedSteps: number[]
  isStarterPlan: boolean
}

export function StepIndicator({ currentStep, completedSteps, isStarterPlan }: StepIndicatorProps) {
  const steps = isStarterPlan ? ONBOARDING_STEPS_STARTER : ONBOARDING_STEPS_FULL

  function getVisualStep(machineStep: number): number {
    if (!isStarterPlan) return machineStep
    if (machineStep <= 2) return machineStep
    if (machineStep === 4) return 3
    if (machineStep === 5) return 4
    return machineStep
  }

  const visualCurrentStep = getVisualStep(currentStep)
  const visualCompletedSteps = completedSteps.map(getVisualStep).filter((s) => s > 0)

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = visualCompletedSteps.includes(step.step)
        const isCurrent = visualCurrentStep === step.step

        return (
          <div key={step.step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: isCompleted ? '#0d9488' : isCurrent ? '#ffffff' : '#f0ecea',
                  borderColor:     isCompleted ? '#0d9488' : isCurrent ? '#0d9488' : '#d4ceca',
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold"
              >
                {isCompleted ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-sm">
                    ✓
                  </motion.span>
                ) : (
                  <span className={cn(isCurrent ? 'text-brand-600' : 'text-rust-400')}>
                    {step.step}
                  </span>
                )}
              </motion.div>

              <span className={cn(
                'text-xs font-medium hidden sm:block',
                isCompleted || isCurrent ? 'text-rust-700' : 'text-rust-400'
              )}>
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="w-8 sm:w-16 mx-1 mb-5" style={{ height: '1px' }}>
                <motion.div
                  animate={{ backgroundColor: visualCompletedSteps.includes(step.step) ? '#0d9488' : '#d4ceca' }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '1px', width: '100%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}