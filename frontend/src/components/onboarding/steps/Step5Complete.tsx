import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { OnboardingContext } from '@/machines/onboarding.types'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'

interface Step5Props { context: OnboardingContext }

const CONFETTI_COUNT = 24

function generateConfetti() {
  const colors = ['#0d9488', '#14b8a6', '#2dd4bf', '#f59e0b', '#8b5cf6', '#10b981']
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    duration: 1.2 + Math.random() * 0.8,
  }))
}

export function Step5Complete({ context }: Step5Props) {
  const navigate = useNavigate()
  const [confetti] = useState(generateConfetti)
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const workspaceName  = context.stepAnswers.step2?.workspaceName ?? 'your workspace'
  const connectedCount = context.stepAnswers.step3?.connectedIntegrations.length ?? 0
  const inviteCount    = context.stepAnswers.step2?.inviteEmails.filter((e) => e.trim()).length ?? 0

  useEffect(() => {
    async function completeOnboarding() {
      try { await api.post('/onboarding/complete') } catch { /* non-fatal */ }
      finally { if (user && !user.onboardingComplete) setUser({ ...user, onboardingComplete: true }) }
    }
    completeOnboarding()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => navigate('/dashboard', { replace: true }), 6000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="bg-white border border-rust-200 rounded-xl p-8 shadow-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{ backgroundColor: piece.color, left: `${piece.x}%`, top: '-8px' }}
            initial={{ y: -8, opacity: 1, rotate: 0 }}
            animate={{ y: 400, opacity: [1, 1, 0], rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
            transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="text-4xl"
          >
            🎉
          </motion.span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-2xl font-bold text-rust-900 tracking-tight">You're all set!</h1>
          <p className="text-rust-500 mt-2 text-sm">
            <span className="font-semibold text-rust-700">{workspaceName}</span> is ready to go.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full grid grid-cols-3 gap-3"
        >
          {[
            { value: '1',                          label: 'Workspace' },
            { value: connectedCount.toString(),    label: connectedCount === 1 ? 'Integration' : 'Integrations' },
            { value: inviteCount.toString(),       label: inviteCount === 1 ? 'Invite sent' : 'Invites sent' },
          ].map((stat) => (
            <div key={stat.label} className="bg-rust-50 border border-rust-100 rounded-lg p-3 flex flex-col items-center gap-1">
              <span className="font-numeric text-xl font-bold text-brand-600">{stat.value}</span>
              <span className="text-xs text-rust-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-full flex flex-col gap-3">
          <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-700" onClick={() => navigate('/dashboard', { replace: true })}>
            Go to Dashboard →
          </Button>
          <p className="text-xs text-rust-400">Redirecting automatically in a few seconds…</p>
        </motion.div>
      </div>
    </div>
  )
}