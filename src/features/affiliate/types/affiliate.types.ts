// ── Placement constants ───────────────────────────────────────────────────────

export const AFFILIATE_PLACEMENTS = [
  'in-chapter',
  'sidebar',
  'popup',
  'global',
] as const
export type AffiliatePlacement = (typeof AFFILIATE_PLACEMENTS)[number]

export const PLACEMENT_LABELS: Record<AffiliatePlacement, string> = {
  'in-chapter': 'Trong chương',
  sidebar: 'Sidebar',
  popup: 'Popup',
  global: 'Toàn cục',
}

// ── Core result types ─────────────────────────────────────────────────────────

export interface AffiliateLinkTargetItem {
  id: string
  title: string
  slug: string
}

export interface AffiliateLinkResult {
  id: string
  name: string
  targetUrl: string
  trackingCode: string
  redirectUrl: string
  placement: AffiliatePlacement
  priority: number
  isActive: boolean
  startDate: string | null
  endDate: string | null
  totalClicks: number
  totalStories: number
  totalChapters: number
  createdAt: string
  updatedAt: string
  stories: AffiliateLinkTargetItem[]
  chapters: AffiliateLinkTargetItem[]
  imageUrl: string
}

export interface AffiliateClickResult {
  id: string
  affiliateLinkId: string
  linkName: string
  trackingCode: string
  userId: string | null
  userName: string | null
  chapterId: string | null
  chapterTitle: string | null
  storyId: string | null
  storyTitle: string | null
  ipAddress: string | null
  referrer: string | null
  clickedAt: string
}

export interface AffiliateDailyStatResult {
  date: string // DateOnly → string "YYYY-MM-DD"
  totalClicks: number
  uniqueIps: number
}

export interface AffiliateLinkStatResult {
  affiliateLinkId: string
  linkName: string
  trackingCode: string
  placement: AffiliatePlacement
  totalClicks: number
  uniqueIps: number
  lastClickedAt: string | null
}

// ── Query types ───────────────────────────────────────────────────────────────

export interface AffiliateLinkQuery {
  name?: string
  placement?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface AffiliateClickReportQuery {
  affiliateLinkId?: string
  storyId?: string
  chapterId?: string
  fromDate?: string
  toDate?: string
  pageNumber?: number
  pageSize?: number
}

export interface AffiliateDailyStatQuery {
  linkId?: string
  from: string
  to: string
}

export interface AffiliateLinkStatQuery {
  from?: string
  to?: string
}

// ── Input types ───────────────────────────────────────────────────────────────

export interface CreateAffiliateLinkInput {
  name: string
  targetUrl: string
  trackingCode?: string
  placement: AffiliatePlacement
  priority: number
  isActive: boolean
  startDate?: string
  endDate?: string
  storyIds: string[]
  chapterIds: string[]
  imageUrl?: string
}

export interface UpdateAffiliateLinkInput {
  name: string
  targetUrl: string
  placement: AffiliatePlacement
  priority: number
  isActive: boolean
  startDate?: string
  endDate?: string
  storyIds: string[]
  chapterIds: string[]
  imageUrl?: string
}
