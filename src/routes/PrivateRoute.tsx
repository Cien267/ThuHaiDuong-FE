import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuthStore()

  if (!isInitialized) return null

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
