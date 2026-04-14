import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { Plan } from '@prisma/client'
import * as planService from '../services/plan.service'
import { logger } from '../lib/logger'

const upgradePlanSchema = z.object({
  plan: z.nativeEnum(Plan),
})

export async function getPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await planService.getPlan(req.user!.userId)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function upgradePlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { plan } = upgradePlanSchema.parse(req.body)
    const result = await planService.upgradePlan(req.user!.userId, plan)

    logger.info('Plan upgraded', {
      userId: req.user!.userId,
      toPlan: plan,
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}