import { OnboardingContext, OnboardingEvent, StepAnswers } from './onboarding.types'

type GuardArgs = {
  context: OnboardingContext
  event: OnboardingEvent
}

/**
 * Merges incoming event answers over context answers.
 * Event answers always take priority — the guard must evaluate
 * what WILL be in context after the action fires, not what is
 * currently in context.
 */
function mergedAnswers(context: OnboardingContext, event: OnboardingEvent): StepAnswers {
  if (event.type !== 'NEXT' || !event.answers) {
    return context.stepAnswers
  }
  // Deep merge per step — incoming step answers fully replace the existing step
  return {
    ...context.stepAnswers,
    ...event.answers,
  }
}

export function step1Valid({ context, event }: GuardArgs): boolean {
  const answers = mergedAnswers(context, event)
  const step1 = answers.step1
  if (!step1) return false
  return (
    step1.role.trim().length > 0 &&
    step1.teamSize.trim().length > 0 &&
    step1.useCase.trim().length > 0
  )
}

export function step2Valid({ context, event }: GuardArgs): boolean {
  const answers = mergedAnswers(context, event)
  const step2 = answers.step2
  if (!step2) return false
  return step2.workspaceName.trim().length > 0
}

export function canSkipStep3(_args: GuardArgs): boolean {
  return true
}

export function step4Valid({ context, event }: GuardArgs): boolean {
  const answers = mergedAnswers(context, event)
  return answers.step4?.tourComplete === true
}