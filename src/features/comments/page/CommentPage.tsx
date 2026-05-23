import { useState } from 'react'
import {
  Eye,
  EyeOff,
  MessageSquare,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import { COMMENT_PAGE_SIZE } from '../constants/comment.constants'
import {
  useComments,
  useDeleteComment,
  useToggleHideComment,
} from '../hooks/useComments'
import type { CommentQuery, CommentResult } from '../types/comment.types'
import { formatDate } from '@/lib/utils'
import {
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHead,
  TableBody,
} from '@/components/ui/table'

function getDisplayName(comment: CommentResult) {
  if (comment.author.isGuest) return comment.author.guestName ?? 'Khách'
  return comment.author.userName ?? 'Người dùng'
}

// ─── CommentRow ──────────────────────────────────────────────────────────────

interface CommentRowProps {
  comment: CommentResult
  isReply?: boolean
}

function CommentRow({ comment, isReply = false }: CommentRowProps) {
  const [expanded, setExpanded] = useState(false)
  const toggleHide = useToggleHideComment()
  const deleteComment = useDeleteComment()

  const hasReplies = !isReply && comment.replies.length > 0

  return (
    <>
      <TableRow
        className={
          comment.isHidden ? 'bg-muted/40 opacity-60' : 'hover:bg-muted/20'
        }
      >
        {/* Indent cho reply */}
        <TableCell>
          <div
            className={`flex items-start gap-2 ${isReply ? 'pl-6 border-l-2 border-border' : ''}`}
          >
            {/* Expand toggle */}
            {hasReplies && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-0.5 text-muted-foreground hover:text-foreground"
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm line-clamp-2 text-foreground">
                {comment.content}
              </p>
            </div>
          </div>
        </TableCell>

        {/* Tác giả */}
        <TableCell>
          <span className="text-sm truncate max-w-[120px]">
            {getDisplayName(comment)}
          </span>
        </TableCell>

        {/* Replies */}
        <TableCell>
          {!isReply && comment.replies.length > 0 ? (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {comment.replies.length}
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </TableCell>

        {/* Trạng thái */}
        <TableCell>
          {comment.isHidden ? (
            <Badge variant="secondary" className="text-xs">
              Đã ẩn
            </Badge>
          ) : (
            <Badge variant="info">Hiển thị</Badge>
          )}
        </TableCell>

        {/* Ngày tạo */}
        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(comment.createdAt)}
        </TableCell>

        {/* Actions */}
        <TableCell className="px-4 py-3">
          <div className="flex items-center gap-1 justify-end">
            <TooltipProvider delayDuration={200}>
              {/* Toggle hide */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleHide.mutate(comment.id)}
                    disabled={toggleHide.isPending}
                  >
                    {comment.isHidden ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {comment.isHidden ? 'Hiện bình luận' : 'Ẩn bình luận'}
                </TooltipContent>
              </Tooltip>

              {/* Delete */}
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
                  <TooltipContent>Xóa bình luận</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xóa bình luận?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Bình luận sẽ bị xóa vĩnh
                      viễn khỏi hệ thống.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={() => deleteComment.mutate(comment.id)}
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

      {/* Replies (expanded) */}
      {expanded &&
        comment.replies.map((reply) => (
          <CommentRow key={reply.id} comment={reply} isReply />
        ))}
    </>
  )
}

// ─── CommentsPage ─────────────────────────────────────────────────────────────
interface CommentsPageProps {
  storyId?: string
  chapterId?: string
}

export default function CommentsPage({
  storyId,
  chapterId,
}: CommentsPageProps) {
  const [query, setQuery] = useState<CommentQuery>({
    pageNumber: 1,
    pageSize: COMMENT_PAGE_SIZE,
    storyId: storyId ?? undefined,
    chapterId: chapterId ?? undefined,
  })

  const { data, isLoading } = useComments(query)

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="p-6 pt-0 space-y-5">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nội dung</TableHead>
              <TableHead>Người viết</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Trạng thái</TableHead>
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  Chưa có bình luận nào.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((comment) => (
                <CommentRow key={comment.id} comment={comment} />
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
              disabled={data.pageNumber <= 1}
              onClick={() =>
                setQuery((prev) => ({
                  ...prev,
                  pageNumber: (prev.pageNumber ?? 1) - 1,
                }))
              }
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.pageNumber >= totalPages}
              onClick={() =>
                setQuery((prev) => ({
                  ...prev,
                  pageNumber: (prev.pageNumber ?? 1) + 1,
                }))
              }
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
