import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OnboardingContext, OnboardingEvent } from '@/machines/onboarding.types'

const schema = z.object({
  workspaceName: z.string().min(2, 'At least 2 characters').max(50, 'Under 50 characters'),
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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { workspaceName: context.stepAnswers.step2?.workspaceName ?? '' },
  })

  function updateEmail(index: number, value: string) {
    setEmailInputs((prev) => { const u = [...prev]; u[index] = value; return u })
    setEmailErrors((prev) => { const u = [...prev]; u[index] = ''; return u })
    setSubmitBlocked(false)
  }

  function removeEmail(index: number) {
    setEmailInputs((prev) => prev.filter((_, i) => i !== index))
    setEmailErrors((prev) => prev.filter((_, i) => i !== index))
  }

  function validateEmails(): boolean {
    const errs = emailInputs.map((e) => (!e.trim() ? '' : !EMAIL_REGEX.test(e.trim()) ? 'Invalid email' : ''))
    setEmailErrors(errs)
    return errs.every((e) => e === '')
  }

  function onSubmit(data: FormData) {
    if (!validateEmails()) { setSubmitBlocked(true); return }
    send({ type: 'NEXT', answers: { step2: { workspaceName: data.workspaceName, inviteEmails: emailInputs.filter((e) => e.trim()) } } })
  }

  return (
    <div className="bg-white border border-rust-200 rounded-xl p-8 shadow-card">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-rust-900 tracking-tight">Set up your workspace</h1>
        <p className="text-rust-500 mt-2 text-sm leading-relaxed">
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-rust-700">
              Invite teammates
              <span className="text-rust-400 font-normal ml-1">(optional)</span>
            </label>
            <span className="text-xs text-rust-400">{emailInputs.filter((e) => e.trim()).length}/5</span>
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
                    className="w-full rounded-lg border border-rust-200 px-3 py-2.5 text-sm text-rust-900 placeholder:text-rust-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-rust-300 transition-colors"
                  />
                  {emailErrors[index] && <p className="text-xs text-red-600 mt-1">{emailErrors[index]}</p>}
                </div>
                {emailInputs.length > 1 && (
                  <button type="button" onClick={() => removeEmail(index)} className="mt-2.5 text-rust-400 hover:text-rust-600 transition-colors text-sm">✕</button>
                )}
              </div>
            ))}
          </div>

          {emailInputs.length < 5 && (
            <button
              type="button"
              onClick={() => { setEmailInputs((p) => [...p, '']); setEmailErrors((p) => [...p, '']) }}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium text-left w-fit transition-colors"
            >
              + Add another
            </button>
          )}
          {submitBlocked && <p className="text-xs text-red-600">Please fix email errors above.</p>}
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => send({ type: 'BACK' })}>
            Back
          </Button>
          <Button type="submit" size="lg" className="flex-1 bg-brand-600 hover:bg-brand-700">
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}