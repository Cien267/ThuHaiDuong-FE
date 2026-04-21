import { NavLink, useLocation, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import { SIDEBAR_MENU } from '@/constants/sidebar'

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  const filteredMenuItems = SIDEBAR_MENU.filter((item) => {
    if (!item.roles?.length) return true
    return (
      user &&
      user.roles.every((role) => {
        return item.roles?.includes(role)
      })
    )
  })

  const isActiveRoute = (path: string) => {
    if (!path) return false
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    )
  }

  const getUserInitials = () => {
    if (!user?.fullName) return 'Admin'
    return user.fullName.split(' ')[0].toUpperCase()
  }

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {!isMobileOpen && <Menu className="h-5 w-5" />}
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300',
          isCollapsed ? 'w-18' : 'w-64',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!isCollapsed && (
              <Link
                to="/"
                className="text-3xl bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent font-extrabold! inline-block font-[Lavishly_Yours]!"
              >
                Thu Hải Đường
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => toggleCollapse()}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-1">
              <TooltipProvider delayDuration={0}>
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon
                  const hasChildren = item.children?.length
                  const isOpen = openMenus[item.id]
                  const isActive = isActiveRoute(item.path)

                  const baseClasses = cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                    isCollapsed && 'justify-center'
                  )

                  const ParentButton = (
                    <div
                      onClick={() => {
                        if (hasChildren) toggleMenu(item.id)
                        else setIsMobileOpen(false)
                      }}
                      className={baseClasses}
                    >
                      <Icon className="h-5 w-5 shrink-0" />

                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>

                          {item.badge && (
                            <Badge variant="secondary">{item.badge}</Badge>
                          )}

                          {hasChildren && (
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isOpen && 'rotate-180'
                              )}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )

                  const ParentContent = (
                    <div key={item.id}>
                      {hasChildren ? (
                        ParentButton
                      ) : (
                        <NavLink to={item.path} className="block">
                          {ParentButton}
                        </NavLink>
                      )}

                      {hasChildren && isOpen && !isCollapsed && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children!.map((child) => {
                            const ChildIcon = child.icon
                            const childActive = isActiveRoute(child.path)

                            return (
                              <NavLink
                                key={child.id}
                                to={child.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                                  'hover:bg-accent hover:text-accent-foreground',
                                  childActive
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground'
                                )}
                              >
                                <ChildIcon className="h-4 w-4 shrink-0" />
                                <span>{child.label}</span>
                              </NavLink>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>{ParentContent}</TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return ParentContent
                })}
              </TooltipProvider>
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4">
            {!isCollapsed ? (
              <div className="space-y-3">
                <div className="relative h-10 w-full flex items-center gap-2 px-2 justify-start">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback>
                      {getUserInitials().charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {getUserInitials()}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <TooltipProvider>
                <div className="space-y-2">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="" alt={user?.fullName} />
                    <AvatarFallback>
                      {getUserInitials().charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-full"
                        onClick={() => logout()}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Đăng xuất</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
          </div>
        </div>
      </aside>

      <div
        className={cn(
          'hidden lg:block transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      />
    </>
  )
}
