import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { onboardingMachine } from '@/machines/onboarding.machine'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useFeatureStore } from '@/stores/feature.store'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { OnboardingProgressResponse } from '@/types/onboarding.types'
import { StepAnswers } from '@/machines/onboarding.types'
import { User } from '@/types/auth.types'


export function useOnboardingMachine() {
  const [state, send] = useMachine(onboardingMachine)
  const setProgress = useOnboardingStore((s) => s.setProgress)
  const setCompletedSteps = useFeatureStore((s) => s.setCompletedSteps)
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    async function restoreProgress() {
      try {
        let currentUser = user
        if (!currentUser && accessToken) {
          const { data: freshUser } = await api.get<User>('/user/me')
          setAuth(freshUser, accessToken)
          currentUser = freshUser
        }

        const isStarterPlan = currentUser?.plan === 'STARTER'

        // Demo starter account always starts from step 1
        const isDemoStarterAccount = currentUser?.email === 'starter@demo.com'

        if (isDemoStarterAccount) {
          // Reset progress in stores so dashboard gates work correctly
          setProgress({ completedSteps: [], stepAnswers: {}, lastActiveStep: 1 })
          setCompletedSteps([])
          send({ type: 'START', isStarterPlan: true })
          return
        }

        const { data } = await api.get<OnboardingProgressResponse>(
          '/onboarding/progress'
        )

        const restored = {
          completedSteps: data.completedSteps,
          stepAnswers: data.stepAnswers as StepAnswers,
          lastActiveStep: data.lastActiveStep,
          isStarterPlan,
        }

        setProgress({
          completedSteps: data.completedSteps,
          stepAnswers: data.stepAnswers as StepAnswers,
          lastActiveStep: data.lastActiveStep,
        })
        setCompletedSteps(data.completedSteps)

        if (data.completedSteps.length > 0) {
          send({ type: 'RESTORE', progress: restored })
        } else {
          send({ type: 'START', isStarterPlan })
        }
      } catch {
        const isStarterPlan = user?.plan === 'STARTER'
        send({ type: 'START', isStarterPlan })
      }
    }

    restoreProgress()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    state,
    send,
    context: state.context,
    currentStep: state.context.currentStep,
    completedSteps: state.context.completedSteps,
    isComplete: state.matches('complete'),
    isStarterPlan: state.context.isStarterPlan,
    matches: state.matches.bind(state),
  }
}