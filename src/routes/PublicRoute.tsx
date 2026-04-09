import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoadingUser } = useAuth()
  const location = useLocation()

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/dashboard"
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
