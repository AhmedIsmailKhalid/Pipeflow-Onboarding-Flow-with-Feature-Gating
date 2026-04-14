import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { ResumeBanner } from '@/components/onboarding/ResumeBanner'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Active Projects', value: '3',   delta: '+1',      deltaLabel: 'this week',     positive: true,  sparkline: [2,2,3,2,3,3,3], color: '#0d9488' },
  { label: 'Tasks Completed', value: '12',  delta: '+4',      deltaLabel: 'vs last week',  positive: true,  sparkline: [5,7,6,8,10,11,12], color: '#16A34A' },
  { label: 'Team Members',    value: '4',   delta: '1',       deltaLabel: 'invite pending', positive: null, sparkline: [3,3,3,4,4,4,4], color: '#D97706' },
  { label: 'Completion Rate', value: '78%', delta: '+6%',     deltaLabel: 'vs last week',  positive: true,  sparkline: [60,65,68,70,72,75,78], color: '#2563EB' },
]

const ACTIVITY = [
  { user: 'Jordan R.', action: 'completed',    target: 'Update landing page copy',  project: 'Website Redesign', time: '2m ago',  type: 'complete' },
  { user: 'Sam P.',    action: 'created',      target: 'Q2 Marketing Campaign',     project: 'Marketing',        time: '1h ago',  type: 'create' },
  { user: 'Alex C.',   action: 'commented on', target: 'API integration spec',      project: 'API v2',           time: '3h ago',  type: 'comment' },
  { user: 'Jordan R.', action: 'moved',        target: 'Design review',             project: 'Website Redesign', time: '5h ago',  type: 'move' },
  { user: 'Sam P.',    action: 'assigned',     target: 'Write unit tests',          project: 'API v2',           time: '6h ago',  type: 'assign' },
]

const ACTIVITY_DOT: Record<string, string> = {
  complete: 'bg-emerald-400',
  create:   'bg-brand-400',
  comment:  'bg-sky-400',
  move:     'bg-amber-400',
  assign:   'bg-violet-400',
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 48; const h = 20
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  )
}

export function DashboardHome() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()
  const { completedSteps } = useOnboardingStore()
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 100)
    return () => clearTimeout(t)
  }, [])

  const showResumeBanner = !user?.onboardingComplete && completedSteps.length > 0
  const isNewUser = !user?.onboardingComplete && completedSteps.length === 0

  useEffect(() => {
    if (settled && !isLoading && isNewUser) navigate('/onboarding', { replace: true })
  }, [settled, isLoading, isNewUser, navigate])

  if (!settled || isLoading || isNewUser) return null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {showResumeBanner && <ResumeBanner />}

      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-lg font-semibold text-rust-900 tracking-tight">
            {greeting}, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-rust-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">
          View all activity →
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-rust-200 rounded-lg p-4 hover:border-rust-300 transition-colors shadow-xs"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-2xs font-medium text-rust-400">{stat.label}</p>
              <Sparkline data={stat.sparkline} color={stat.color} />
            </div>
            <p className="font-numeric text-2xl font-medium text-rust-900 leading-none mb-1.5">
              {stat.value}
            </p>
            <p className={cn(
              'text-2xs font-medium',
              stat.positive === true ? 'text-emerald-600' : stat.positive === false ? 'text-red-500' : 'text-rust-400'
            )}>
              {stat.delta} {stat.deltaLabel}
            </p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="bg-white border border-rust-200 rounded-lg shadow-xs overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px] gap-4 px-4 py-2.5 border-b border-rust-100 bg-rust-50">
          {['Activity', 'Project', 'When'].map((h) => (
            <p key={h} className={cn('text-2xs font-semibold text-rust-400 uppercase tracking-wide', h === 'When' && 'text-right')}>
              {h}
            </p>
          ))}
        </div>
        {ACTIVITY.map((item, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_80px] gap-4 px-4 py-2.5 border-b border-rust-50 hover:bg-rust-50 transition-colors items-center last:border-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', ACTIVITY_DOT[item.type])} />
              <p className="text-xs text-rust-700 truncate">
                <span className="font-medium text-rust-900">{item.user}</span>
                {' '}{item.action}{' '}
                <span className="text-rust-500">{item.target}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-sm bg-rust-300 flex-shrink-0" />
              <p className="text-xs text-rust-400 truncate">{item.project}</p>
            </div>
            <p className="text-2xs font-numeric text-rust-400 text-right">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}