export const COMMENT_QUERY_KEYS = {
  all: ['comments'] as const,
  lists: () => [...COMMENT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...COMMENT_QUERY_KEYS.lists(), filters] as const,
}

export const COMMENT_PAGE_SIZE = 50
