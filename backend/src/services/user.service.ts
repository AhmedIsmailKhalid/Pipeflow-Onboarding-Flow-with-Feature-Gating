import { prisma } from '../lib/prisma'
import { createError } from '../middleware/error.middleware'

export interface UserResult {
  id: string
  email: string
  name: string
  plan: string
  onboardingComplete: boolean
  createdAt: Date
}

export async function getUser(userId: string): Promise<UserResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      onboardingComplete: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  return user
}