import { create } from 'zustand'
import { FeatureKey, Plan } from '@/types/plan.types'
import { evaluateFeatureGate, FeatureGateResult } from '@/lib/featureFlags'

interface FeatureState {
  /**
   * Evaluates gate for a given feature key.
   * Reads plan and completedSteps from the store snapshot at call time.
   * Components call this via the useFeatureGate hook — never directly.
   */
  evaluate: (featureKey: FeatureKey) => FeatureGateResult

  // Internal state — set by auth + onboarding stores on update
  _plan: Plan
  _completedSteps: number[]

  setPlan: (plan: Plan) => void
  setCompletedSteps: (steps: number[]) => void
}

export const useFeatureStore = create<FeatureState>()((set, get) => ({
  _plan: 'STARTER',
  _completedSteps: [],

  evaluate: (featureKey: FeatureKey): FeatureGateResult => {
    const { _plan, _completedSteps } = get()
    return evaluateFeatureGate(featureKey, _plan, _completedSteps)
  },

  setPlan: (plan: Plan) => set({ _plan: plan }),

  setCompletedSteps: (steps: number[]) => set({ _completedSteps: steps }),
}))