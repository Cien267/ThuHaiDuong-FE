import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import type { UserRole } from '@/features/auth/types/auth.types'

interface RoleRouteProps {
  minRole: UserRole
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ minRole }) => {
  const { isInitialized, hasMinRole } = useAuthStore()

  if (!isInitialized) return null

  return hasMinRole(minRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  )
}
