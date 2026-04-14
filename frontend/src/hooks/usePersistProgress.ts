import { useEffect, useRef } from 'react'
import { AnyMachineSnapshot } from 'xstate'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useFeatureStore } from '@/stores/feature.store'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { OnboardingContext, StepAnswers } from '@/machines/onboarding.types'

interface PersistProgressOptions {
  state: AnyMachineSnapshot
  context: OnboardingContext
}

export function usePersistProgress({ state, context }: PersistProgressOptions) {
  const setSyncing = useOnboardingStore((s) => s.setSyncing)
  const setSyncError = useOnboardingStore((s) => s.setSyncError)
  const setProgress = useOnboardingStore((s) => s.setProgress)
  const setCompletedSteps = useFeatureStore((s) => s.setCompletedSteps)
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevStepRef = useRef<number>(context.currentStep)
  const hasSyncedCompleteRef = useRef(false)

  // Sync on step transitions
  useEffect(() => {
    const stateValue = state.value as string
    const activeStates = ['step1', 'step2', 'step3', 'step4', 'step5']
    if (!activeStates.includes(stateValue)) return
    if (context.currentStep === prevStepRef.current) return
    prevStepRef.current = context.currentStep

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setSyncing(true)
      setSyncError(null)

      try {
        await api.put('/onboarding/progress', {
          completedSteps: context.completedSteps,
          stepAnswers: context.stepAnswers,
          lastActiveStep: context.currentStep,
        })

        setProgress({
          completedSteps: context.completedSteps,
          stepAnswers: context.stepAnswers as StepAnswers,
          lastActiveStep: context.currentStep,
        })

        // Push completed steps into feature store on every transition
        setCompletedSteps(context.completedSteps)

        // Mark onboarding complete locally when all required steps done
        const requiredSteps = [1, 2, 4]
        const allRequiredDone = requiredSteps.every((s) =>
          context.completedSteps.includes(s)
        )
        if (allRequiredDone && user && !user.onboardingComplete) {
          setUser({ ...user, onboardingComplete: true })
        }
      } catch {
        setSyncError("Failed to save progress. Your work is safe — we'll retry.")
      } finally {
        setSyncing(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [state.value, context.currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

  // Final sync when machine reaches complete state
  // Ensures feature store has the final completedSteps even if the
  // step5 → complete transition happened before the debounce fired
  useEffect(() => {
    const stateValue = state.value as string
    if (stateValue !== 'complete') return
    if (hasSyncedCompleteRef.current) return
    hasSyncedCompleteRef.current = true

    setCompletedSteps(context.completedSteps)
    setProgress({
      completedSteps: context.completedSteps,
      stepAnswers: context.stepAnswers as StepAnswers,
      lastActiveStep: context.currentStep,
    })

    if (user && !user.onboardingComplete) {
      setUser({ ...user, onboardingComplete: true })
    }
  }, [state.value]) // eslint-disable-line react-hooks/exhaustive-deps
}