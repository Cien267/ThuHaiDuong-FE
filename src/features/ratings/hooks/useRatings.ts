import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  RATING_PAGE_SIZE,
  RATING_QUERY_KEYS,
} from '../constants/rating.constants'
import { ratingService } from '../services/ratingService'

export const useRatingSummary = (storyId: string) => {
  return useQuery({
    queryKey: RATING_QUERY_KEYS.summary(storyId),
    queryFn: () => ratingService.getSummary(storyId),
    enabled: !!storyId,
  })
}

export const useRatingList = (storyId: string, page: number) => {
  return useQuery({
    queryKey: RATING_QUERY_KEYS.list(storyId, page),
    queryFn: () =>
      ratingService.getAdminList({ storyId, page, pageSize: RATING_PAGE_SIZE }),
    enabled: !!storyId,
  })
}

export const useDeleteRating = (storyId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ratingService.deleteRating,
    onSuccess: () => {
      // Invalidate cả list lẫn summary vì AverageRating + RatingCount thay đổi
      queryClient.invalidateQueries({ queryKey: RATING_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: RATING_QUERY_KEYS.summary(storyId),
      })
      toast.success('Đã xóa đánh giá')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
