import { useFeatureStore } from '@/stores/feature.store'
import { FeatureKey } from '@/types/plan.types'
import { FeatureGateResult } from '@/lib/featureFlags'

/**
 * Single access point for all feature gate decisions in the UI.
 *
 * Components never check plan tier or completedSteps directly —
 * they call this hook and react to the returned result.
 *
 * Example:
 *   const gate = useFeatureGate('analytics')
 *   if (!gate.enabled) return <LockedOverlay reason={gate.reason} />
 */
export function useFeatureGate(featureKey: FeatureKey): FeatureGateResult {
  const evaluate = useFeatureStore((s) => s.evaluate)
  return evaluate(featureKey)
}