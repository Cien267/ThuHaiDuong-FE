import {
  Eye,
  Users,
  UserPlus,
  MessageSquare,
  Star,
  Bookmark,
  BookOpen,
  FileText,
  UserCheck,
} from 'lucide-react'
import type { SiteOverviewResult } from '../types/analytics.types'

interface MetricCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  sub?: string
}

function MetricCard({ label, value, icon, sub }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
      <div className="p-2 rounded-md bg-muted text-muted-foreground shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-bold mt-0.5 tabular-nums">
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

interface OverviewCardsProps {
  data: SiteOverviewResult
  periodLabel: string
}

export function OverviewCards({ data, periodLabel }: OverviewCardsProps) {
  return (
    <div className="space-y-4">
      {/* Period metrics */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Trong {periodLabel}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard
            label="Lượt xem chapter"
            value={data.totalChapterViews}
            icon={<Eye className="h-4 w-4" />}
          />
          <MetricCard
            label="Khách truy cập"
            value={data.uniqueVisitors}
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            label="Người dùng mới"
            value={data.newUsers}
            icon={<UserPlus className="h-4 w-4" />}
          />
          <MetricCard
            label="Bình luận mới"
            value={data.newComments}
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <MetricCard
            label="Đánh giá mới"
            value={data.newRatings}
            icon={<Star className="h-4 w-4" />}
          />
          <MetricCard
            label="Bookmark mới"
            value={data.newBookmarks}
            icon={<Bookmark className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* All-time metrics */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Tổng cộng
        </p>
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="Truyện đang publish"
            value={data.totalStories}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <MetricCard
            label="Chapter đã publish"
            value={data.totalChapters}
            icon={<FileText className="h-4 w-4" />}
          />
          <MetricCard
            label="Tổng người dùng"
            value={data.totalUsers}
            icon={<UserCheck className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  )
}
