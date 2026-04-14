import { useAuthStore } from '@/stores/auth.store'
import { useFeatureStore } from '@/stores/feature.store'

/**
 * Primary auth hook — exposes user state and auth actions.
 * Automatically syncs plan to feature store on auth changes.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useAuthStore((s) => s.logout)
  const setPlan = useFeatureStore((s) => s.setPlan)

  function login(user: Parameters<typeof setAuth>[0], token: string) {
    setAuth(user, token)
    setPlan(user.plan)
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}