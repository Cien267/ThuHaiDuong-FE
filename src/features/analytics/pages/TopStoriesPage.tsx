import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StoryRankingTable } from '../components/StoryRankingTable'
import { useTopStories } from '../hooks/useAnalytics'
import {
  PERIOD_LABELS,
  STORY_RANKING_PAGE_SIZE,
} from '../constants/analytics.constants'
import type { StoryRankingQuery } from '../types/analytics.types'

// ── Top Stories ───────────────────────────────────────────────────────────────

export function TopStoriesPage() {
  const [query, setQuery] = useState<StoryRankingQuery>({
    period: 'week',
    pageNumber: 1,
    pageSize: STORY_RANKING_PAGE_SIZE,
  })

  const { data = [], isLoading } = useTopStories(query)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Truyện hot</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Xếp hạng theo lượt xem
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={query.period}
          onValueChange={(val) =>
            setQuery((prev) => ({
              ...prev,
              period: val as StoryRankingQuery['period'],
              pageNumber: 1,
            }))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERIOD_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StoryRankingTable
        data={data}
        isLoading={isLoading}
        showPeriodViews={query.period !== 'all'}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Trang {query.pageNumber}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={(query.pageNumber ?? 1) <= 1}
            onClick={() =>
              setQuery((prev) => ({
                ...prev,
                pageNumber: (prev.pageNumber ?? 1) - 1,
              }))
            }
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={data.length < STORY_RANKING_PAGE_SIZE}
            onClick={() =>
              setQuery((prev) => ({
                ...prev,
                pageNumber: (prev.pageNumber ?? 1) + 1,
              }))
            }
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TopStoriesPage
