import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useFeatureStore } from '@/stores/feature.store'
import { api } from '@/lib/api'
import { User } from '@/types/auth.types'
import { StepAnswers } from '@/machines/onboarding.types'

interface OnboardingProgressResponse {
  completedSteps: number[]
  stepAnswers: StepAnswers
  lastActiveStep: number
}

function AuthInitialiser() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const setLoading = useAuthStore((s) => s.setLoading)
  const setUser = useAuthStore((s) => s.setUser)
  const setPlan = useFeatureStore((s) => s.setPlan)
  const setCompletedSteps = useFeatureStore((s) => s.setCompletedSteps)
  const setProgress = useOnboardingStore((s) => s.setProgress)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: refreshData } = await api.post<{ accessToken: string }>(
          '/auth/refresh'
        )
        const token = refreshData.accessToken

        useAuthStore.getState().setAccessToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        const [userRes, progressRes] = await Promise.all([
          api.get<User>('/user/me'),
          api.get<OnboardingProgressResponse>('/onboarding/progress'),
        ])

        const user = userRes.data
        const progress = progressRes.data

        setAuth(user, token)
        setPlan(user.plan)

        if (user.email === 'starter@demo.com') {
          // Starter always starts fresh from step 1
          setCompletedSteps([])
          setProgress({ completedSteps: [], stepAnswers: {}, lastActiveStep: 1 })
          setUser({ ...user, onboardingComplete: false })
        } else if (user.email === 'growth@demo.com') {
          // Growth always shows resume banner with steps 1-3 complete
          setCompletedSteps([1, 2, 3])
          setProgress({
            completedSteps: [1, 2, 3],
            stepAnswers: progress.stepAnswers,
            lastActiveStep: 4,
          })
          setUser({ ...user, onboardingComplete: false })
        } else {
          // All other accounts use real DB state
          setCompletedSteps(progress.completedSteps)
          setProgress({
            completedSteps: progress.completedSteps,
            stepAnswers: progress.stepAnswers,
            lastActiveStep: progress.lastActiveStep,
          })
          if (user.onboardingComplete) {
            setUser({ ...user, onboardingComplete: true })
          }
        }
      } catch {
        setLoading(false)
      }
    }

    checkSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitialiser />
      <AppRouter />
    </BrowserRouter>
  )
}