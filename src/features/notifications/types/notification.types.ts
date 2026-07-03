export type NotificationType =
  | 'StorySubmitted'
  | 'StoryResubmitted'
  | 'StoryApproved'
  | 'StoryRejected'

export interface NotificationResult {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  referenceId: string | null // storyId để navigate
  createdAt: string
}

export interface UnreadCountResult {
  count: number
}
