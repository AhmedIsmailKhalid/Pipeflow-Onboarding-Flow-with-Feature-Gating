import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { INTEGRATIONS } from '@/lib/constants'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { cn } from '@/lib/utils'

type ConnectStatus = 'idle' | 'connecting' | 'connected'

export function IntegrationsView() {
  const { stepAnswers } = useOnboardingStore()

  // Initialise from onboarding progress — if they connected during onboarding,
  // show as already connected here
  const [statuses, setStatuses] = useState<Record<string, ConnectStatus>>(() => {
    const alreadyConnected =
      stepAnswers.step3?.connectedIntegrations ?? []
    const initial: Record<string, ConnectStatus> = {}
    INTEGRATIONS.forEach((i) => {
      initial[i.id] = alreadyConnected.includes(i.id) ? 'connected' : 'idle'
    })
    return initial
  })

  function handleConnect(id: string) {
    if (statuses[id] !== 'idle') return
    setStatuses((prev) => ({ ...prev, [id]: 'connecting' }))
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: 'connected' }))
    }, 1500)
  }

  function handleDisconnect(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: 'idle' }))
  }

  const connectedCount = Object.values(statuses).filter(
    (s) => s === 'connected'
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Integrations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect your tools to keep everything in sync.
            {connectedCount > 0 && (
              <span className="ml-2 text-brand-600 font-medium">
                {connectedCount} connected
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integration) => {
          const status = statuses[integration.id]

          return (
            <div
              key={integration.id}
              className={cn(
                'bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4 transition-colors',
                status === 'connected'
                  ? 'border-brand-200 bg-brand-50'
                  : 'border-slate-100'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-base font-bold text-slate-500 flex-shrink-0">
                {integration.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {integration.name}
                </p>
                <AnimatePresence mode="wait">
                  {status === 'connected' ? (
                    <motion.p
                      key="connected"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-brand-600 font-medium mt-0.5"
                    >
                      Connected
                    </motion.p>
                  ) : (
                    <motion.p
                      key="not-connected"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-slate-500 mt-0.5"
                    >
                      Not connected
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.button
                    key="connect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleConnect(integration.id)}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors flex-shrink-0"
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
                    className="flex items-center gap-1.5 flex-shrink-0"
                  >
                    <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500">Connecting...</span>
                  </motion.div>
                )}

                {status === 'connected' && (
                  <motion.button
                    key="disconnect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleDisconnect(integration.id)}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    Disconnect
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}