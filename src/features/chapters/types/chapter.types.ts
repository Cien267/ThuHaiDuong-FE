export const CHAPTER_STATUS = {
  Draft: 'Draft',
  Published: 'Published',
  Hidden: 'Hidden',
} as const

export const CHAPTER_STATUS_OPTIONS = [
  { value: CHAPTER_STATUS.Draft, label: 'Nháp' },
  { value: CHAPTER_STATUS.Published, label: 'Đã xuất bản' },
  { value: CHAPTER_STATUS.Hidden, label: 'Ẩn' },
]

export type ChapterStatus = (typeof CHAPTER_STATUS)[keyof typeof CHAPTER_STATUS]

// ── Response types ─────────────────────────────────────────────────────────────

export interface ChapterListItem {
  id: string
  chapterNumber: number
  title: string
  status: ChapterStatus
  isVip: boolean
  wordCount: number
  viewCount: number
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface ChapterAdminResult {
  id: string
  storyId: string
  storyTitle: string
  chapterNumber: number
  title: string
  content: string // HTML content
  status: ChapterStatus
  isVip: boolean
  wordCount: number
  viewCount: number
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

// ── Prev / Next navigation ─────────────────────────────────────────────────────

export interface ChapterNavItem {
  id: string
  chapterNumber: number
  title: string
  isVip: boolean
}

export interface ChapterReadResult {
  id: string
  chapterNumber: number
  title: string
  content: string
  isVip: boolean
  wordCount: number
  publishedAt?: string | null
  storyId: string
  storyTitle: string
  storySlug: string
  prevChapter?: ChapterNavItem | null
  nextChapter?: ChapterNavItem | null
}

// ── Query params ───────────────────────────────────────────────────────────────

export interface ChapterAdminQuery {
  storyId: string
  status?: ChapterStatus
  isVip?: boolean
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

// ── Form values ────────────────────────────────────────────────────────────────

export interface ChapterFormValues {
  storyId: string
  chapterNumber?: number // optional — auto-increment nếu không truyền
  title: string
  content: string // HTML từ TipTap
  isVip: boolean
  status: ChapterStatus // Draft hoặc Published ngay khi tạo
}

export interface UpdateChapterInput {
  title: string
  content: string
  isVip: boolean
}

export interface UpdateChapterStatusInput {
  status: ChapterStatus
}

// ── Status metadata ────────────────────────────────────────────────────────────

export const CHAPTER_STATUS_META: Record<
  ChapterStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  Draft: { label: 'Draft', variant: 'secondary' },
  Published: { label: 'Published', variant: 'default' },
  Hidden: { label: 'Hidden', variant: 'destructive' },
}
