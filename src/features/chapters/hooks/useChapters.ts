import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { chapterService } from '../services/chapterService'
import { chapterKeys, CHAPTER_PAGE_SIZE } from '../constants/chapter.constants'
import { storyKeys } from '@/features/stories/constants/story.constants'
import type {
  ChapterAdminQuery,
  ChapterFormValues,
  UpdateChapterInput,
  UpdateChapterStatusInput,
} from '../types/chapter.types'

// ── List ───────────────────────────────────────────────────────────────────────

export const useChapterList = (query: ChapterAdminQuery) =>
  useQuery({
    queryKey: chapterKeys.list(query),
    queryFn: () =>
      chapterService.getList({
        pageSize: CHAPTER_PAGE_SIZE,
        sortBy: 'ChapterNumber',
        ...query,
      }),
    enabled: !!query.storyId,
    staleTime: 1000 * 60,
  })

// ── Detail ─────────────────────────────────────────────────────────────────────

export const useChapterDetail = (id: string) =>
  useQuery({
    queryKey: chapterKeys.detail(id),
    queryFn: () => chapterService.getById(id),
    enabled: !!id,
  })

// ── Create ─────────────────────────────────────────────────────────────────────

export const useCreateChapter = (storyId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ChapterFormValues) => chapterService.create(data),
    onSuccess: (result) => {
      // Invalidate chapter list + story detail (TotalChapters thay đổi)
      queryClient.invalidateQueries({ queryKey: chapterKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(storyId) })
      toast.success(`Chapter ${result.chapterNumber} created.`)
      navigate(`/content/stories/${storyId}/chapters/${result.id}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to create chapter.')
    },
  })
}

// ── Update ─────────────────────────────────────────────────────────────────────

export const useUpdateChapter = (storyId: string, id: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: UpdateChapterInput) => chapterService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: chapterKeys.lists() })
      toast.success('Chapter updated.')
      navigate(`/content/stories/${storyId}/chapters/${id}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to update chapter.')
    },
  })
}

// ── Update Status ──────────────────────────────────────────────────────────────

export const useUpdateChapterStatus = (id: string, storyId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateChapterStatusInput) =>
      chapterService.updateStatus(id, data),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: chapterKeys.lists() })
      // Sync TotalChapters trên story khi publish/unpublish
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(storyId) })
      toast.success(
        `Chapter ${status === 'Published' ? 'published' : status === 'Hidden' ? 'hidden' : 'moved to draft'}.`
      )
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to update status.')
    },
  })
}

// ── Delete ─────────────────────────────────────────────────────────────────────

export const useDeleteChapter = (storyId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => chapterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(storyId) })
      toast.success('Chapter deleted.')
      navigate(`/content/stories/${storyId}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to delete chapter.')
    },
  })
}
