import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { profileService } from '@/features/profile/services/profileService'
import { authService } from '../services/authService'
import useAuthStore from '@/store/authStore'
import type {
  LoginInput,
  ChangePasswordInput,
  UserRole,
} from '../types/auth.types'

export const authKeys = {
  all: ['auth'] as const,
  profile: () => ['profile'] as const,
}
export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    user,
    profile,
    isAuthenticated,
    isInitialized,
    setAuthFromResult,
    setProfile,
    logout: logoutStore,
    hasRole,
    hasMinRole,
  } = useAuthStore()

  // Fetch profile after login
  const profileQuery = useQuery({
    queryKey: authKeys.profile(),
    queryFn: profileService.getMyProfile,
    enabled: isAuthenticated && isInitialized,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  useEffect(() => {
    if (profileQuery.isSuccess && profileQuery.data) {
      setProfile(profileQuery.data)
    }
  }, [profileQuery.isSuccess, profileQuery.data, setProfile])

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) => authService.login(credentials),
    onSuccess: (data) => {
      setAuthFromResult(data.user, data.accessToken, data.refreshToken)
      const destination = hasMinRole('Admin') ? '/home' : '/content/stories'
      navigate(destination)
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Login failed. Please try again.')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logoutStore()
      queryClient.clear()
      navigate('/login')
    },
    onError: (error: any) => {
      console.error('Logout error:', error)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed. You will be logged out in 3 seconds...')
      setTimeout(() => {
        logoutStore()
        queryClient.clear()
        navigate('/login')
      }, 3000)
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to change password.')
    },
  })

  return {
    // ── State ────────────────────────────────────────────────────────────────
    user,
    profile,
    isAuthenticated,
    isInitialized,
    isLoadingProfile: profileQuery.isLoading,

    // ── Permission helpers ────────────────────────────────────────────────────
    hasRole, // hasRole('Admin')
    hasMinRole, // hasMinRole('Contributor')

    // ── Login ─────────────────────────────────────────────────────────────────
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // ── Logout ────────────────────────────────────────────────────────────────
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // ── Password ──────────────────────────────────────────────────────────────
    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  }
}

export const useRequireAuth = (minRole?: UserRole) => {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized, hasMinRole } = useAuthStore()

  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    if (minRole && !hasMinRole(minRole)) {
      navigate('/403', { replace: true })
    }
  }, [isAuthenticated, isInitialized, minRole, navigate, hasMinRole])

  return { isAuthenticated, isInitialized }
}

export const usePermission = (minRole?: UserRole) => {
  const { hasMinRole, user } = useAuthStore()

  return {
    hasPermission: !minRole || hasMinRole(minRole),
    user,
    role: user?.role ?? null,
  }
}
