import api from '@/services/api'
import type {
  ChapterRankingItem,
  DailyTrafficResult,
  SiteOverviewQuery,
  SiteOverviewResult,
  StoryAnalyticsResult,
  StoryRankingItem,
  StoryRankingQuery,
} from '../types/analytics.types'

export const analyticsService = {
  getOverview: async (
    query: SiteOverviewQuery
  ): Promise<SiteOverviewResult> => {
    const { data } = await api.get('admin/analytics/overview', {
      params: query,
    })
    return data
  },

  getDailyTraffic: async (
    query: SiteOverviewQuery
  ): Promise<DailyTrafficResult[]> => {
    const { data } = await api.get('admin/analytics/traffic', { params: query })
    return data
  },

  getTopStories: async (
    query: StoryRankingQuery
  ): Promise<StoryRankingItem[]> => {
    const { data } = await api.get('admin/analytics/stories/top', {
      params: query,
    })
    return data
  },

  getTopChapters: async (limit: number): Promise<ChapterRankingItem[]> => {
    const { data } = await api.get('admin/analytics/chapters/top', {
      params: { limit },
    })
    return data
  },

  getStoryAnalytics: async (storyId: string): Promise<StoryAnalyticsResult> => {
    const { data } = await api.get(`admin/analytics/stories/${storyId}`)
    return data
  },
}
