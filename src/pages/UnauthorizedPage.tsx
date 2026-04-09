import { Link } from 'react-router-dom'
import { ShieldAlert, Home } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'

export const UnauthorizedPage = () => {
  usePageTitle('Unauthorized Access')
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-orange-100 rounded-full">
            <ShieldAlert className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>

        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          {user && (
            <span className="block mt-2 text-sm">
              Current role:{' '}
              <span className="font-semibold">{user.roles[0]}</span>
            </span>
          )}
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedPage
