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
        // Step 1 — get fresh access token
        const { data: refreshData } = await api.post<{ accessToken: string }>(
          '/auth/refresh'
        )
        const token = refreshData.accessToken

        // Step 2 — set token immediately on both store and axios instance
        useAuthStore.getState().setAccessToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Step 3 — fetch user + progress in parallel
        const [userRes, progressRes] = await Promise.all([
          api.get<User>('/user/me'),
          api.get<OnboardingProgressResponse>('/onboarding/progress'),
        ])

        const user = userRes.data
        const progress = progressRes.data

        // Step 4 — populate all stores
        setAuth(user, token)
        setPlan(user.plan)
        setCompletedSteps(progress.completedSteps)
        setProgress({
          completedSteps: progress.completedSteps,
          stepAnswers: progress.stepAnswers,
          lastActiveStep: progress.lastActiveStep,
        })

        // Step 5 — if backend says onboardingComplete but local store
        // somehow has it as false, force sync it
        if (user.onboardingComplete) {
          setUser({ ...user, onboardingComplete: true })
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