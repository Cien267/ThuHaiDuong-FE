import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'

const NON_CLICKABLE_ROUTES: string[] = []

export const HeaderBreadcrumb: React.FC = () => {
  const location = useLocation()
  const labels = useBreadcrumbStore((state) => state.labels)
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          const isUnclickable = NON_CLICKABLE_ROUTES.includes(
            name.toLowerCase()
          )

          const displayLabel = labels[name] || name

          return (
            <span key={name} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 mr-2" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast || isUnclickable ? (
                  <BreadcrumbPage className="capitalize">
                    {displayLabel.replace(/-/g, ' ')}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo} className="capitalize">
                      {displayLabel.replace(/-/g, ' ')}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
