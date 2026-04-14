import { NavLink } from 'react-router-dom'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { FeatureKey } from '@/types/plan.types'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'

interface NavItem {
  label: string
  path: string
  icon: string
  featureKey?: FeatureKey
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',        path: '/dashboard',                  icon: '⊞' },
  { label: 'Projects',    path: '/dashboard/projects',         icon: '📋', featureKey: 'projects' },
  { label: 'Analytics',   path: '/dashboard/analytics',        icon: '📊', featureKey: 'analytics' },
  { label: 'Integrations',path: '/dashboard/integrations',     icon: '🔗', featureKey: 'integrations' },
  { label: 'Team',        path: '/dashboard/team',             icon: '👥', featureKey: 'team_management' },
  { label: 'Reports',     path: '/dashboard/reports',          icon: '📈', featureKey: 'reports' },
]

function SidebarItem({ item }: { item: NavItem }) {
  const gate = item.featureKey
    ? useFeatureGate(item.featureKey)
    : { enabled: true, reason: null, label: item.label, description: '' }

  const isLocked = !gate.enabled

  const content = (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      onClick={(e) => {
        // Locked nav items don't navigate — they just show tooltip
        if (isLocked) e.preventDefault()
      }}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
          isActive && !isLocked
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          isLocked && 'opacity-50 cursor-not-allowed'
        )
      }
    >
      <span className="text-base leading-none">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {isLocked && (
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      )}
    </NavLink>
  )

  if (isLocked) {
    const tooltipText =
      gate.reason === 'plan'
        ? `Upgrade plan to unlock`
        : `Complete Step ${gate.requiredStep} to unlock`

    return (
      <Tooltip content={tooltipText} position="right">
        {content}
      </Tooltip>
    )
  }

  return content
}

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-slate-100 bg-white flex flex-col flex-shrink-0 h-full">
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} />
        ))}
      </nav>
    </aside>
  )
}