import { RatingList } from './RatingList'
import { RatingSummaryCard } from './RatingSummaryCard'
import { useRatingSummary } from '../hooks/useRatings'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  storyId: string
}

export function StoryRatings({ storyId }: Props) {
  const { data: summary, isLoading } = useRatingSummary(storyId)

  return (
    <div className="space-y-5">
      {/* Summary */}
      {isLoading ? (
        <Skeleton className="h-15 w-full mx-6!" />
      ) : summary ? (
        <RatingSummaryCard summary={summary} />
      ) : null}

      {/* List */}
      <RatingList storyId={storyId} />
    </div>
  )
}
