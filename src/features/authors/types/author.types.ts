export interface AuthorResult {
  id: string
  name: string
  slug: string
  penName?: string | null
  country?: string | null
  description?: string | null
  avatarUrl?: string | null
  storyCount: number
  publishedStoryCount: number
  createdAt: string
  updatedAt: string
}

export interface AuthorSummary {
  id: string
  name: string
  slug: string
  penName?: string | null
  country?: string | null
  avatarUrl?: string | null
  storyCount: number
}

export interface AuthorQuery {
  name?: string
  country?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

export interface AuthorFormValues {
  name: string
  slug?: string
  penName?: string
  country?: string
  description?: string
  avatarUrl?: string
}

// Danh sách quốc gia phổ biến cho select
export const COUNTRIES = [
  { code: 'CN', label: '🇨🇳 Trung Quốc' },
  { code: 'VN', label: '🇻🇳 Việt Nam' },
  { code: 'KR', label: '🇰🇷 Hàn Quốc' },
  { code: 'JP', label: '🇯🇵 Nhật Bản' },
  { code: 'EN', label: '🇺🇸 Anh / Mỹ' },
] as const
