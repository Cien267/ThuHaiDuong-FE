import api from '@/services/api'
import type {
  CategoryQuery,
  CategoryResult,
  CategorySummary,
  CategoryFormValues,
  TagQuery,
  TagResult,
  TagFormValues,
  PagedResult,
} from '../types/category.types'

// ── Category ──────────────────────────────────────────────────────────────────

export const categoryService = {
  // Admin: danh sách có phân trang + filter
  getList: (params: CategoryQuery): Promise<PagedResult<CategoryResult>> =>
    api.get('/api/admin/categories', { params }).then((r) => r.data),

  // Admin: chi tiết 1 category
  getById: (id: string): Promise<CategoryResult> =>
    api.get(`/api/admin/categories/${id}`).then((r) => r.data),

  // Client: cây danh mục (dùng để render select parent)
  getTree: (): Promise<CategorySummary[]> =>
    api.get('/api/categories/tree').then((r) => r.data),

  // Admin: tạo mới
  create: (data: CategoryFormValues): Promise<CategoryResult> =>
    api.post('/api/admin/categories', data).then((r) => r.data),

  // Admin: cập nhật
  update: (id: string, data: CategoryFormValues): Promise<CategoryResult> =>
    api.put(`/api/admin/categories/${id}`, data).then((r) => r.data),

  // Admin: xóa mềm
  delete: (id: string): Promise<void> =>
    api.delete(`/api/admin/categories/${id}`).then(() => undefined),
}

// ── Tag ───────────────────────────────────────────────────────────────────────

export const tagService = {
  // Admin: danh sách có phân trang
  getList: (params: TagQuery): Promise<PagedResult<TagResult>> =>
    api.get('/api/admin/tags', { params }).then((r) => r.data),

  // Admin: chi tiết 1 tag
  getById: (id: string): Promise<TagResult> =>
    api.get(`/api/admin/tags/${id}`).then((r) => r.data),

  // Admin: tạo mới
  create: (data: TagFormValues): Promise<TagResult> =>
    api.post('/api/admin/tags', data).then((r) => r.data),

  // Admin: cập nhật
  update: (id: string, data: TagFormValues): Promise<TagResult> =>
    api.put(`/api/admin/tags/${id}`, data).then((r) => r.data),

  // Admin: xóa mềm
  delete: (id: string): Promise<void> =>
    api.delete(`/api/admin/tags/${id}`).then(() => undefined),
}
