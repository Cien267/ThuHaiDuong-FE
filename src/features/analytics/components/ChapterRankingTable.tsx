import { useNavigate } from 'react-router-dom'
import type { ChapterRankingItem } from '../types/analytics.types'

interface ChapterRankingTableProps {
  data: ChapterRankingItem[]
  isLoading?: boolean
}

export function ChapterRankingTable({
  data,
  isLoading,
}: ChapterRankingTableProps) {
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
                Chapter
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Truyện
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                Lượt xem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Đang tải...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((chapter, index) => (
                <tr
                  key={chapter.chapterId}
                  className="hover:bg-muted/20 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `content/stories/${chapter.storyId}/chapters/${chapter.chapterId}`
                    )
                  }
                >
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
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
                    <p className="font-medium truncate max-w-[240px]">
                      Chương {chapter.chapterNumber}: {chapter.chapterTitle}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline truncate max-w-[180px] block text-left"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/content/stories/${chapter.storyId}`)
                      }}
                    >
                      {chapter.storyTitle}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center font-medium tabular-nums">
                    {chapter.viewCount.toLocaleString('vi-VN')}
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
