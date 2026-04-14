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
  const setPlan = useFeatureStore((s) => s.setPlan)
  const setCompletedSteps = useFeatureStore((s) => s.setCompletedSteps)
  const setProgress = useOnboardingStore((s) => s.setProgress)

  useEffect(() => {
    async function checkSession() {
      try {
        // Step 1 — get fresh access token
        const { data: refreshData } = await api.post<{ accessToken: string }>(
          '/auth/refresh'
        )
        const token = refreshData.accessToken

        // Step 2 — set token in store AND on axios headers directly
        // so the next requests go out with auth immediately
        useAuthStore.getState().setAccessToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Step 3 — fetch user + progress in parallel, both now have auth header
        const [userRes, progressRes] = await Promise.all([
          api.get<User>('/user/me'),
          api.get<OnboardingProgressResponse>('/onboarding/progress'),
        ])

        const user = userRes.data
        const progress = progressRes.data

        // Step 4 — populate all stores before router renders
        setAuth(user, token)
        setPlan(user.plan)
        setCompletedSteps(progress.completedSteps)
        setProgress({
          completedSteps: progress.completedSteps,
          stepAnswers: progress.stepAnswers,
          lastActiveStep: progress.lastActiveStep,
        })
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