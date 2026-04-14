import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useOnboardingMachine } from '@/hooks/useOnboardingMachine'
import { usePersistProgress } from '@/hooks/usePersistProgress'
import { ProgressBar } from './ProgressBar'
import { StepIndicator } from './StepIndicator'
import { Step1Profile } from './steps/Step1Profile'
import { Step2Workspace } from './steps/Step2Workspace'
import { Step3Integrations } from './steps/Step3Integrations'
import { Step4Tour } from './steps/Step4Tour'
import { Step5Complete } from './steps/Step5Complete'
import { getOnboardingPercentage } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
}

export function OnboardingShell() {
  const navigate = useNavigate()
  const { state, send, context, currentStep, completedSteps, isComplete } =
    useOnboardingMachine()

  usePersistProgress({ state, context })

  // Small delay before navigating so the final sync in usePersistProgress
  // has time to push completedSteps into the feature store
  useEffect(() => {
    if (!isComplete) return
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true })
    }, 300)
    return () => clearTimeout(timer)
  }, [isComplete, navigate])

  if (state.matches('idle') || state.matches('restoredStep')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const percentage = getOnboardingPercentage(completedSteps)
  const direction = 1

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1Profile send={send} context={context} />,
    2: <Step2Workspace send={send} context={context} />,
    3: <Step3Integrations send={send} context={context} />,
    4: <Step4Tour send={send} context={context} />,
    5: <Step5Complete context={context} />,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-slate-900">Pipeflow</span>
        </div>
        <span className="text-sm text-slate-500">
          Step {currentStep} of 5
        </span>
      </header>

      <div className="px-6 pt-6 pb-2 max-w-2xl mx-auto w-full">
        <ProgressBar percentage={percentage} />
        <div className="mt-6">
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}