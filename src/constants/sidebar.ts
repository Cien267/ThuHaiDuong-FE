import {
  LayoutDashboard,
  BookOpen,
  FileText,
  User,
  Users,
  Tag,
  Folder,
  MessageSquare,
  Star,
  Bookmark,
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
        path: '/stories',
      },
      {
        id: 'chapters',
        label: 'Chương',
        icon: FileText,
        path: '/chapters',
      },
      {
        id: 'authors',
        label: 'Tác giả',
        icon: User,
        path: '/authors',
      },
      {
        id: 'categories',
        label: 'Thể loại',
        icon: Folder,
        path: '/categories',
      },
      {
        id: 'tags',
        label: 'Thẻ',
        icon: Tag,
        path: '/tags',
      },
    ],
  },

  {
    id: 'engagement',
    label: 'Tương tác',
    icon: MessageSquare,
    path: '/engagement',
    children: [
      {
        id: 'comments',
        label: 'Bình luận',
        icon: MessageSquare,
        path: '/comments',
      },
      {
        id: 'ratings',
        label: 'Đánh giá',
        icon: Star,
        path: '/ratings',
      },
      {
        id: 'bookmarks',
        label: 'Lưu truyện',
        icon: Bookmark,
        path: '/bookmarks',
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
        id: 'affiliate-clicks',
        label: 'Lượt click',
        icon: BarChart3,
        path: '/affiliate/clicks',
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
        id: 'story-stats',
        label: 'Thống kê truyện',
        icon: BarChart3,
        path: '/analytics/stories',
      },
      {
        id: 'chapter-views',
        label: 'Lượt xem chương',
        icon: LineChart,
        path: '/analytics/chapters',
      },
      {
        id: 'daily-stats',
        label: 'Thống kê theo ngày',
        icon: LineChart,
        path: '/analytics/daily',
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
