import type { NotificationType } from '../types/notification.types'
import {
  Send,
  Repeat1,
  CircleCheckBig,
  CircleOff,
  type LucideIcon,
} from 'lucide-react'

export const NOTIFICATION_QUERY_KEYS = {
  all: ['notifications'] as const,
  list: (page: number) => ['notifications', 'list', page] as const,
  unreadCount: () => ['notifications', 'unread-count'] as const,
}

export const NOTIFICATION_PAGE_SIZE = 20

export const NOTIFICATION_LABELS: Record<string, string> = {
  StorySubmitted: 'Truyện mới cần duyệt',
  StoryResubmitted: 'Truyện gửi lại cần duyệt',
  StoryApproved: 'Truyện được duyệt',
  StoryRejected: 'Truyện bị từ chối',
}

export const TYPE_META: Record<
  NotificationType,
  {
    icon: LucideIcon
    className: string
  }
> = {
  StorySubmitted: {
    icon: Send,
    className: 'text-blue-500',
  },
  StoryResubmitted: {
    icon: Repeat1,
    className: 'text-amber-500',
  },
  StoryApproved: {
    icon: CircleCheckBig,
    className: 'text-green-500',
  },
  StoryRejected: {
    icon: CircleOff,
    className: 'text-red-500',
  },
}
