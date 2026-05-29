import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { OverviewCards } from '../components/OverviewCards'
import { TrafficChart } from '../components/TrafficChart'
import { StoryRankingTable } from '../components/StoryRankingTable'
import { ChapterRankingTable } from '../components/ChapterRankingTable'
import {
  useDailyTraffic,
  useSiteOverview,
  useTopChapters,
  useTopStories,
} from '../hooks/useAnalytics'
import type { SiteOverviewQuery } from '../types/analytics.types'

function defaultRange(): SiteOverviewQuery {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 29)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

function daysBetween(from: string, to: string) {
  const diff = new Date(to).getTime() - new Date(from).getTime()
  return Math.round(diff / 86400000) + 1
}

export default function AnalyticsDashboardPage() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<SiteOverviewQuery>(defaultRange)

  const { data: overview, isLoading: overviewLoading } =
    useSiteOverview(dateRange)
  const { data: traffic = [], isLoading: trafficLoading } =
    useDailyTraffic(dateRange)
  const { data: topStories = [], isLoading: storiesLoading } = useTopStories({
    period: 'week',
    pageNumber: 1,
    pageSize: 5,
  })
  const { data: topChapters = [], isLoading: chaptersLoading } =
    useTopChapters(5)

  const periodLabel =
    dateRange.from && dateRange.to
      ? `${daysBetween(dateRange.from, dateRange.to)} ngày`
      : '30 ngày'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng quan hoạt động của site
          </p>
        </div>

        {/* Date range filter */}
        <div className="flex items-end gap-3 flex-wrap">
          <div className="space-y-1">
            <Label className="text-xs">Từ ngày</Label>
            <Input
              type="date"
              className="w-36 h-8 text-sm"
              value={dateRange.from ?? ''}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Đến ngày</Label>
            <Input
              type="date"
              className="w-36 h-8 text-sm"
              value={dateRange.to ?? ''}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange(defaultRange())}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      {overviewLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-4 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : overview ? (
        <OverviewCards data={overview} periodLabel={periodLabel} />
      ) : null}

      {/* Traffic chart */}
      {trafficLoading ? (
        <div className="rounded-lg border bg-card p-5 h-80 animate-pulse" />
      ) : (
        <TrafficChart data={traffic} />
      )}

      {/* Mini rankings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top stories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Truyện hot tuần này</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/admin/analytics/stories')}
            >
              Xem tất cả →
            </Button>
          </div>
          <StoryRankingTable data={topStories} isLoading={storiesLoading} />
        </div>

        {/* Top chapters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Chapter hot nhất</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/admin/analytics/chapters')}
            >
              Xem tất cả →
            </Button>
          </div>
          <ChapterRankingTable data={topChapters} isLoading={chaptersLoading} />
        </div>
      </div>
    </div>
  )
}
