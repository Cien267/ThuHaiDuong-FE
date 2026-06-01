import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChapterRankingTable } from '../components/ChapterRankingTable'
import { useTopChapters } from '../hooks/useAnalytics'

export function TopChaptersPage() {
  const [limit, setLimit] = useState(20)
  const { data = [], isLoading } = useTopChapters(limit)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chapter hot</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Xếp hạng theo tổng lượt xem all-time
          </p>
        </div>

        <Select
          value={String(limit)}
          onValueChange={(val) => setLimit(Number(val))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                Top {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChapterRankingTable data={data} isLoading={isLoading} />
    </div>
  )
}

export default TopChaptersPage
