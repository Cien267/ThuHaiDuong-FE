import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDeleteRating, useRatingList } from '../hooks/useRatings'

interface Props {
  storyId: string
}

function StarScore({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= score ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/25'}`}
        />
      ))}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RatingList({ storyId }: Props) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useRatingList(storyId, page)
  const deleteRating = useDeleteRating(storyId)

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-3">
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Điểm
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nhận xét
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Chưa có đánh giá nào
                  </td>
                </tr>
              ) : (
                data?.data.map((rating) => (
                  <tr key={rating.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{rating.userName}</td>
                    <td className="px-4 py-3">
                      <StarScore score={rating.score} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs">
                      {rating.comment ? (
                        <span className="line-clamp-2">{rating.comment}</span>
                      ) : (
                        <span className="italic text-muted-foreground/50">
                          Không có nhận xét
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(rating.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <TooltipProvider delayDuration={200}>
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Xóa đánh giá</TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Xóa đánh giá?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Đánh giá của{' '}
                                  <strong>{rating.userName}</strong> sẽ bị xóa
                                  và điểm trung bình của truyện sẽ được cập nhật
                                  lại.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => deleteRating.mutate(rating.id)}
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Trang {data.pageNumber} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
