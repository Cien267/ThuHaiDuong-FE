import api from '@/services/api'
import type {
  AuthorQuery,
  AuthorResult,
  AuthorSummary,
  AuthorFormValues,
} from '../types/author.types'
import type { PagedResult } from '@/features/categories/types/category.types'

export const authorService = {
  // Admin: danh sách đầy đủ kể cả chưa có truyện
  getList: (params: AuthorQuery): Promise<PagedResult<AuthorResult>> =>
    api.get('/admin/authors', { params }).then((r) => r.data),

  // Admin: chi tiết theo Id
  getById: (id: string): Promise<AuthorResult> =>
    api.get(`/admin/authors/${id}`).then((r) => r.data),

  // Client: danh sách author có truyện published (dùng trong select của Story form)
  getSummaryList: (name?: string): Promise<PagedResult<AuthorSummary>> =>
    api.get('/authors', { params: { name, pageSize: 50 } }).then((r) => r.data),

  // Admin: tạo mới
  create: (data: AuthorFormValues): Promise<AuthorResult> =>
    api.post('/admin/authors', data).then((r) => r.data),

  // Admin: cập nhật
  update: (id: string, data: AuthorFormValues): Promise<AuthorResult> =>
    api.put(`/admin/authors/${id}`, data).then((r) => r.data),

  // Admin: xóa mềm
  delete: (id: string): Promise<void> =>
    api.delete(`/admin/authors/${id}`).then(() => undefined),
}
