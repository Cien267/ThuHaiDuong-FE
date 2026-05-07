import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/home'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
