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
    api.get('/api/admin/stories', { params }).then((r) => r.data),

  // ── Admin detail ───────────────────────────────────────────────────────────
  getById: (id: string): Promise<StoryDetail> =>
    api.get(`/api/admin/stories/${id}`).then((r) => r.data),

  // ── Pending review list (SuperAdmin) ───────────────────────────────────────
  getPending: (
    params: StoryAdminQuery
  ): Promise<PagedResult<StoryAdminResult>> =>
    api.get('/api/superadmin/stories/pending', { params }).then((r) => r.data),

  // ── Create (Portal) ────────────────────────────────────────────────────────
  create: (data: StoryFormValues): Promise<StoryAdminResult> =>
    api.post('/api/portal/stories', data).then((r) => r.data),

  // ── Update (Portal) ────────────────────────────────────────────────────────
  update: (id: string, data: StoryFormValues): Promise<StoryAdminResult> =>
    api.put(`/api/portal/stories/${id}`, data).then((r) => r.data),

  // ── Submit for review (Portal) ─────────────────────────────────────────────
  submitForReview: (id: string): Promise<void> =>
    api.post(`/api/portal/stories/${id}/submit`).then(() => undefined),

  // ── Update status (Admin) ──────────────────────────────────────────────────
  updateStatus: (id: string, data: UpdateStoryStatusValues): Promise<void> =>
    api.put(`/api/admin/stories/${id}/status`, data).then(() => undefined),

  // ── Review — Approve / Reject (SuperAdmin) ─────────────────────────────────
  review: (id: string, data: ReviewStoryValues): Promise<void> =>
    api.put(`/api/superadmin/stories/${id}/review`, data).then(() => undefined),

  // ── Delete (Portal) ────────────────────────────────────────────────────────
  delete: (id: string): Promise<void> =>
    api.delete(`/api/portal/stories/${id}`).then(() => undefined),
}
