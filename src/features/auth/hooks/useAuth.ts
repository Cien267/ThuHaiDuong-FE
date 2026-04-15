import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import type {
  ChangePasswordInput,
  LoginInput,
  UpdateProfileInput,
} from '../types/auth.types'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  users: () => [...authKeys.all, 'users'] as const,
}

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setAuth, logout: logoutStore, user, isAuthenticated } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      localStorage.setItem('token', data.accessToken)
      queryClient.invalidateQueries({ queryKey: authKeys.me() })

      navigate('/dashboard')
    },
    onError: (error: any) => {
      console.error('Login error:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logoutStore()
      localStorage.removeItem('token')
      queryClient.clear()
      navigate('/login')
    },
    onError: (error: any) => {
      console.error('Logout error:', error)
      toast.error(error.message || 'Failed to log out')
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => {
      data.id = user?.id
      return authService.updateProfile(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
      toast.success('Profile updated successfully!')
    },
    onError: (error: any) => {
      console.error('Update profile error:', error)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => {
      data.id = user?.id
      return authService.changePassword(data)
    },
    onSuccess: () => {
      toast.success(
        'Password updated successfully! You will be logged out in 3s...'
      )
      setTimeout(() => {
        logoutStore()
        localStorage.removeItem('token')
        queryClient.clear()
        navigate('/login')
      }, 3000)
    },
    onError: (error: any) => {
      console.error('Change password error:', error)
    },
  })

  const currentUserQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && !!localStorage.getItem('token'),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  const { data, isSuccess, isError } = currentUserQuery

  useEffect(() => {
    if (isSuccess && data) {
      setAuth(data, localStorage.getItem('token') || '')
    }
  }, [isSuccess, data, user?.id, setAuth])

  useEffect(() => {
    if (isError) {
      logoutStore()
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [isError, logoutStore, navigate])

  return {
    user,
    isAuthenticated,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    currentUser: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading,
    isFetchingUser: currentUserQuery.isFetching,
    userError: currentUserQuery.error,
    refetchUser: currentUserQuery.refetch,

    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
  }
}

export const useRequireAuth = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoadingUser } = useAuth()

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoadingUser, navigate])

  return { isAuthenticated, isLoadingUser }
}

export const usePermission = (requiredRole?: string) => {
  const { user } = useAuth()

  const hasPermission = useMemo(() => {
    if (!user || !requiredRole) return true

    const roleHierarchy: Record<string, number> = {
      user: 1,
      manager: 2,
      admin: 3,
    }

    return user.roles.some((role) => {
      return (roleHierarchy[role] || 0) >= (roleHierarchy[requiredRole] || 0)
    })
  }, [user, requiredRole])

  return { hasPermission, user }
}
