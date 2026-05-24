export const RATING_QUERY_KEYS = {
  all: ['ratings'] as const,
  summary: (storyId: string) =>
    [...RATING_QUERY_KEYS.all, 'summary', storyId] as const,
  lists: () => [...RATING_QUERY_KEYS.all, 'list'] as const,
  list: (storyId: string, page: number) =>
    [...RATING_QUERY_KEYS.lists(), storyId, page] as const,
}

export const RATING_PAGE_SIZE = 50
