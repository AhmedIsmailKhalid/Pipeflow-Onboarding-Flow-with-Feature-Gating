import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { createError } from '../middleware/error.middleware'

export interface StepAnswers {
  step1?: {
    role: string
    teamSize: string
    useCase: string
  }
  step2?: {
    workspaceName: string
    inviteEmails: string[]
  }
  step3?: {
    connectedIntegrations: string[]
  }
  step4?: {
    tourComplete: boolean
  }
}

export interface OnboardingProgressResult {
  completedSteps: number[]
  stepAnswers: StepAnswers
  lastActiveStep: number
}

export interface UpdateProgressInput {
  completedSteps: number[]
  stepAnswers: StepAnswers
  lastActiveStep: number
}

export async function getProgress(userId: string): Promise<OnboardingProgressResult> {
  const progress = await prisma.onboardingProgress.findUnique({
    where: { userId },
  })

  if (!progress) {
    throw createError('Onboarding progress not found', 404)
  }

  return {
    completedSteps: progress.completedSteps,
    stepAnswers: progress.stepAnswers as StepAnswers,
    lastActiveStep: progress.lastActiveStep,
  }
}

export async function updateProgress(
  userId: string,
  input: UpdateProgressInput
): Promise<OnboardingProgressResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  const requiredSteps =
    user.plan === 'STARTER' ? [1, 2, 4] : [1, 2, 3, 4]

  const isComplete = requiredSteps.every((s) =>
    input.completedSteps.includes(s)
  )

  // Remove: import { Prisma } from '@prisma/client'
  // Replace the cast line with:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stepAnswers = input.stepAnswers as any

  const [progress] = await prisma.$transaction([
    prisma.onboardingProgress.update({
      where: { userId },
      data: {
        completedSteps: input.completedSteps,
        stepAnswers,
        lastActiveStep: input.lastActiveStep,
      },
    }),
    ...(isComplete
      ? [
          prisma.user.update({
            where: { id: userId },
            data: { onboardingComplete: true },
          }),
        ]
      : []),
  ])

  return {
    completedSteps: progress.completedSteps,
    stepAnswers: progress.stepAnswers as StepAnswers,
    lastActiveStep: progress.lastActiveStep,
  }
}

export async function markOnboardingComplete(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingComplete: true },
  })
}