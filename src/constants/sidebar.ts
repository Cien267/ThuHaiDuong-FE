import {
  LayoutDashboard,
  BookOpen,
  User,
  Users,
  Tag,
  Folder,
  BarChart3,
  MousePointerClick,
  LineChart,
  Settings,
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
    id: 'home',
    label: 'Tổng quan',
    icon: LayoutDashboard,
    path: '/home',
    roles: ['SuperAdmin', 'Admin'],
  },

  {
    id: 'content',
    label: 'Nội dung',
    icon: BookOpen,
    path: '/content',
    roles: ['Contributor', 'Admin', 'SuperAdmin'],
    children: [
      {
        id: 'stories',
        label: 'Truyện',
        icon: BookOpen,
        path: '/content/stories',
        roles: ['Contributor', 'Admin', 'SuperAdmin'],
      },
      {
        id: 'authors',
        label: 'Tác giả',
        icon: User,
        path: '/content/authors',
        roles: ['Contributor', 'Admin', 'SuperAdmin'],
      },
      {
        id: 'categories',
        label: 'Thể loại',
        icon: Folder,
        path: '/content/categories',
        roles: ['Contributor', 'Admin', 'SuperAdmin'],
      },
      {
        id: 'tags',
        label: 'Thẻ',
        icon: Tag,
        path: '/content/tags',
        roles: ['Contributor', 'Admin', 'SuperAdmin'],
      },
    ],
  },

  {
    id: 'users',
    label: 'Người dùng',
    icon: Users,
    path: '/users',
    roles: ['SuperAdmin'],
    children: [
      {
        id: 'user-list',
        label: 'Danh sách người dùng',
        icon: Users,
        path: '/users',
        roles: ['SuperAdmin'],
      },
    ],
  },

  {
    id: 'affiliate',
    label: 'Affiliate',
    icon: MousePointerClick,
    path: '/affiliate',
    roles: ['SuperAdmin'],
    children: [
      {
        id: 'affiliate-links',
        label: 'Link Affiliate',
        icon: MousePointerClick,
        path: '/affiliate/links',
        roles: ['SuperAdmin'],
      },
      {
        id: 'affiliate-reports',
        label: 'Báo cáo',
        icon: BarChart3,
        path: '/affiliate/reports',
        roles: ['SuperAdmin'],
      },
    ],
  },

  {
    id: 'analytics',
    label: 'Thống kê',
    icon: LineChart,
    path: '/analytics',
    roles: ['SuperAdmin', 'Admin'],
    children: [
      {
        id: 'top-story',
        label: 'Top truyện',
        icon: BarChart3,
        path: '/analytics/top-stories',
        roles: ['SuperAdmin', 'Admin'],
      },
      {
        id: 'top-chapters',
        label: 'Top chương',
        icon: LineChart,
        path: '/analytics/top-chapters',
        roles: ['SuperAdmin', 'Admin'],
      },
    ],
  },

  {
    id: 'system',
    label: 'Hệ thống',
    icon: Settings,
    path: '/system',
    children: [
      {
        id: 'settings',
        label: 'Cài đặt',
        icon: Settings,
        path: '/settings',
      },
    ],
  },
]
