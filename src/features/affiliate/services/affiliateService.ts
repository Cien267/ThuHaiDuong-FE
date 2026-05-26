import api from '@/services/api'
import type { PagedResult } from '@/features/categories/types/category.types'
import type {
  AffiliateClickReportQuery,
  AffiliateClickResult,
  AffiliateDailyStatQuery,
  AffiliateDailyStatResult,
  AffiliateLinkQuery,
  AffiliateLinkResult,
  AffiliateLinkStatQuery,
  AffiliateLinkStatResult,
  CreateAffiliateLinkInput,
  UpdateAffiliateLinkInput,
} from '../types/affiliate.types'

export const affiliateService = {
  // ── CRUD ────────────────────────────────────────────────────────────────────

  getList: async (
    query: AffiliateLinkQuery
  ): Promise<PagedResult<AffiliateLinkResult>> => {
    const { data } = await api.get('admin/affiliate/links', {
      params: query,
    })
    return data
  },

  getById: async (id: string): Promise<AffiliateLinkResult> => {
    const { data } = await api.get(`admin/affiliate/links/${id}`)
    return data
  },

  create: async (
    input: CreateAffiliateLinkInput
  ): Promise<AffiliateLinkResult> => {
    const { data } = await api.post('admin/affiliate/links', input)
    return data
  },

  update: async (
    id: string,
    input: UpdateAffiliateLinkInput
  ): Promise<AffiliateLinkResult> => {
    const { data } = await api.put(`admin/affiliate/links/${id}`, input)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`admin/affiliate/links/${id}`)
  },

  // ── Reports ─────────────────────────────────────────────────────────────────

  getDailyStats: async (
    query: AffiliateDailyStatQuery
  ): Promise<AffiliateDailyStatResult[]> => {
    const { data } = await api.get('admin/affiliate/reports/daily', {
      params: query,
    })
    return data
  },

  getLinkStats: async (
    query: AffiliateLinkStatQuery
  ): Promise<AffiliateLinkStatResult[]> => {
    const { data } = await api.get('admin/affiliate/reports/links', {
      params: query,
    })
    return data
  },

  getClicks: async (
    query: AffiliateClickReportQuery
  ): Promise<PagedResult<AffiliateClickResult>> => {
    const { data } = await api.get('admin/affiliate/reports/clicks', {
      params: query,
    })
    return data
  },
}
