import { FeatureKey, Plan } from '@/types/plan.types'
import { FEATURE_GATE_MAP, PLAN_HIERARCHY } from './constants'

export type GateReason = 'plan' | 'step' | null

export interface FeatureGateResult {
  enabled: boolean
  reason: GateReason
  requiredPlan?: Plan
  requiredStep?: number
  label: string
  description: string
}

/**
 * Core gate evaluation function.
 * Called by useFeatureGate hook — never called directly from components.
 *
 * Two conditions must BOTH pass for a feature to be enabled:
 * 1. User's plan meets the minimum plan requirement
 * 2. User has completed the required onboarding step (if one exists)
 *
 * Plan is checked first — if plan gate fails, step gate is not evaluated.
 */
export function evaluateFeatureGate(
  featureKey: FeatureKey,
  userPlan: Plan,
  completedSteps: number[]
): FeatureGateResult {
  const gate = FEATURE_GATE_MAP[featureKey]

  const planSufficient =
    PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[gate.minPlan]

  if (!planSufficient) {
    return {
      enabled: false,
      reason: 'plan',
      requiredPlan: gate.minPlan,
      requiredStep: gate.requiredStep,
      label: gate.label,
      description: gate.description,
    }
  }

  if (gate.requiredStep && !completedSteps.includes(gate.requiredStep)) {
    return {
      enabled: false,
      reason: 'step',
      requiredStep: gate.requiredStep,
      label: gate.label,
      description: gate.description,
    }
  }

  return {
    enabled: true,
    reason: null,
    label: gate.label,
    description: gate.description,
  }
}