import api from '@/services/api'
import type {
  ChapterAdminQuery,
  ChapterAdminResult,
  ChapterListItem,
  ChapterFormValues,
  UpdateChapterInput,
  UpdateChapterStatusInput,
} from '../types/chapter.types'
import type { PagedResult } from '@/features/categories/types/category.types'

export const chapterService = {
  // Admin: danh sách chapter của 1 story (tất cả status)
  getList: (params: ChapterAdminQuery): Promise<PagedResult<ChapterListItem>> =>
    api.get('/admin/chapters', { params }).then((r) => r.data),

  // Admin: chi tiết chapter (có content)
  getById: (id: string): Promise<ChapterAdminResult> =>
    api.get(`/admin/chapters/${id}`).then((r) => r.data),

  // Portal: tạo chapter mới
  create: (data: ChapterFormValues): Promise<ChapterAdminResult> =>
    api.post('/portal/chapters', data).then((r) => r.data),

  // Portal: cập nhật nội dung chapter
  update: (id: string, data: UpdateChapterInput): Promise<ChapterAdminResult> =>
    api.put(`/portal/chapters/${id}`, data).then((r) => r.data),

  // Portal: đổi status (Draft | Published | Hidden)
  updateStatus: (id: string, data: UpdateChapterStatusInput): Promise<void> =>
    api.patch(`/portal/chapters/${id}/status`, data).then(() => undefined),

  // Portal: xóa mềm
  delete: (id: string): Promise<void> =>
    api.delete(`/portal/chapters/${id}`).then(() => undefined),
}
