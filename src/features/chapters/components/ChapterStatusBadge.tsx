import { Badge } from '@/components/ui/badge'
import { CHAPTER_STATUS_META } from '../types/chapter.types'
import type { ChapterStatus } from '../types/chapter.types'

export const ChapterStatusBadge = ({ status }: { status: ChapterStatus }) => {
  const meta = CHAPTER_STATUS_META[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
