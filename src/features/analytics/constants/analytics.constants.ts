export const ANALYTICS_QUERY_KEYS = {
  all: ['analytics'] as const,

  overview: (query: Record<string, unknown>) =>
    [...ANALYTICS_QUERY_KEYS.all, 'overview', query] as const,

  traffic: (query: Record<string, unknown>) =>
    [...ANALYTICS_QUERY_KEYS.all, 'traffic', query] as const,

  topStories: (query: Record<string, unknown>) =>
    [...ANALYTICS_QUERY_KEYS.all, 'topStories', query] as const,

  topChapters: (limit: number) =>
    [...ANALYTICS_QUERY_KEYS.all, 'topChapters', limit] as const,

  storyAnalytics: (storyId: string) =>
    [...ANALYTICS_QUERY_KEYS.all, 'story', storyId] as const,
}

export const STORY_RANKING_PAGE_SIZE = 10

export const PERIOD_LABELS: Record<string, string> = {
  today: 'Hôm nay',
  week: '7 ngày qua',
  month: '30 ngày qua',
  all: 'Tất cả',
}
