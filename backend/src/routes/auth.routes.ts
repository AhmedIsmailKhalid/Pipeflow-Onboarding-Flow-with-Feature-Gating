import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

export const authRoutes = Router()

authRoutes.post('/signup', authController.signUp)
authRoutes.post('/login', authController.login)
authRoutes.post('/refresh', authController.refreshToken)
authRoutes.post('/logout', authController.logout)