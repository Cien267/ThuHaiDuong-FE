import api from '@/services/api'
import type { PagedResult } from '@/features/categories/types/category.types'
import type {
  RatingQuery,
  RatingResult,
  RatingSummary,
} from '../types/rating.types'

export const ratingService = {
  getSummary: async (storyId: string): Promise<RatingSummary> => {
    const { data } = await api.get(`ratings/stories/${storyId}`)
    return data
  },

  getAdminList: async (
    query: RatingQuery
  ): Promise<PagedResult<RatingResult>> => {
    const { data } = await api.get('admin/ratings', { params: query })
    return data
  },

  deleteRating: async (id: string): Promise<void> => {
    await api.delete(`admin/ratings/${id}`)
  },
}
