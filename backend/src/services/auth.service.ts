import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt'
import { createError } from '../middleware/error.middleware'
import { Plan } from '@prisma/client'

const SALT_ROUNDS = 12

export interface SignUpInput {
  email: string
  password: string
  name: string
  plan: Plan
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult {
  tokens: AuthTokens
  user: {
    id: string
    email: string
    name: string
    plan: Plan
    onboardingComplete: boolean
  }
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (existing) {
    throw createError('An account with this email already exists', 409)
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
      plan: input.plan,
      onboardingProgress: {
        create: {
          completedSteps: [],
          stepAnswers: {},
          lastActiveStep: 1,
        },
      },
    },
  })

  const tokens = generateTokens(user.id, user.email, user.plan)

  return {
    tokens,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      onboardingComplete: user.onboardingComplete,
    },
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (!user) {
    throw createError('Invalid email or password', 401)
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash)

  if (!passwordMatch) {
    throw createError('Invalid email or password', 401)
  }

  const tokens = generateTokens(user.id, user.email, user.plan)

  return {
    tokens,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      onboardingComplete: user.onboardingComplete,
    },
  }
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string }> {
  let payload: { userId: string }

  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw createError('Invalid or expired refresh token', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    throw createError('User not found', 401)
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    plan: user.plan,
  })

  return { accessToken }
}

function generateTokens(userId: string, email: string, plan: Plan): AuthTokens {
  const accessToken = signAccessToken({ userId, email, plan })
  const refreshToken = signRefreshToken({ userId })
  return { accessToken, refreshToken }
}