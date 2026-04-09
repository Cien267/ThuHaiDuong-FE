import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom"
import { AlertTriangle, Home } from "lucide-react"

export const ErrorPage = () => {
  const error = useRouteError()

  let errorMessage: string
  let errorStatus: number | undefined

  if (isRouteErrorResponse(error)) {
    errorMessage =
      error.statusText || error.data?.message || "An error occurred"
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = "Unknown error occurred"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {errorStatus ? `Error ${errorStatus}` : "Oops!"}
        </h1>

        <p className="text-gray-600 mb-6">{errorMessage}</p>

        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
