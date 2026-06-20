import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { storyService } from '../services/storyService'
import { storyKeys, STORY_PAGE_SIZE } from '../constants/story.constants'
import type {
  StoryAdminQuery,
  StoryFormValues,
  UpdateStoryStatusValues,
  ReviewStoryValues,
} from '../types/story.types'
import useAuthStore from '@/store/authStore'

// ── List ───────────────────────────────────────────────────────────────────────

export const useStoryList = (query: StoryAdminQuery = {}) => {
  const { user } = useAuthStore()

  // Contributor chỉ thấy story của mình
  const params: StoryAdminQuery = {
    pageNumber: 1,
    pageSize: STORY_PAGE_SIZE,
    sortBy: 'LastChapterAt',
    sortDescending: true,
    ...query,
    // Tự động filter theo uploadedByUserId nếu là Contributor
    ...(user?.role === 'Contributor' ? { uploadedByUserId: user.id } : {}),
  }

  return useQuery({
    queryKey: storyKeys.list(params),
    queryFn: () => storyService.getList(params),
    staleTime: 1000 * 60,
  })
}

// ── Detail ─────────────────────────────────────────────────────────────────────

export const useStoryDetail = (id: string) =>
  useQuery({
    queryKey: storyKeys.detail(id),
    queryFn: () => storyService.getById(id),
    enabled: !!id,
  })

// ── Pending (SuperAdmin) ───────────────────────────────────────────────────────

export const usePendingStories = (query: StoryAdminQuery = {}) =>
  useQuery({
    queryKey: storyKeys.pending(),
    queryFn: () => storyService.getPending(query),
    staleTime: 1000 * 30, // refresh thường hơn vì pending list thay đổi nhiều
  })

// ── Create ─────────────────────────────────────────────────────────────────────

export const useCreateStory = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: StoryFormValues) => storyService.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      toast.success('Đã tạo truyện thành công.')
      // Redirect sang trang detail để thêm chapter luôn
      navigate(`/content/stories/${result.id}`)
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to create story.')
    },
  })
}

// ── Update ─────────────────────────────────────────────────────────────────────

export const useUpdateStory = (id: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: StoryFormValues) => storyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(id) })
      toast.success('Đã cập nhật truyện thành công.')
      navigate(`/content/stories/${id}`)
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to update story.')
    },
  })
}

// ── Upload story cover ─────────────────────────────────────────────────────────────────────

export const useUploadStoryCover = () =>
  useMutation({
    mutationFn: (file: File) => storyService.uploadStoryCover(file),
    onError: () => toast.error('Upload ảnh bìa thất bại, vui lòng thử lại'),
  })

// ── Submit for review ──────────────────────────────────────────────────────────

export const useSubmitForReview = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => storyService.submitForReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      toast.success('Đã gửi truyện để xem xét.')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to submit story.')
    },
  })
}

// ── Update status (Admin) ──────────────────────────────────────────────────────

export const useUpdateStoryStatus = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateStoryStatusValues) =>
      storyService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      toast.success('Đã cập nhật trạng thái truyện.')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to update status.')
    },
  })
}

// ── Review (SuperAdmin) ────────────────────────────────────────────────────────

export const useReviewStory = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReviewStoryValues) => storyService.review(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storyKeys.pending() })
      toast.success(
        variables.isApproved ? 'Đã phê duyệt truyện.' : 'Đã từ chối truyện.'
      )
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to review story.')
    },
  })
}

// ── Delete ─────────────────────────────────────────────────────────────────────

export const useDeleteStory = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => storyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      toast.success('Đã xóa truyện.')
      navigate('/content/stories')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to delete story.')
    },
  })
}
