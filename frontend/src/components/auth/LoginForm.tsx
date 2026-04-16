import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useFeatureStore } from '@/stores/feature.store'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { AuthResponse } from '@/types/auth.types'
import { StepAnswers } from '@/machines/onboarding.types'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      delete api.defaults.headers.common['Authorization']

      const { data: response } = await api.post<AuthResponse>('/auth/login', data)

      login(response.user, response.accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`

      if (response.user.email === 'starter@demo.com') {
        // Starter always restarts from step 1
        useOnboardingStore.getState().reset()
        useFeatureStore.getState().setCompletedSteps([])
        useFeatureStore.getState().setPlan('STARTER')
        useAuthStore.getState().setUser({ ...response.user, onboardingComplete: false })
        navigate('/onboarding', { replace: true })
      } else if (response.user.email === 'growth@demo.com') {
        // Growth always resumes from step 4 with steps 1,2,3 complete
        const growthProgress = {
          completedSteps: [1, 2, 3],
          stepAnswers: {},
          lastActiveStep: 4,
        }
        useOnboardingStore.getState().setProgress(growthProgress)
        useFeatureStore.getState().setCompletedSteps([1, 2, 3])
        useFeatureStore.getState().setPlan('GROWTH')
        useAuthStore.getState().setUser({ ...response.user, onboardingComplete: false })
        navigate('/onboarding', { replace: true })
      } else {
        // All other accounts — fetch real progress
        try {
          const { data: progress } = await api.get<{
            completedSteps: number[]
            stepAnswers: Record<string, unknown>
            lastActiveStep: number
          }>('/onboarding/progress')
          useFeatureStore.getState().setCompletedSteps(progress.completedSteps)
          useFeatureStore.getState().setPlan(response.user.plan)
          useOnboardingStore.getState().setProgress({
            completedSteps: progress.completedSteps,
            stepAnswers: progress.stepAnswers as StepAnswers,
            lastActiveStep: progress.lastActiveStep,
          })
        } catch {
          useFeatureStore.getState().setPlan(response.user.plan)
        }

        if (response.user.onboardingComplete) {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/onboarding', { replace: true })
        }
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Something went wrong. Please try again.'
      setServerError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        placeholder="alex@company.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Your password"
        error={errors.password?.message}
        {...register('password')}
      />

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        Sign in
      </Button>

      {/* Demo credentials hint */}
      <div className="bg-rust-50 border border-rust-200 rounded-lg p-3">
        <p className="text-xs font-semibold text-rust-500 mb-1.5">
          Demo accounts
        </p>
        <div className="flex flex-col gap-1">
          {[
            { email: 'starter@demo.com', label: 'Starter plan' },
            { email: 'growth@demo.com',  label: 'Growth plan' },
            { email: 'scale@demo.com',   label: 'Scale plan' },
          ].map((demo) => (
            <p key={demo.email} className="text-xs text-slate-500">
              <span className="font-mono text-rust-700">{demo.email}</span>
              {' '}·{' '}
              <span className="text-rust-400">{demo.label}</span>
            </p>
          ))}
          <p className="text-xs text-slate-400 mt-1">
            Password for all:{' '}
            <span className="font-mono font-semibold text-rust-700">Demo1234!</span>
          </p>
        </div>
      </div>
    </form>
  )
}