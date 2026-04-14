import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import * as onboardingController from '../controllers/onboarding.controller'

export const onboardingRoutes = Router()

onboardingRoutes.use(requireAuth)

onboardingRoutes.get('/progress', onboardingController.getProgress)
onboardingRoutes.put('/progress', onboardingController.updateProgress)