import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import AnalyticsDashboardPage from '@/features/analytics/pages/AnalyticsDashboardPage'

export default function HomePage() {
  const { hasMinRole } = useAuthStore()

  if (hasMinRole('Admin')) {
    return <AnalyticsDashboardPage />
  }

  return <Navigate to="/content/stories" replace />
}
