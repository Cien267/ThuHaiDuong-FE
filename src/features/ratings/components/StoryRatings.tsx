import { RatingList } from './RatingList'
import { RatingSummaryCard } from './RatingSummaryCard'
import { useRatingSummary } from '../hooks/useRatings'

interface Props {
  storyId: string
}

export function StoryRatings({ storyId }: Props) {
  const { data: summary, isLoading } = useRatingSummary(storyId)

  return (
    <div className="space-y-5">
      {/* Summary */}
      {isLoading ? (
        <div className="rounded-lg border bg-card p-5 h-24 animate-pulse" />
      ) : summary ? (
        <RatingSummaryCard summary={summary} />
      ) : null}

      {/* List */}
      <RatingList storyId={storyId} />
    </div>
  )
}
