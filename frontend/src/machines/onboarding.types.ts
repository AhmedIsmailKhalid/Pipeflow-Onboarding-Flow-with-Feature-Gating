import { Plan } from '../types/plan.types'

export interface Step1Answers {
  role: string
  teamSize: string
  useCase: string
}

export interface Step2Answers {
  workspaceName: string
  inviteEmails: string[]
}

export interface Step3Answers {
  connectedIntegrations: string[]
}

export interface Step4Answers {
  tourComplete: boolean
}

export interface StepAnswers {
  step1?: Step1Answers
  step2?: Step2Answers
  step3?: Step3Answers
  step4?: Step4Answers
}

export interface OnboardingContext {
  userId: string
  currentStep: 1 | 2 | 3 | 4 | 5
  completedSteps: number[]
  stepAnswers: StepAnswers
  lastSyncedAt: string | null
  error: string | null
  isStarterPlan: boolean
}

export type OnboardingEvent =
  | { type: 'START'; isStarterPlan: boolean }
  | { type: 'NEXT'; answers?: Partial<StepAnswers> }
  | { type: 'BACK' }
  | { type: 'SKIP' }
  | { type: 'ABANDON' }
  | { type: 'RESTORE'; progress: RestoredProgress }
  | { type: 'GO_TO_DASHBOARD' }
  | { type: 'SYNC_SUCCESS'; timestamp: string }
  | { type: 'SYNC_ERROR'; message: string }

export interface RestoredProgress {
  completedSteps: number[]
  stepAnswers: StepAnswers
  lastActiveStep: number
  isStarterPlan: boolean
}

export type OnboardingStateValue =
  | 'idle'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'complete'

export type { Plan }