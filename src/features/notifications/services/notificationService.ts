import api from '@/services/api'
import type {
  NotificationResult,
  UnreadCountResult,
} from '../types/notification.types'
import type { PagedResult } from '@/features/categories/types/category.types'

export const notificationService = {
  getList: async (
    page = 1,
    pageSize = 20
  ): Promise<PagedResult<NotificationResult>> => {
    const { data } = await api.get('/notifications', {
      params: { page, pageSize },
    })
    return data
  },

  getUnreadCount: async (): Promise<UnreadCountResult> => {
    const { data } = await api.get('/notifications/unread-count')
    return data
  },

  markRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`)
  },

  markAllRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all')
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`)
  },
}
