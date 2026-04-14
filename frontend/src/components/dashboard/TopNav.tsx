import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { PlanBadge } from '@/components/feature-gate/PlanBadge'
import { getInitials } from '@/lib/utils'
import { api } from '@/lib/api'

export function TopNav() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { completedSteps } = useOnboardingStore()
  const [menuOpen, setMenuOpen] = useState(false)

  // Only show resume button if genuinely incomplete AND has some progress
  const onboardingIncomplete =
    !user?.onboardingComplete && completedSteps.length > 0

  async function handleLogout() {
    try {
      await api.post('/auth/logout')
    } finally {
      logout()
      navigate('/', { replace: true })
    }
  }

  return (
    <header className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
        <span className="font-bold text-slate-900 text-sm">Pipeflow</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {onboardingIncomplete && (
          <button
            onClick={() => navigate('/onboarding')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Finish setup
          </button>
        )}

        {user && <PlanBadge plan={user.plan} />}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold hover:bg-brand-700 transition-colors"
          >
            {user ? getInitials(user.name) : '?'}
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-20 bg-white border border-slate-100 rounded-xl shadow-lg w-52 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}