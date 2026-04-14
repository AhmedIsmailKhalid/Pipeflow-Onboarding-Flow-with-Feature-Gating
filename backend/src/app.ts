import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from './middleware/error.middleware'
import { authRoutes } from './routes/auth.routes'
import { onboardingRoutes } from './routes/onboarding.routes'
import { planRoutes } from './routes/plan.routes'
import { userRoutes } from './routes/user.routes'

export function createApp() {
  const app = express()

  // ── Core middleware ──────────────────────────────────────────
  app.use(
    cors({
      origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
      credentials: true,
    })
  )
  app.use(express.json())
  app.use(cookieParser())

  // ── Health check ─────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // ── Routes ────────────────────────────────────────────────────
  app.use('/auth', authRoutes)
  app.use('/onboarding', onboardingRoutes)
  app.use('/plan', planRoutes)
  app.use('/user', userRoutes)

  // ── Error handler (must be last) ─────────────────────────────
  app.use(errorMiddleware)

  return app
}