import { z } from 'zod'
import { AFFILIATE_PLACEMENTS } from '../types/affiliate.types'

// ── Query keys ────────────────────────────────────────────────────────────────

export const AFFILIATE_QUERY_KEYS = {
  all: ['affiliate'] as const,

  links: () => [...AFFILIATE_QUERY_KEYS.all, 'links'] as const,
  linkList: (filters: Record<string, unknown>) =>
    [...AFFILIATE_QUERY_KEYS.links(), 'list', filters] as const,
  linkDetail: (id: string) =>
    [...AFFILIATE_QUERY_KEYS.links(), 'detail', id] as const,

  reports: () => [...AFFILIATE_QUERY_KEYS.all, 'reports'] as const,
  dailyStats: (filters: Record<string, unknown>) =>
    [...AFFILIATE_QUERY_KEYS.reports(), 'daily', filters] as const,
  linkStats: (filters: Record<string, unknown>) =>
    [...AFFILIATE_QUERY_KEYS.reports(), 'linkStats', filters] as const,
  clicks: (filters: Record<string, unknown>) =>
    [...AFFILIATE_QUERY_KEYS.reports(), 'clicks', filters] as const,
}

// ── Page size ─────────────────────────────────────────────────────────────────

export const AFFILIATE_PAGE_SIZE = 10
export const AFFILIATE_CLICKS_PAGE_SIZE = 20

// ── Zod schema ────────────────────────────────────────────────────────────────

export const affiliateLinkSchema = z
  .object({
    name: z.string().min(1, 'Tên không được để trống').max(200),
    targetUrl: z.string().url('URL không hợp lệ').max(2000),
    trackingCode: z.string().max(50).optional().or(z.literal('')),
    placement: z.enum(AFFILIATE_PLACEMENTS, {
      message: 'Vui lòng chọn vị trí hiển thị',
    }),
    priority: z.number().int(),
    isActive: z.boolean(),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    storyIds: z.array(z.string()),
    chapterIds: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate)
      }
      return true
    },
    { message: 'Ngày bắt đầu phải trước ngày kết thúc', path: ['endDate'] }
  )

export type AffiliateLinkFormValues = z.infer<typeof affiliateLinkSchema>

export const AFFILIATE_LINK_DEFAULTS: AffiliateLinkFormValues = {
  name: '',
  targetUrl: '',
  trackingCode: '',
  placement: 'in-chapter',
  priority: 0,
  isActive: true,
  startDate: '',
  endDate: '',
  storyIds: [],
  chapterIds: [],
}
