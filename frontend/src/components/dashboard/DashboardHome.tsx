import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { ResumeBanner } from '@/components/onboarding/ResumeBanner'
import { useFeatureStore } from '@/stores/feature.store'

const MOCK_STATS = [
  { label: 'Active Projects', value: '3' },
  { label: 'Tasks This Week', value: '12' },
  { label: 'Team Members',    value: '4' },
  { label: 'Completion Rate', value: '78%' },
]

const MOCK_ACTIVITY = [
  { user: 'Jordan R.', action: 'completed task',  target: 'Update landing page copy',  time: '2m ago' },
  { user: 'Sam P.',    action: 'created project', target: 'Q2 Marketing Campaign',     time: '1h ago' },
  { user: 'Alex C.',   action: 'commented on',    target: 'API integration spec',      time: '3h ago' },
  { user: 'Jordan R.', action: 'moved task to',   target: 'In Review',                time: '5h ago' },
]

export function DashboardHome() {
  const featureStore = useFeatureStore()
  console.log('Feature store state:', {
    plan: featureStore._plan,
    completedSteps: featureStore._completedSteps,
    analyticsGate: featureStore.evaluate('analytics'),
  })
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()
  const { completedSteps } = useOnboardingStore()
  const [settled, setSettled] = useState(false)
  

  // Wait one tick after mount before evaluating redirect
  // so the auth store has time to be populated from AuthInitialiser
  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const showResumeBanner = !user?.onboardingComplete && completedSteps.length > 0
  const isNewUser = !user?.onboardingComplete && completedSteps.length === 0

  useEffect(() => {
    // Only redirect if settled, not loading, and genuinely a new user
    if (settled && !isLoading && isNewUser) {
      navigate('/onboarding', { replace: true })
    }
  }, [settled, isLoading, isNewUser, navigate])

  // Don't render content until settled to avoid flash
  if (!settled || isLoading) return null
  if (isNewUser) return null

  return (
    <div className="flex flex-col gap-6">
      {showResumeBanner && <ResumeBanner />}

      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Good morning, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's what's happening across your workspace.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_ACTIVITY.map((item, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                {item.user[0]}
              </div>
              <p className="text-sm text-slate-600 flex-1">
                <span className="font-medium text-slate-800">{item.user}</span>{' '}
                {item.action}{' '}
                <span className="font-medium text-slate-800">{item.target}</span>
              </p>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}