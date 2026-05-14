import { Badge } from '@/components/ui/badge'
import { STATUS_META } from '../types/story.types'
import type { StoryStatus } from '../types/story.types'

export const StoryStatusBadge = ({ status }: { status: StoryStatus }) => {
  const meta = STATUS_META[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
