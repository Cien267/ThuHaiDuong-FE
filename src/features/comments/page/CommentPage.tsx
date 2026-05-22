import { useState } from 'react'
import {
  Eye,
  EyeOff,
  MessageSquare,
  Trash2,
  User,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
      <tr
        className={
          comment.isHidden ? 'bg-muted/40 opacity-60' : 'hover:bg-muted/20'
        }
      >
        {/* Indent cho reply */}
        <td className="px-4 py-3">
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
            {!hasReplies && !isReply && <span className="w-4" />}

            <div className="flex-1 min-w-0">
              <p className="text-sm line-clamp-2 text-foreground">
                {comment.content}
              </p>
            </div>
          </div>
        </td>

        {/* Tác giả */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm truncate max-w-[120px]">
              {getDisplayName(comment)}
            </span>
            {comment.author.isGuest && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                Khách
              </Badge>
            )}
          </div>
        </td>

        {/* Loại */}
        <td className="px-4 py-3 whitespace-nowrap">
          {comment.chapterId ? (
            <Badge variant="secondary" className="text-xs">
              Chapter
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Truyện
            </Badge>
          )}
        </td>

        {/* Replies */}
        <td className="px-4 py-3 text-center">
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
        </td>

        {/* Trạng thái */}
        <td className="px-4 py-3 whitespace-nowrap">
          {comment.isHidden ? (
            <Badge variant="destructive" className="text-xs">
              Đã ẩn
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="text-xs bg-green-600 hover:bg-green-600"
            >
              Hiển thị
            </Badge>
          )}
        </td>

        {/* Ngày tạo */}
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(comment.createdAt)}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
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
        </td>
      </tr>

      {/* Replies (expanded) */}
      {expanded &&
        comment.replies.map((reply) => (
          <CommentRow key={reply.id} comment={reply} isReply />
        ))}
    </>
  )
}

// ─── CommentsPage ─────────────────────────────────────────────────────────────

export default function CommentsPage() {
  const [query, setQuery] = useState<CommentQuery>({
    pageNumber: 1,
    pageSize: COMMENT_PAGE_SIZE,
  })

  const { data, isLoading } = useComments(query)

  const setFilter = (key: keyof CommentQuery, value: string | undefined) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
      pageNumber: 1,
    }))
  }

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý bình luận
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data ? `${data.totalCount} bình luận` : 'Đang tải...'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={
            query.isHidden === undefined
              ? 'all'
              : query.isHidden
                ? 'hidden'
                : 'visible'
          }
          onValueChange={(val) =>
            setFilter(
              'isHidden',
              val === 'all' ? undefined : val === 'hidden' ? 'true' : 'false'
            )
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="visible">Đang hiển thị</SelectItem>
            <SelectItem value="hidden">Đã ẩn</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            query.isGuest === undefined
              ? 'all'
              : query.isGuest
                ? 'guest'
                : 'user'
          }
          onValueChange={(val) =>
            setFilter(
              'isGuest',
              val === 'all' ? undefined : val === 'guest' ? 'true' : 'false'
            )
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Loại tác giả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="user">Thành viên</SelectItem>
            <SelectItem value="guest">Khách</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nội dung
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tác giả
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Loại
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Replies
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Trạng thái
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
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Không có bình luận nào
                  </td>
                </tr>
              ) : (
                data?.data.map((comment) => (
                  <CommentRow key={comment.id} comment={comment} />
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
