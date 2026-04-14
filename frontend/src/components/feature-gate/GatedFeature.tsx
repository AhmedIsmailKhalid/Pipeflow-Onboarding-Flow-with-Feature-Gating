import { useState } from 'react'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { FeatureKey } from '@/types/plan.types'
import { LockedOverlay } from './LockedOverlay'
import { UpgradePrompt } from './UpgradePrompt'

interface GatedFeatureProps {
  featureKey: FeatureKey
  children: React.ReactNode
}

/**
 * Wraps any feature — renders children if enabled,
 * renders children behind LockedOverlay if gated.
 * Clicking the overlay opens UpgradePrompt modal.
 *
 * Components never check plan tier or step completion directly.
 * All gate logic is centralised here.
 */
export function GatedFeature({ featureKey, children }: GatedFeatureProps) {
  const gate = useFeatureGate(featureKey)
  const [promptOpen, setPromptOpen] = useState(false)

  if (gate.enabled) {
    return <>{children}</>
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Blurred content — user can see what they're missing */}
        <div className="pointer-events-none select-none blur-sm opacity-60">
          {children}
        </div>

        <LockedOverlay
          reason={gate.reason}
          requiredPlan={gate.requiredPlan}
          requiredStep={gate.requiredStep}
          label={gate.label}
          onClick={() => setPromptOpen(true)}
        />
      </div>

      <UpgradePrompt
        isOpen={promptOpen}
        onClose={() => setPromptOpen(false)}
        reason={gate.reason}
        featureLabel={gate.label}
        featureDescription={gate.description}
        requiredPlan={gate.requiredPlan}
        requiredStep={gate.requiredStep}
      />
    </>
  )
}