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
      // Clear stale auth header before logging in
      delete api.defaults.headers.common['Authorization']

      const { data: response } = await api.post<AuthResponse>('/auth/login', data)
      login(response.user, response.accessToken)

      // Set the new token immediately on the axios instance
      api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`

      if (response.user.onboardingComplete) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/onboarding', { replace: true })
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
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
        <p className="text-xs font-semibold text-slate-600 mb-1.5">
          Demo accounts
        </p>
        <div className="flex flex-col gap-1">
          {[
            { email: 'starter@demo.com', label: 'Starter plan' },
            { email: 'growth@demo.com',  label: 'Growth plan' },
            { email: 'scale@demo.com',   label: 'Scale plan' },
          ].map((demo) => (
            <p key={demo.email} className="text-xs text-slate-500">
              <span className="font-mono">{demo.email}</span>
              {' '}·{' '}
              <span>{demo.label}</span>
            </p>
          ))}
          <p className="text-xs text-slate-400 mt-1">
            Password for all:{' '}
            <span className="font-mono font-semibold">Demo1234!</span>
          </p>
        </div>
      </div>
    </form>
  )
}