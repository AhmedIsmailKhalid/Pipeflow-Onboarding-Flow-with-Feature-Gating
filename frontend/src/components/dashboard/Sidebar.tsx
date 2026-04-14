import { NavLink, useNavigate } from 'react-router-dom'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { FeatureKey } from '@/types/plan.types'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { cn, getInitials } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'
import { api } from '@/lib/api'

const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    className={cn('w-3.5 h-3.5 flex-shrink-0', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
)

const icons = {
  home:         'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  projects:     'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z',
  analytics:    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  integrations: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
  team:         'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  reports:      'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  lock:         'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  logout:       'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
}

interface NavItem {
  label: string
  path: string
  iconPath: string
  featureKey?: FeatureKey
}

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Home',     path: '/dashboard',          iconPath: icons.home },
      { label: 'Projects', path: '/dashboard/projects', iconPath: icons.projects, featureKey: 'projects' as FeatureKey },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', path: '/dashboard/analytics', iconPath: icons.analytics, featureKey: 'analytics' as FeatureKey },
      { label: 'Reports',   path: '/dashboard/reports',   iconPath: icons.reports,   featureKey: 'reports' as FeatureKey },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Integrations', path: '/dashboard/integrations', iconPath: icons.integrations, featureKey: 'integrations' as FeatureKey },
      { label: 'Team',         path: '/dashboard/team',         iconPath: icons.team,         featureKey: 'team_management' as FeatureKey },
    ],
  },
]

function NavItemComponent({ item }: { item: NavItem }) {
  const gate = item.featureKey
    ? useFeatureGate(item.featureKey)
    : { enabled: true, reason: null, label: item.label, description: '', requiredStep: undefined, requiredPlan: undefined }

  const isLocked = !gate.enabled

  const linkContent = (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      onClick={(e) => { if (isLocked) e.preventDefault() }}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-100 w-full',
          isActive && !isLocked
            ? 'bg-[#d4ceca] text-[#1c1714]'
            : isLocked
            ? 'text-[#5c5148] cursor-not-allowed'
            : 'text-[#3d3530] hover:text-[#1c1714] hover:bg-[#d4ceca]'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            d={item.iconPath}
            className={cn(
              'transition-colors',
              isActive && !isLocked
                ? 'text-brand-600'
                : isLocked
                ? 'text-[#a09690]'
                : 'text-[#5c5148] group-hover:text-[#2a2422]'
            )}
          />
          <span className="flex-1 truncate">{item.label}</span>
          {isLocked && (
            <Icon d={icons.lock} className="w-3 h-3 text-[#a09690]" />
          )}
        </>
      )}
    </NavLink>
  )

  if (isLocked) {
    const tip = gate.reason === 'plan'
      ? `Requires ${gate.requiredPlan} plan`
      : `Complete step ${gate.requiredStep} to unlock`
    return <Tooltip content={tip} position="right">{linkContent}</Tooltip>
  }

  return linkContent
}

export function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { completedSteps } = useOnboardingStore()
  const onboardingIncomplete = !user?.onboardingComplete && completedSteps.length > 0

  async function handleLogout() {
    try { await api.post('/auth/logout') } finally {
      logout()
      navigate('/', { replace: true })
    }
  }

  const planLabel = user?.plan
    ? user.plan.charAt(0) + user.plan.slice(1).toLowerCase()
    : ''

  return (
    <aside className="w-52 bg-[#ede8e7] flex flex-col flex-shrink-0 h-full border-r border-[#d4ceca]">
      {/* Logo */}
      <div className="px-4 py-3.5 border-b border-[#d4ceca]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-300 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-[#1c1714] text-2xs font-bold tracking-tight">PF</span>
          </div>
          <span className="text-sm font-semibold text-[#1c1714] tracking-tight">Pipeflow</span>
        </div>
      </div>

      {/* Finish setup prompt */}
      {onboardingIncomplete && (
        <div className="px-3 pt-3">
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded bg-brand-300/15 border border-brand-500/25 hover:bg-brand-300/25 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-dot flex-shrink-0" />
            <span className="text-xs font-medium text-brand-600 text-left leading-none">
              Finish setup
            </span>
          </button>
        </div>
      )}

      {/* Nav sections */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-2xs font-semibold text-[#5c5148] uppercase tracking-widest px-2.5 mb-1">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavItemComponent key={item.path} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#d4ceca] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-sm bg-brand-300 flex items-center justify-center text-[#1c1714] text-2xs font-bold flex-shrink-0">
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1c1714] truncate leading-none mb-0.5">
              {user?.name}
            </p>
            <p className="text-2xs text-[#5c5148] truncate leading-none">
              {planLabel} plan
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-[#5c5148] hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Icon d={icons.logout} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}