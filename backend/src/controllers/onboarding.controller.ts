import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as onboardingService from '../services/onboarding.service'
import { logger } from '../lib/logger'

const stepAnswersSchema = z.object({
  step1: z
    .object({
      role: z.string().min(1),
      teamSize: z.string().min(1),
      useCase: z.string().min(1),
    })
    .optional(),
  step2: z
    .object({
      workspaceName: z.string().min(1),
      inviteEmails: z.array(z.string().email()).max(5),
    })
    .optional(),
  step3: z
    .object({
      connectedIntegrations: z.array(z.string()),
    })
    .optional(),
  step4: z
    .object({
      tourComplete: z.boolean(),
    })
    .optional(),
})

const updateProgressSchema = z.object({
  completedSteps: z.array(z.number().int().min(1).max(5)),
  stepAnswers: stepAnswersSchema,
  lastActiveStep: z.number().int().min(1).max(5),
})

export async function getProgress(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const progress = await onboardingService.getProgress(req.user!.userId)
    res.json(progress)
  } catch (err) {
    next(err)
  }
}

export async function updateProgress(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = updateProgressSchema.parse(req.body)
    const progress = await onboardingService.updateProgress(req.user!.userId, input)

    logger.info('Onboarding progress updated', {
      userId: req.user!.userId,
      completedSteps: input.completedSteps,
      lastActiveStep: input.lastActiveStep,
    })

    res.json(progress)
  } catch (err) {
    next(err)
  }
}