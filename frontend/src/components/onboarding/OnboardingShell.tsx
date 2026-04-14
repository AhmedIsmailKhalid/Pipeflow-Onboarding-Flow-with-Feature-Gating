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
  enter:  (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
}

export function OnboardingShell() {
  const navigate = useNavigate()
  const { state, send, context, currentStep, completedSteps, isComplete, isStarterPlan } =
    useOnboardingMachine()

  usePersistProgress({ state, context })

  useEffect(() => {
    if (!isComplete) return
    const t = setTimeout(() => navigate('/dashboard', { replace: true }), 300)
    return () => clearTimeout(t)
  }, [isComplete, navigate])

  if (state.matches('idle') || state.matches('restoredStep')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <Spinner size="lg" />
      </div>
    )
  }

  const totalSteps = isStarterPlan ? 4 : 5
  const percentage = getOnboardingPercentage(completedSteps, isStarterPlan)

  function getVisualStep(machineStep: number): number {
    if (!isStarterPlan) return machineStep
    if (machineStep <= 2) return machineStep
    if (machineStep === 4) return 3
    if (machineStep === 5) return 4
    return machineStep
  }

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1Profile send={send} context={context} />,
    2: <Step2Workspace send={send} context={context} />,
    3: <Step3Integrations send={send} context={context} />,
    4: <Step4Tour send={send} context={context} />,
    5: <Step5Complete context={context} />,
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-rust-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center">
            <span className="text-white text-2xs font-bold">PF</span>
          </div>
          <span className="font-semibold text-rust-900 text-sm tracking-tight">Pipeflow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-rust-400 font-medium">
            Step {getVisualStep(currentStep)} of {totalSteps}
          </span>
          <div className="w-24">
            <ProgressBar percentage={percentage} />
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="px-6 pt-8 pb-2 max-w-2xl mx-auto w-full">
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          isStarterPlan={isStarterPlan}
        />
      </div>

      {/* Step content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}