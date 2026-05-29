import { useQuery } from '@tanstack/react-query'
import { ANALYTICS_QUERY_KEYS } from '../constants/analytics.constants'
import { analyticsService } from '../services/analyticsService'
import type {
  SiteOverviewQuery,
  StoryRankingQuery,
} from '../types/analytics.types'

export const useSiteOverview = (query: SiteOverviewQuery) =>
  useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(query as Record<string, unknown>),
    queryFn: () => analyticsService.getOverview(query),
  })

export const useDailyTraffic = (query: SiteOverviewQuery) =>
  useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.traffic(query as Record<string, unknown>),
    queryFn: () => analyticsService.getDailyTraffic(query),
  })

export const useTopStories = (query: StoryRankingQuery) =>
  useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.topStories(query as Record<string, unknown>),
    queryFn: () => analyticsService.getTopStories(query),
  })

export const useTopChapters = (limit = 10) =>
  useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.topChapters(limit),
    queryFn: () => analyticsService.getTopChapters(limit),
  })

export const useStoryAnalytics = (storyId: string) =>
  useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.storyAnalytics(storyId),
    queryFn: () => analyticsService.getStoryAnalytics(storyId),
    enabled: !!storyId,
  })
