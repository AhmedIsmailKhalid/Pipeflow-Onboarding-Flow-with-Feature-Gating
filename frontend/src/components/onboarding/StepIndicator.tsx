import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ONBOARDING_STEPS_STARTER, ONBOARDING_STEPS_FULL } from '@/lib/constants'

interface StepIndicatorProps {
  currentStep: number
  completedSteps: number[]
  isStarterPlan: boolean
}

export function StepIndicator({
  currentStep,
  completedSteps,
  isStarterPlan,
}: StepIndicatorProps) {
  const steps = isStarterPlan ? ONBOARDING_STEPS_STARTER : ONBOARDING_STEPS_FULL

  // Map machine step numbers to visual step numbers for Starter
  // Starter: machine step 4 = visual step 3, machine step 5 = visual step 4
  function getVisualStep(machineStep: number): number {
    if (!isStarterPlan) return machineStep
    if (machineStep <= 2) return machineStep
    if (machineStep === 4) return 3
    if (machineStep === 5) return 4
    return machineStep
  }

  const visualCurrentStep = getVisualStep(currentStep)
  const visualCompletedSteps = completedSteps
    .map(getVisualStep)
    .filter((s) => s > 0)

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = visualCompletedSteps.includes(step.step)
        const isCurrent = visualCurrentStep === step.step

        return (
          <div key={step.step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: isCompleted
                    ? '#4f46e5'
                    : isCurrent
                    ? '#ffffff'
                    : '#f1f5f9',
                  borderColor: isCompleted
                    ? '#4f46e5'
                    : isCurrent
                    ? '#4f46e5'
                    : '#e2e8f0',
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center',
                  'text-xs font-semibold transition-colors'
                )}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white text-sm"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span className={cn(isCurrent ? 'text-brand-600' : 'text-slate-400')}>
                    {step.step}
                  </span>
                )}
              </motion.div>

              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isCompleted || isCurrent ? 'text-slate-700' : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="w-8 sm:w-16 h-px mx-1 mb-5">
                <motion.div
                  animate={{
                    backgroundColor: visualCompletedSteps.includes(step.step)
                      ? '#4f46e5'
                      : '#e2e8f0',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '1px' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}