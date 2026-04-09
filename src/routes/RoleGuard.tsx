import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface RoleGuardProps {
  allowedRoles: string[]
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const { user, isLoadingUser } = useAuth()

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  const hasPermission = user && allowedRoles.includes(user.role)

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
