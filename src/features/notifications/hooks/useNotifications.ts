import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationService } from '../services/notificationService'
import { notificationHub } from '../services/notificationHub'
import {
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_QUERY_KEYS,
} from '../constants/notification.constants'
import type { NotificationResult } from '../types/notification.types'
import useAuthStore from '@/store/authStore'

// ── Queries ───────────────────────────────────────────────────────────────────

export const useNotificationList = (page = 1) =>
  useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(page),
    queryFn: () => notificationService.getList(page, NOTIFICATION_PAGE_SIZE),
  })

export const useUnreadCount = () =>
  useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60_000, // fallback polling mỗi 1 phút nếu SignalR mất kết nối
  })

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useMarkRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
      })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.list(1),
      })
    },
  })
}

export const useMarkAllRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
      })
      // Invalidate tất cả notification list pages
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all })
    },
  })
}

// ── SignalR hook — dùng 1 lần ở root layout ───────────────────────────────────

export const useNotificationHub = () => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    let cleanup: (() => void) | undefined

    const connect = async () => {
      try {
        await notificationHub.start()

        // Khi nhận notification mới từ server:
        cleanup = notificationHub.onReceive((raw) => {
          const notification = raw as NotificationResult

          // 1. Hiện toast
          toast(notification.title, {
            description: notification.message,
            duration: 6000,
          })

          // 2. Invalidate unread count → badge tự cập nhật
          queryClient.invalidateQueries({
            queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
          })

          // 3. Invalidate list page 1 → dropdown tự cập nhật nếu đang mở
          queryClient.invalidateQueries({
            queryKey: NOTIFICATION_QUERY_KEYS.list(1),
          })
        })
      } catch (err) {
        console.error('[SignalR] Failed to connect:', err)
      }
    }

    connect()

    return () => {
      cleanup?.()
      notificationHub.stop()
    }
  }, [isAuthenticated, queryClient])
}
