import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { OnboardingContext } from '@/machines/onboarding.types'
import { OnboardingEvent } from '@/machines/onboarding.types'
import { cn } from '@/lib/utils'

const schema = z.object({
  role: z.string().min(1, 'Please select your role'),
  teamSize: z.string().min(1, 'Please select your team size'),
  useCase: z.string().min(1, 'Please select your primary use case'),
})

type FormData = z.infer<typeof schema>

const ROLES = [
  'Solo Founder',
  'Engineering Manager',
  'Product Manager',
  'Designer',
  'Marketing Manager',
  'Operations Lead',
  'Other',
]

const TEAM_SIZES = ['Just me', '2–10', '11–50', '51–200', '200+']

const USE_CASES = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Operations',
  'Cross-functional',
]

interface Step1Props {
  send: (event: OnboardingEvent) => void
  context: OnboardingContext
}

export function Step1Profile({ send, context }: Step1Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: context.stepAnswers.step1?.role ?? '',
      teamSize: context.stepAnswers.step1?.teamSize ?? '',
      useCase: context.stepAnswers.step1?.useCase ?? '',
    },
  })

  const selectedTeamSize = watch('teamSize')
  const selectedUseCase = watch('useCase')

  function onSubmit(data: FormData) 
  {
    send({ type: 'NEXT', answers: { step1: data } })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Tell us about yourself
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          We'll personalise your Pipeflow experience based on how you work.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            What's your role?
          </label>
          <select
            {...register('role')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Select your role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Team size */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            How big is your team?
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setValue('teamSize', size, { shouldValidate: true })}
                className={cn(
                  'border rounded-lg px-2 py-2 text-center text-sm font-medium transition-colors',
                  selectedTeamSize === size
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                )}
              >
                {size}
              </button>
            ))}
          </div>
          {/* Hidden input for RHF registration */}
          <input type="hidden" {...register('teamSize')} />
          {errors.teamSize && (
            <p className="text-xs text-red-600">{errors.teamSize.message}</p>
          )}
        </div>

        {/* Use case */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            What will you primarily use Pipeflow for?
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {USE_CASES.map((useCase) => (
              <button
                key={useCase}
                type="button"
                onClick={() => setValue('useCase', useCase, { shouldValidate: true })}
                className={cn(
                  'border rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors',
                  selectedUseCase === useCase
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                )}
              >
                {useCase}
              </button>
            ))}
          </div>
          {/* Hidden input for RHF registration */}
          <input type="hidden" {...register('useCase')} />
          {errors.useCase && (
            <p className="text-xs text-red-600">{errors.useCase.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full mt-2">
          Continue
        </Button>
      </form>
    </div>
  )
}