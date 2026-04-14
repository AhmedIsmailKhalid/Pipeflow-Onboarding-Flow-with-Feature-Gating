import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OnboardingContext } from '@/machines/onboarding.types'
import { OnboardingEvent } from '@/machines/onboarding.types'


const schema = z.object({
  workspaceName: z
    .string()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(50, 'Workspace name must be under 50 characters'),
})

type FormData = z.infer<typeof schema>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Step2Props {
  send: (event: OnboardingEvent) => void
  context: OnboardingContext
}

export function Step2Workspace({ send, context }: Step2Props) {
  const [emailInputs, setEmailInputs] = useState<string[]>(
    context.stepAnswers.step2?.inviteEmails.length
      ? context.stepAnswers.step2.inviteEmails
      : ['']
  )
  const [emailErrors, setEmailErrors] = useState<string[]>([''])
  const [submitBlocked, setSubmitBlocked] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspaceName: context.stepAnswers.step2?.workspaceName ?? '',
    },
  })

  function addEmailInput() {
    if (emailInputs.length >= 5) return
    setEmailInputs((prev) => [...prev, ''])
    setEmailErrors((prev) => [...prev, ''])
  }

  function updateEmail(index: number, value: string) {
    setEmailInputs((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
    setEmailErrors((prev) => {
      const updated = [...prev]
      updated[index] = ''
      return updated
    })
    setSubmitBlocked(false)
  }

  function removeEmail(index: number) {
    setEmailInputs((prev) => prev.filter((_, i) => i !== index))
    setEmailErrors((prev) => prev.filter((_, i) => i !== index))
  }

  function validateEmails(): boolean {
    const newErrors = emailInputs.map((email) => {
      if (!email.trim()) return '' // empty inputs are fine
      if (!EMAIL_REGEX.test(email.trim())) return 'Invalid email address'
      return ''
    })
    setEmailErrors(newErrors)
    return newErrors.every((e) => e === '')
  }

  function onSubmit(data: FormData) {
    if (!validateEmails()) {
      setSubmitBlocked(true)
      return
    }
    const validEmails = emailInputs.filter((e) => e.trim() !== '')
    send({
      type: 'NEXT',
      answers: { step2: { workspaceName: data.workspaceName, inviteEmails: validEmails } },
    })
}

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Set up your workspace
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Give your workspace a name and invite your team to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Input
          label="Workspace name"
          placeholder="e.g. Acme Corp, My Team, Side Project"
          error={errors.workspaceName?.message}
          {...register('workspaceName')}
        />

        {/* Invite teammates */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Invite teammates
              <span className="text-slate-400 font-normal ml-1">
                (optional)
              </span>
            </label>
            <span className="text-xs text-slate-400">
              {emailInputs.filter((e) => e.trim()).length}/5
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {emailInputs.map((email, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-slate-300 transition-colors"
                  />
                  {emailErrors[index] && (
                    <p className="text-xs text-red-600 mt-1">
                      {emailErrors[index]}
                    </p>
                  )}
                </div>
                {emailInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="mt-2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {emailInputs.length < 5 && (
            <button
              type="button"
              onClick={addEmailInput}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium text-left w-fit transition-colors"
            >
              + Add another
            </button>
          )}

          {submitBlocked && (
            <p className="text-xs text-red-600">
              Please fix the email errors above before continuing.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => send({ type: 'BACK' })}
          >
            Back
          </Button>
          <Button type="submit" size="lg" className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}