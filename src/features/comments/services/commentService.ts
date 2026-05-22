import api from '@/services/api'
import type { PagedResult } from '@/features/categories/types/category.types'
import type { CommentQuery, CommentResult } from '../types/comment.types'

export const commentService = {
  getAdminComments: async (
    query: CommentQuery
  ): Promise<PagedResult<CommentResult>> => {
    const { data } = await api.get('admin/comments', { params: query })
    return data
  },

  toggleHide: async (id: string): Promise<void> => {
    await api.patch(`admin/comments/${id}/toggle-hide`)
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`admin/comments/${id}`)
  },
}
