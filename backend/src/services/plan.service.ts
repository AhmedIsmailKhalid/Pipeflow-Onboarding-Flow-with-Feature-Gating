import { Plan } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { createError } from '../middleware/error.middleware'

const PLAN_HIERARCHY: Record<Plan, number> = {
  STARTER: 0,
  GROWTH: 1,
  SCALE: 2,
}

export interface PlanResult {
  plan: Plan
  features: string[]
}

const PLAN_FEATURES: Record<Plan, string[]> = {
  STARTER: ['projects', 'analytics'],
  GROWTH: [
    'projects',
    'analytics',
    'integrations',
    'team_management',
    'custom_branding',
  ],
  SCALE: [
    'projects',
    'analytics',
    'integrations',
    'team_management',
    'custom_branding',
    'reports',
    'api_access',
  ],
}

export async function getPlan(userId: string): Promise<PlanResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  return {
    plan: user.plan,
    features: PLAN_FEATURES[user.plan],
  }
}

export async function upgradePlan(userId: string, toPlan: Plan): Promise<PlanResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  if (PLAN_HIERARCHY[toPlan] <= PLAN_HIERARCHY[user.plan]) {
    throw createError('Can only upgrade to a higher plan tier', 400)
  }

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan: toPlan },
    }),
    prisma.planUpgrade.create({
      data: {
        userId,
        fromPlan: user.plan,
        toPlan,
      },
    }),
  ])

  return {
    plan: updatedUser.plan,
    features: PLAN_FEATURES[updatedUser.plan],
  }
}