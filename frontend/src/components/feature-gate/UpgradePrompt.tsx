import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'
import { useFeatureStore } from '@/stores/feature.store'
import { api } from '@/lib/api'
import { GateReason } from '@/lib/featureFlags'
import { Plan } from '@/types/plan.types'
import { PLAN_LABELS, PLAN_HIERARCHY } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  reason: GateReason
  featureLabel: string
  featureDescription: string
  requiredPlan?: Plan
  requiredStep?: number
}

const PLAN_ORDER: Plan[] = ['STARTER', 'GROWTH', 'SCALE']

export function UpgradePrompt({
  isOpen,
  onClose,
  reason,
  featureLabel,
  featureDescription,
  requiredPlan,
  requiredStep,
}: UpgradePromptProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const setPlan = useFeatureStore((s) => s.setPlan)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgraded, setUpgraded] = useState(false)

  // Only show plans higher than current
  const currentPlanRank = PLAN_HIERARCHY[user?.plan ?? 'STARTER']
  const upgradablePlans = PLAN_ORDER.filter(
    (p) => PLAN_HIERARCHY[p] > currentPlanRank
  )

  const [selectedPlan, setSelectedPlan] = useState<Plan>(
    requiredPlan ?? upgradablePlans[0] ?? 'GROWTH'
  )

  async function handleUpgrade() {
    setIsUpgrading(true)
    try {
      const { data } = await api.post<{ plan: Plan; features: string[] }>(
        '/plan/upgrade',
        { plan: selectedPlan }
      )

      // Update auth store + feature store immediately — gate clears without refresh
      if (user) {
        const updatedUser = { ...user, plan: data.plan }
        setUser(updatedUser)
        setPlan(data.plan)
      }

      setUpgraded(true)

      setTimeout(() => {
        onClose()
        setUpgraded(false)
      }, 1800)
    } catch {
      // Upgrade failed silently — user stays on current plan
    } finally {
      setIsUpgrading(false)
    }
  }

  function handleStepAction() {
    onClose()
    navigate('/onboarding')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {upgraded ? (
          // Success state
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              🎉
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Plan upgraded!
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                You now have access to {featureLabel}.
              </p>
            </div>
          </div>
        ) : reason === 'step' ? (
          // Step gate
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl mb-2">
                🔓
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Complete your setup to unlock {featureLabel}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {featureDescription}. Finish Step {requiredStep} of your
                onboarding to get access.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <p className="text-sm text-amber-800 font-medium">
                Complete onboarding Step {requiredStep} to unlock this feature
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={onClose}
              >
                Later
              </Button>
              <Button className="flex-1" onClick={handleStepAction}>
                Continue setup →
              </Button>
            </div>
          </div>
        ) : (
          // Plan gate
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl mb-2">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Upgrade to unlock {featureLabel}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {featureDescription}. Available on{' '}
                {requiredPlan ? PLAN_LABELS[requiredPlan] : 'higher'} plan and
                above.
              </p>
            </div>

            {/* Plan selector */}
            {upgradablePlans.length > 0 && (
              <div className="flex flex-col gap-2">
                {upgradablePlans.map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      'border rounded-xl px-4 py-3 text-left transition-colors',
                      selectedPlan === plan
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        {PLAN_LABELS[plan]}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-bold',
                          selectedPlan === plan
                            ? 'text-brand-600'
                            : 'text-slate-500'
                        )}
                      >
                        {plan === 'GROWTH' ? '$29/mo' : '$99/mo'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpgrade}
                isLoading={isUpgrading}
              >
                Upgrade to {PLAN_LABELS[selectedPlan]}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}