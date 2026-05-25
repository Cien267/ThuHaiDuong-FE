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
import {
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

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

export function RatingList({ storyId }: Props) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useRatingList(storyId, page)
  const deleteRating = useDeleteRating(storyId)

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Nhận xét</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  Chưa có đánh giá nào
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((rating) => (
                <TableRow key={rating.id} className="hover:bg-muted/20">
                  <TableCell className=" font-medium">
                    {rating.userName}
                  </TableCell>
                  <TableCell className="">
                    <StarScore score={rating.score} />
                  </TableCell>
                  <TableCell className=" text-muted-foreground max-w-xs">
                    {rating.comment ? (
                      <span className="line-clamp-2">{rating.comment}</span>
                    ) : (
                      <span className="italic text-muted-foreground/50">
                        Không có nhận xét
                      </span>
                    )}
                  </TableCell>
                  <TableCell className=" text-muted-foreground whitespace-nowrap">
                    {formatDate(rating.createdAt)}
                  </TableCell>
                  <TableCell className="">
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
                              <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Đánh giá của <strong>{rating.userName}</strong>{' '}
                                sẽ bị xóa và điểm trung bình của truyện sẽ được
                                cập nhật lại.
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
