// ── Query types ───────────────────────────────────────────────────────────────

export interface SiteOverviewQuery {
  from?: string
  to?: string
}

export interface StoryRankingQuery {
  period?: 'today' | 'week' | 'month' | 'all'
  pageNumber?: number
  pageSize?: number
}

// ── Result types ──────────────────────────────────────────────────────────────

export interface SiteOverviewResult {
  // In-period
  totalChapterViews: number
  uniqueVisitors: number
  newUsers: number
  newComments: number
  newRatings: number
  newBookmarks: number
  // All-time
  totalStories: number
  totalChapters: number
  totalUsers: number
}

export interface DailyTrafficResult {
  date: string // DateOnly → "YYYY-MM-DD"
  chapterViews: number
  uniqueVisitors: number
  newUsers: number
  newComments: number
  newRatings: number
}

export interface StoryRankingItem {
  storyId: string
  title: string
  slug: string
  coverImageUrl: string | null
  authorName: string
  viewCount: number // trong period
  totalViews: number // all-time
  averageRating: number
  totalChapters: number
  categoryNames: string[]
}

export interface ChapterRankingItem {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  storyId: string
  storyTitle: string
  storySlug: string
  viewCount: number
}

export interface DailyStoryViewResult {
  date: string // DateOnly → "YYYY-MM-DD"
  viewCount: number
  uniqueVisitors: number
}

export interface StoryAnalyticsResult {
  storyId: string
  title: string
  totalViews: number
  averageRating: number
  ratingCount: number
  bookmarkCount: number
  commentCount: number
  dailyViews: DailyStoryViewResult[]
  topChapters: ChapterRankingItem[]
}
