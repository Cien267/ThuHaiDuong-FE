import {
  LayoutDashboard,
  SquareUserRound,
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: string | number
  roles?: string[]
  children?: MenuItem[]
}

export const SIDEBAR_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'staffs',
    label: 'Staffs',
    icon: SquareUserRound,
    path: '/staffs',
  },
]
