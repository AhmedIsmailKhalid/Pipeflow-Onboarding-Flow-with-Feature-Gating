import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { Plan } from '@prisma/client'
import * as authService from '../services/auth.service'
import { logger } from '../lib/logger'

const REFRESH_COOKIE = 'pipeflow_refresh'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  plan: z.nativeEnum(Plan).optional().default(Plan.STARTER),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function signUp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = signUpSchema.parse(req.body)
    const result = await authService.signUp(input)

    res.cookie(REFRESH_COOKIE, result.tokens.refreshToken, COOKIE_OPTIONS)

    logger.info('User signed up', { userId: result.user.id, plan: result.user.plan })

    res.status(201).json({
      accessToken: result.tokens.accessToken,
      user: result.user,
    })
  } catch (err) {
    next(err)
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = loginSchema.parse(req.body)
    const result = await authService.login(input)

    res.cookie(REFRESH_COOKIE, result.tokens.refreshToken, COOKIE_OPTIONS)

    logger.info('User logged in', { userId: result.user.id })

    res.json({
      accessToken: result.tokens.accessToken,
      user: result.user,
    })
  } catch (err) {
    next(err)
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies[REFRESH_COOKIE]

    if (!token) {
      res.status(401).json({ error: 'No refresh token provided' })
      return
    }

    const result = await authService.refresh(token)

    res.json({ accessToken: result.accessToken })
  } catch (err) {
    next(err)
  }
}

export async function logout(
  _req: Request,
  res: Response
): Promise<void> {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  res.json({ message: 'Logged out successfully' })
}