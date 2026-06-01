import { useNavigate } from 'react-router-dom'
import { Star, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { StoryRankingItem } from '../types/analytics.types'

interface StoryRankingTableProps {
  data: StoryRankingItem[]
  isLoading?: boolean
  showPeriodViews?: boolean // true = hiện viewCount (period), false = hiện totalViews
}

export function StoryRankingTable({
  data,
  isLoading,
  showPeriodViews = true,
}: StoryRankingTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">
                #
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Truyện
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Thể loại
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                {showPeriodViews ? 'Views (kỳ)' : 'Tổng views'}
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                Rating
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                Chapters
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Đang tải...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((story, index) => (
                <tr
                  key={story.storyId}
                  className="hover:bg-muted/20 cursor-pointer"
                  onClick={() => navigate(`analytics/stories/${story.storyId}`)}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold text-base ${
                        index === 0
                          ? 'text-yellow-500'
                          : index === 1
                            ? 'text-slate-400'
                            : index === 2
                              ? 'text-amber-600'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {story.coverImageUrl ? (
                        <img
                          src={story.coverImageUrl}
                          alt={story.title}
                          className="h-12 w-9 object-cover rounded shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-9 rounded bg-muted flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[220px]">
                          {story.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {story.authorName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {story.categoryNames.slice(0, 2).map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                      {story.categoryNames.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{story.categoryNames.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium tabular-nums">
                    {(showPeriodViews
                      ? story.viewCount
                      : story.totalViews
                    ).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {story.averageRating > 0
                          ? story.averageRating.toFixed(1)
                          : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {story.totalChapters}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
