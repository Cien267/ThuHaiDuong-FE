import {
  LayoutDashboard,
  BookOpen,
  User,
  Users,
  Tag,
  Folder,
  CreditCard,
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
  },

  {
    id: 'content',
    label: 'Nội dung',
    icon: BookOpen,
    path: '/content',
    children: [
      {
        id: 'stories',
        label: 'Truyện',
        icon: BookOpen,
        path: '/content/stories',
      },
      {
        id: 'authors',
        label: 'Tác giả',
        icon: User,
        path: '/content/authors',
      },
      {
        id: 'categories',
        label: 'Thể loại',
        icon: Folder,
        path: '/content/categories',
      },
      {
        id: 'tags',
        label: 'Thẻ',
        icon: Tag,
        path: '/content/tags',
      },
    ],
  },

  {
    id: 'users',
    label: 'Người dùng',
    icon: Users,
    path: '/users',
    children: [
      {
        id: 'user-list',
        label: 'Danh sách người dùng',
        icon: Users,
        path: '/users',
      },
      {
        id: 'subscriptions',
        label: 'Gói đăng ký',
        icon: CreditCard,
        path: '/subscriptions',
      },
      {
        id: 'reading-progress',
        label: 'Tiến độ đọc',
        icon: BookOpen,
        path: '/reading-progress',
      },
    ],
  },

  {
    id: 'affiliate',
    label: 'Affiliate',
    icon: MousePointerClick,
    path: '/affiliate',
    children: [
      {
        id: 'affiliate-links',
        label: 'Link Affiliate',
        icon: MousePointerClick,
        path: '/affiliate/links',
      },
      {
        id: 'affiliate-reports',
        label: 'Báo cáo',
        icon: BarChart3,
        path: '/affiliate/reports',
      },
    ],
  },

  {
    id: 'analytics',
    label: 'Thống kê',
    icon: LineChart,
    path: '/analytics',
    children: [
      {
        id: 'top-story',
        label: 'Top truyện',
        icon: BarChart3,
        path: '/analytics/top-stories',
      },
      {
        id: 'top-chapters',
        label: 'Top chương',
        icon: LineChart,
        path: '/analytics/top-chapters',
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
        path: '/system/settings',
      },
    ],
  },
]
