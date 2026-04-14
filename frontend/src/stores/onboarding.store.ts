import { create } from 'zustand'
import { StepAnswers } from '@/machines/onboarding.types'

interface OnboardingState {
  completedSteps: number[]
  stepAnswers: StepAnswers
  lastActiveStep: number
  isSyncing: boolean
  lastSyncError: string | null

  setProgress: (progress: {
    completedSteps: number[]
    stepAnswers: StepAnswers
    lastActiveStep: number
  }) => void
  setSyncing: (syncing: boolean) => void
  setSyncError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  completedSteps: [],
  stepAnswers: {},
  lastActiveStep: 1,
  isSyncing: false,
  lastSyncError: null,
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  ...initialState,

  setProgress: (progress) =>
    set({
      completedSteps: progress.completedSteps,
      stepAnswers: progress.stepAnswers,
      lastActiveStep: progress.lastActiveStep,
    }),

  setSyncing: (syncing) => set({ isSyncing: syncing }),

  setSyncError: (error) => set({ lastSyncError: error }),

  reset: () => set(initialState),
}))