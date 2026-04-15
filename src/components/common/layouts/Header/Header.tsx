import { Search, User, LogOut, Moon, Sun, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { HeaderBreadcrumb } from '@/components/common/layouts/Header/Breadcrumb'
import { openEditProfileModal } from './Profile'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const getUserInitials = () => {
    if (!user?.fullName) return 'Admin'
    return user.fullName.split(' ')[0].toUpperCase()
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6 pl-18">
      <div className="flex flex-1 items-center gap-4">
        <HeaderBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* <Notifications /> */}

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 hover:bg-accent"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.avatar} alt={user?.fullName} />
                <AvatarFallback>{getUserInitials().charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{getUserInitials()}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || 'admin@gmail.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User className="mr-2 h-4 w-4" />
                <span className="w-full" onClick={openEditProfileModal}>
                  Profile
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
