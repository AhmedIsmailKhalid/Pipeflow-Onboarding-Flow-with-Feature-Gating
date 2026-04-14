import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import * as planController from '../controllers/plan.controller'

export const planRoutes = Router()

planRoutes.use(requireAuth)

planRoutes.get('/', planController.getPlan)
planRoutes.post('/upgrade', planController.upgradePlan)