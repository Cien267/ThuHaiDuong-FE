import api from '@/services/api'
import type {
  StoryAdminQuery,
  StoryAdminResult,
  StoryFormValues,
  UpdateStoryStatusValues,
  ReviewStoryValues,
  StoryDetail,
} from '../types/story.types'
import type { PagedResult } from '@/features/categories/types/category.types'

export const storyService = {
  // ── Admin list ─────────────────────────────────────────────────────────────
  getList: (params: StoryAdminQuery): Promise<PagedResult<StoryAdminResult>> =>
    api.get('admin/stories', { params }).then((r) => r.data),

  // ── Admin detail ───────────────────────────────────────────────────────────
  getById: (id: string): Promise<StoryDetail> =>
    api.get(`admin/stories/${id}`).then((r) => r.data),

  // ── Pending review list (SuperAdmin) ───────────────────────────────────────
  getPending: (
    params: StoryAdminQuery
  ): Promise<PagedResult<StoryAdminResult>> =>
    api.get('admin/stories/pending', { params }).then((r) => r.data),

  // ── Create (Portal) ────────────────────────────────────────────────────────
  create: (data: StoryFormValues): Promise<StoryAdminResult> =>
    api.post('portal/stories', data).then((r) => r.data),

  // ── Update (Portal) ────────────────────────────────────────────────────────
  update: (id: string, data: StoryFormValues): Promise<StoryAdminResult> =>
    api.put(`portal/stories/${id}`, data).then((r) => r.data),

  uploadStoryCover: (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<{
        coverImageUrl: string
      }>('portal/stories/upload-cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.coverImageUrl)
  },

  // ── Submit for review (Portal) ─────────────────────────────────────────────
  submitForReview: (id: string): Promise<void> =>
    api.post(`portal/stories/${id}/submit`).then(() => undefined),

  // ── Update status (Admin) ──────────────────────────────────────────────────
  updateStatus: (id: string, data: UpdateStoryStatusValues): Promise<void> =>
    api.put(`admin/stories/${id}/status`, data).then(() => undefined),

  // ── Review — Approve / Reject (SuperAdmin) ─────────────────────────────────
  review: (id: string, data: ReviewStoryValues): Promise<void> =>
    api.put(`superadmin/stories/${id}/review`, data).then(() => undefined),

  // ── Delete (Portal) ────────────────────────────────────────────────────────
  delete: (id: string): Promise<void> =>
    api.delete(`portal/stories/${id}`).then(() => undefined),
}
