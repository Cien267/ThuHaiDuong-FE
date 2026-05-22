export interface CommentAuthorInfo {
  userId: string | null
  userName: string | null
  avatar: string | null
  guestName: string | null
  isGuest: boolean
}

export interface CommentResult {
  id: string
  storyId: string
  chapterId: string | null
  parentCommentId: string | null
  content: string
  likeCount: number
  isHidden: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  author: CommentAuthorInfo
  replies: CommentResult[]
}

export interface CommentQuery {
  storyId?: string
  chapterId?: string
  isHidden?: boolean
  isGuest?: boolean
  pageNumber?: number
  pageSize?: number
}
