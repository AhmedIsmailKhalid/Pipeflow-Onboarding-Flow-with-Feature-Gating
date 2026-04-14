import { Plan } from './plan.types'

export interface User {
  id: string
  email: string
  name: string
  plan: Plan
  onboardingComplete: boolean
}

export interface AuthResponse {
  accessToken: string
  user: User
}