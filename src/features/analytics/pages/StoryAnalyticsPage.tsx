import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Eye, Bookmark, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStoryAnalytics } from '../hooks/useAnalytics'
import { StoryDailyViewChart } from '../components/StoryDailyViewChart'
import { ChapterRankingTable } from '../components/ChapterRankingTable'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
      <div className="p-2 rounded-md bg-muted text-muted-foreground shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold mt-0.5 tabular-nums">
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
      </div>
    </div>
  )
}

export default function StoryAnalyticsPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useStoryAnalytics(storyId!)

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">Đang tải...</div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Không tìm thấy dữ liệu
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight truncate">
            {data.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Analytics chi tiết
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto shrink-0"
          onClick={() => navigate(`/admin/stories/${storyId}`)}
        >
          Xem truyện
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Tổng lượt xem"
          value={data.totalViews}
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard
          label="Đánh giá TB"
          value={
            data.averageRating > 0
              ? `${data.averageRating.toFixed(1)} ★ (${data.ratingCount})`
              : '—'
          }
          icon={<Star className="h-4 w-4" />}
        />
        <StatCard
          label="Bookmark"
          value={data.bookmarkCount}
          icon={<Bookmark className="h-4 w-4" />}
        />
        <StatCard
          label="Bình luận"
          value={data.commentCount}
          icon={<MessageSquare className="h-4 w-4" />}
        />
      </div>

      {/* Daily view chart */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Lượt xem theo ngày</h2>
          <p className="text-xs text-muted-foreground">30 ngày gần nhất</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#6366f1]" />
            Lượt xem
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#22c55e]" />
            Khách truy cập
          </span>
        </div>
        <StoryDailyViewChart data={data.dailyViews} />
      </div>

      {/* Top chapters */}
      <div className="space-y-3">
        <h2 className="font-medium">Top 5 chapter hot nhất</h2>
        <ChapterRankingTable data={data.topChapters} />
      </div>
    </div>
  )
}
