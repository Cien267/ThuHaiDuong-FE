// ── Enums / Constants ──────────────────────────────────────────────────────────

export const STORY_STATUS = {
  Draft: 'Draft',
  PendingReview: 'PendingReview',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Publishing: 'Publishing',
  Completed: 'Completed',
  Paused: 'Paused',
} as const

export type StoryStatus = (typeof STORY_STATUS)[keyof typeof STORY_STATUS]

export const STORY_TYPE = {
  Serial: 'Serial',
  Completed: 'Completed',
} as const

export type StoryType = (typeof STORY_TYPE)[keyof typeof STORY_TYPE]

export const RELEASE_SCHEDULE = {
  Daily: 'Daily',
  Weekly: 'Weekly',
  BiWeekly: 'BiWeekly',
  Monthly: 'Monthly',
} as const

export type ReleaseSchedule =
  (typeof RELEASE_SCHEDULE)[keyof typeof RELEASE_SCHEDULE]

export const CONTENT_SOURCE = {
  Manual: 'Manual',
  Crawled: 'Crawled',
  UGC: 'UGC',
} as const

export type ContentSource = (typeof CONTENT_SOURCE)[keyof typeof CONTENT_SOURCE]

// ── Nested items ───────────────────────────────────────────────────────────────

export interface CategorySummaryItem {
  id: string
  name: string
  slug: string
}

export interface TagSummaryItem {
  id: string
  name: string
  slug: string
}

export interface ChapterSummaryItem {
  id: string
  chapterNumber: number
  title: string
  isVip: boolean
  publishedAt?: string | null
}

// ── Response types ─────────────────────────────────────────────────────────────

export interface StorySummary {
  id: string
  title: string
  slug: string
  authorName: string
  authorSlug?: string | null
  coverImageUrl?: string | null
  status: StoryStatus
  storyType: StoryType
  releaseSchedule?: ReleaseSchedule | null
  totalChapters: number
  totalViews: number
  averageRating: number
  ratingCount: number
  lastChapterAt?: string | null
  createdAt: string
  categoryNames: string[]
}

export interface StoryAdminResult {
  id: string
  title: string
  slug: string
  description?: string | null
  coverImageUrl?: string | null
  sourceUrl?: string | null
  status: StoryStatus
  storyType: StoryType
  releaseSchedule?: ReleaseSchedule | null
  nextChapterAt?: string | null
  contentSource: ContentSource
  rejectionReason?: string | null
  totalChapters: number
  totalViews: number
  averageRating: number
  ratingCount: number
  lastChapterAt?: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  authorName: string
  uploadedByUserId?: string | null
  uploadedByUserName?: string | null
  categories: CategorySummaryItem[]
  tags: TagSummaryItem[]
}

export interface StoryDetail {
  id: string
  title: string
  slug: string
  description?: string | null
  coverImageUrl?: string | null
  status: StoryStatus
  storyType: StoryType
  releaseSchedule?: ReleaseSchedule | null
  nextChapterAt?: string | null
  totalChapters: number
  totalViews: number
  averageRating: number
  ratingCount: number
  lastChapterAt?: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  authorName: string
  authorSlug?: string | null
  authorAvatarUrl?: string | null
  contentSource: ContentSource
  sourceUrl?: string | null
  rejectionReason?: string | null
  uploadedByUserId?: string | null
  uploadedByUserName?: string | null
  categories: CategorySummaryItem[]
  tags: TagSummaryItem[]
  chapters: ChapterSummaryItem[]
}

// ── Query params ───────────────────────────────────────────────────────────────

export interface StoryAdminQuery {
  keyword?: string
  status?: StoryStatus
  storyType?: StoryType
  contentSource?: ContentSource
  categoryId?: string
  tagId?: string
  authorId?: string
  uploadedByUserId?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

// ── Form values ────────────────────────────────────────────────────────────────

export interface StoryFormValues {
  title: string
  slug?: string
  authorId: string
  sourceUrl?: string
  description?: string
  coverImageUrl?: string
  storyType: StoryType
  releaseSchedule?: ReleaseSchedule
  nextChapterAt?: string
  contentSource: ContentSource
  categoryIds: string[]
  tagIds: string[]
}

export interface UpdateStoryStatusValues {
  status: StoryStatus
}

export interface ReviewStoryValues {
  isApproved: boolean
  rejectionReason?: string
}

// ── Status metadata (label, color) ────────────────────────────────────────────

export const STATUS_META: Record<
  StoryStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  Draft: { label: 'Draft', variant: 'secondary' },
  PendingReview: { label: 'Pending Review', variant: 'outline' },
  Approved: { label: 'Approved', variant: 'default' },
  Rejected: { label: 'Rejected', variant: 'destructive' },
  Publishing: { label: 'Publishing', variant: 'default' },
  Completed: { label: 'Completed', variant: 'default' },
  Paused: { label: 'Paused', variant: 'secondary' },
}
