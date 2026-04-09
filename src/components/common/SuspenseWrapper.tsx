import { Suspense } from "react"

export const PageLoader = () => (
  <div
    className="fixed inset-0 z-50
    flex items-center justify-center
    bg-background/50 backdrop-blur-xs"
  >
    <span className="page-loader"></span>
  </div>
)

export const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<PageLoader />}>{children}</Suspense>

export default SuspenseWrapper
