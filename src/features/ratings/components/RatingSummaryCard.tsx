import { Star } from 'lucide-react'
import type { RatingSummary } from '../types/rating.types'

interface Props {
  summary: RatingSummary
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Star
      className={`h-4 w-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
    />
  )
}

export function RatingSummaryCard({ summary }: Props) {
  const { averageScore, totalRatings, scoreDistribution } = summary
  const maxCount = Math.max(...Object.values(scoreDistribution), 1)

  return (
    <div className="rounded-lg border bg-card p-5 flex gap-8">
      {/* Average score */}
      <div className="flex flex-col items-center justify-center min-w-[100px] gap-1">
        <span className="text-4xl font-bold tracking-tight">
          {averageScore.toFixed(1)}
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} filled={s <= Math.round(averageScore)} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground mt-0.5">
          {totalRatings.toLocaleString('vi-VN')} đánh giá
        </span>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((score) => {
          const count = scoreDistribution[String(score)] ?? 0
          const pct = totalRatings > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={score} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-right text-muted-foreground">
                {score}
              </span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
