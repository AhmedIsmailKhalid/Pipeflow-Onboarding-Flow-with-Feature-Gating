import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { OnboardingContext } from '@/machines/onboarding.types'
import { OnboardingEvent } from '@/machines/onboarding.types'
import { INTEGRATIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type ConnectStatus = 'idle' | 'connecting' | 'connected'

interface Step3Props {
  send: (event: OnboardingEvent) => void
  context: OnboardingContext
}

export function Step3Integrations({ send, context }: Step3Props) {
  const [statuses, setStatuses] = useState<Record<string, ConnectStatus>>(
    () => {
      const initial: Record<string, ConnectStatus> = {}
      INTEGRATIONS.forEach((i) => {
        const alreadyConnected =
          context.stepAnswers.step3?.connectedIntegrations.includes(i.id)
        initial[i.id] = alreadyConnected ? 'connected' : 'idle'
      })
      return initial
    }
  )

  function handleConnect(id: string) {
    if (statuses[id] !== 'idle') return

    setStatuses((prev) => ({ ...prev, [id]: 'connecting' }))

    // Simulated OAuth flow — resolves after 1.5s
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: 'connected' }))
    }, 1500)
  }

  function handleContinue() {
    const connectedIntegrations = Object.entries(statuses)
      .filter(([, status]) => status === 'connected')
      .map(([id]) => id)
    send({ type: 'NEXT', answers: { step3: { connectedIntegrations } } })
  }

  const connectedCount = Object.values(statuses).filter(
    (s) => s === 'connected'
  ).length

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Connect your tools
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Bring your existing workflow into Pipeflow. You can always connect
          more later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {INTEGRATIONS.map((integration) => {
          const status = statuses[integration.id]

          return (
            <motion.div
              key={integration.id}
              layout
              className={cn(
                'relative border rounded-xl p-4 flex flex-col items-center gap-3',
                'transition-colors duration-200',
                status === 'connected'
                  ? 'border-brand-200 bg-brand-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              )}
            >
              {/* Integration logo placeholder */}
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500">
                {integration.name[0]}
              </div>

              <span className="text-sm font-medium text-slate-700">
                {integration.name}
              </span>

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.button
                    key="connect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleConnect(integration.id)}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Connect
                  </motion.button>
                )}

                {status === 'connecting' && (
                  <motion.div
                    key="connecting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500">
                      Connecting...
                    </span>
                  </motion.div>
                )}

                {status === 'connected' && (
                  <motion.div
                    key="connected"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </span>
                    Connected
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {connectedCount > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center text-slate-500 mb-4"
        >
          {connectedCount} integration{connectedCount !== 1 ? 's' : ''} connected
        </motion.p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => send({ type: 'BACK' })}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => send({ type: 'SKIP' })}
        >
          Skip
        </Button>
        <Button
          type="button"
          size="lg"
          className="flex-1"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}