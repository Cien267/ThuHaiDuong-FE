import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { COMMENT_QUERY_KEYS } from '../constants/comment.constants'
import { commentService } from '../services/commentService'
import type { CommentQuery } from '../types/comment.types'

export const useComments = (query: CommentQuery) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.list(query as Record<string, unknown>),
    queryFn: () => commentService.getAdminComments(query),
  })
}

export const useToggleHideComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: commentService.toggleHide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.lists() })
      toast.success('Đã cập nhật trạng thái hiển thị')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: commentService.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.lists() })
      toast.success('Đã xóa bình luận')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
