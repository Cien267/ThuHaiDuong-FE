// store/authStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  UserAuthInfo,
  UserProfile,
  UserRole,
} from '@/features/auth/types/auth.types'
import { ROLE_HIERARCHY } from '@/features/auth/types/auth.types'
import {
  tokenStorage,
  getUserFromToken,
  isTokenValid,
} from '@/features/auth/utils/token'
import type { StaffProfileResult } from '@/features/profile/types/profile.types'

interface AuthState {
  user: UserAuthInfo | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isInitialized: boolean

  // Actions
  initializeFromToken: () => void
  setAuthFromResult: (
    user: UserAuthInfo,
    accessToken: string,
    refreshToken: string
  ) => void
  setProfile: (profile: StaffProfileResult) => void
  updateUserInfo: (partial: Partial<UserAuthInfo>) => void
  logout: () => void
  hasRole: (requiredRole: UserRole) => boolean
  hasMinRole: (minRole: UserRole) => boolean
}

const getInitialAuthState = (): Pick<
  AuthState,
  'user' | 'isAuthenticated' | 'isInitialized'
> => {
  const accessToken = tokenStorage.getAccess()

  if (!accessToken || !isTokenValid(accessToken)) {
    return { user: null, isAuthenticated: false, isInitialized: true }
  }

  const user = getUserFromToken(accessToken)
  return {
    user,
    isAuthenticated: user !== null,
    isInitialized: true,
  }
}

const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      ...getInitialAuthState(),
      profile: null,

      initializeFromToken: () => {
        const accessToken = tokenStorage.getAccess()

        if (!accessToken || !isTokenValid(accessToken)) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isInitialized: true,
          })
          return
        }

        const user = getUserFromToken(accessToken)
        set({
          user,
          isAuthenticated: user !== null,
          isInitialized: true,
        })
      },

      setAuthFromResult: (user, accessToken, refreshToken) => {
        tokenStorage.set(accessToken, refreshToken)
        set({
          user,
          isAuthenticated: true,
        })
      },

      setProfile: (profile) => {
        set((state) => ({
          profile,
          user: state.user
            ? {
                ...state.user,
                fullName: profile.fullName,
                avatar: profile.avatar,
              }
            : null,
        }))
      },

      updateUserInfo: (partial) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }))
      },

      logout: () => {
        tokenStorage.clear()
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
        })
      },

      hasRole: (requiredRole) => {
        const { user } = get()
        return user?.role === requiredRole
      },

      hasMinRole: (minRole) => {
        const { user } = get()
        if (!user) return false
        return (
          (ROLE_HIERARCHY[user.role] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0)
        )
      },
    }),
    { name: 'AuthStore' }
  )
)

export default useAuthStore
