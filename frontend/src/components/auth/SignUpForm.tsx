import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { AuthResponse } from '@/types/auth.types'
import { Plan } from '@/types/plan.types'
import { cn } from '@/lib/utils'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useFeatureStore } from '@/stores/feature.store'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  plan: z.enum(['STARTER', 'GROWTH', 'SCALE']),
})

type FormData = z.infer<typeof schema>

const PLAN_OPTIONS: {
  value: Plan
  label: string
  price: string
  description: string
}[] = [
  {
    value: 'STARTER',
    label: 'Starter',
    price: 'Free',
    description: 'For individuals and small teams',
  },
  {
    value: 'GROWTH',
    label: 'Growth',
    price: '$29/mo',
    description: 'For growing teams with more needs',
  },
  {
    value: 'SCALE',
    label: 'Scale',
    price: '$99/mo',
    description: 'For large teams with advanced requirements',
  },
]

export function SignUpForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      plan: 'STARTER',
    },
  })

  const selectedPlan = watch('plan')

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      // Clear stale auth header and any previous session state
      delete api.defaults.headers.common['Authorization']

      const { data: response } = await api.post<AuthResponse>('/auth/signup', data)

      // Explicitly reset onboarding and feature stores before setting new auth
      // to prevent any previous session's completed steps bleeding in
      useOnboardingStore.getState().reset()
      useFeatureStore.getState().setCompletedSteps([])
      useFeatureStore.getState().setPlan(response.user.plan)

      login(response.user, response.accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`

      navigate('/onboarding', { replace: true })
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
        label="Full name"
        placeholder="Alex Chen"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Work email"
        type="email"
        placeholder="alex@company.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min 8 chars, 1 uppercase, 1 number"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Plan selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-rust-700">
          Choose a plan
        </label>
        <div className="flex flex-col gap-2">
          {PLAN_OPTIONS.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                value={option.value}
                {...register('plan')}
                className="sr-only"
                onChange={() => setValue('plan', option.value)}
              />
              <div
                className={cn(
                  'border rounded-lg px-4 py-3 flex items-center justify-between transition-colors cursor-pointer',
                  selectedPlan === option.value
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-rust-200 hover:border-rust-300 bg-rust-50'
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-rust-800">
                    {option.label}
                  </p>
                  <p className="text-xs text-rust-400 mt-0.5">
                    {option.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-sm font-bold font-numeric',
                    selectedPlan === option.value 
                    ? 'text-brand-600' 
                    : 'text-rust-500'
                  )}
                >
                  {option.price}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

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
        Create account
      </Button>

      <p className="text-xs text-center text-rust-400">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}