'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, CheckCheck, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotificationList,
  useUnreadCount,
} from '../hooks/useNotifications'
import type { NotificationResult } from '../types/notification.types'
import { formatDate } from '@/lib/utils'
import { TYPE_META } from '../constants/notification.constants'

// ── NotificationItem ──────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: NotificationResult
  onClose: () => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const navigate = useNavigate()
  const markRead = useMarkRead()
  const deleteNotif = useDeleteNotification()
  const meta = TYPE_META[notification.type]

  const handleClick = async () => {
    if (!notification.isRead) {
      markRead.mutate(notification.id)
    }
    if (notification.referenceId) {
      navigate(`/content/stories/${notification.referenceId}`)
      onClose()
    }
  }

  return (
    <div
      className={`
        group relative flex items-start gap-3 px-4 py-3 transition-colors
        ${notification.isRead ? 'opacity-60' : 'bg-primary/5'}
        ${notification.referenceId ? 'cursor-pointer hover:bg-muted/60' : ''}
      `}
      onClick={handleClick}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute left-1.5 top-4 h-1.5 w-1.5 rounded-full bg-primary" />
      )}

      {/* Icon */}
      <span className="mt-0.5 text-lg shrink-0">
        {meta ? <meta.icon className={`size-5 ${meta.className}`} /> : '🔔'}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {formatDate(notification.createdAt)}
        </p>
      </div>

      {/* Actions — hiện khi hover */}
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => markRead.mutate(notification.id)}
            disabled={markRead.isPending}
            title="Đánh dấu đã đọc"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={() => deleteNotif.mutate(notification.id)}
          disabled={deleteNotif.isPending}
          title="Xóa"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ── NotificationBell ──────────────────────────────────────────────────────────

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [page] = useState(1)

  const { data: unreadData } = useUnreadCount()
  const { data: listData, isLoading } = useNotificationList(page)
  const markAllRead = useMarkAllRead()

  const unreadCount = unreadData?.count ?? 0
  const notifications = listData?.data ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center bg-destructive hover:bg-destructive border-background border-2">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Thông báo</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} chưa đọc
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 gap-1"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Đọc tất cả
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              Đang tải...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <BookOpen className="h-8 w-8 opacity-30" />
              <p className="text-sm">Không có thông báo nào</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
