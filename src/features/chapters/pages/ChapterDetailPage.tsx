import { useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  EyeOff,
  Send,
  MoreVertical,
} from 'lucide-react'
import { ChapterStatusBadge } from '../components/ChapterStatusBadge'
import { useChapterDetail, useDeleteChapter } from '../hooks/useChapters'
import { useQueryClient } from '@tanstack/react-query'
import { chapterService } from '../services/chapterService'
import { chapterKeys } from '../constants/chapter.constants'
import { storyKeys } from '@/features/stories/constants/story.constants'
import type { ChapterStatus } from '../types/chapter.types'
import CommentsPage from '@/features/comments/page/CommentPage'

export const ChapterDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: chapter, isLoading } = useChapterDetail(id)
  const deleteMutation = useDeleteChapter(chapter?.storyId ?? '')

  const handleStatusChange = async (status: ChapterStatus) => {
    await chapterService.updateStatus(id, { status })
    queryClient.invalidateQueries({ queryKey: chapterKeys.detail(id) })
    queryClient.invalidateQueries({ queryKey: chapterKeys.lists() })
    if (chapter?.storyId) {
      queryClient.invalidateQueries({
        queryKey: storyKeys.detail(chapter.storyId),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!chapter) return <Navigate to="/admin/stories" replace />

  return (
    <div className="space-y-5 max-w-full mx-auto">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/content/stories/${chapter.storyId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground font-mono">
                Chương {chapter.chapterNumber}
              </span>
              <ChapterStatusBadge status={chapter.status} />
              {chapter.isVip && <Badge variant="secondary">VIP</Badge>}
            </div>
            <h1 className="text-xl font-bold mt-0.5">{chapter.title}</h1>
            <Link
              to={`/content/stories/${chapter.storyId}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {chapter.storyTitle}
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                `/content/stories/${chapter.storyId}/chapters/${id}/edit`
              )
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {chapter.status !== 'Published' && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange('Published')}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Phát hành
                </DropdownMenuItem>
              )}
              {chapter.status === 'Published' && (
                <DropdownMenuItem onClick={() => handleStatusChange('Hidden')}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ẩn
                </DropdownMenuItem>
              )}
              {chapter.status !== 'Draft' && (
                <DropdownMenuItem onClick={() => handleStatusChange('Draft')}>
                  Chuyển đến Bản nháp
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border rounded-lg px-4 py-3">
        <span>{chapter.wordCount.toLocaleString()} từ</span>
        <span>·</span>
        <span>{chapter.viewCount.toLocaleString()} lượt xem</span>
        <span>·</span>
        <span>
          {chapter.publishedAt
            ? `Đã xuất bản ${new Date(chapter.publishedAt).toLocaleDateString()}`
            : 'Chưa xuất bản'}
        </span>
        <span>·</span>
        <span>
          Đã cập nhật {new Date(chapter.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Bình luận</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CommentsPage storyId={undefined} chapterId={id}></CommentsPage>
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xóa Chương {chapter.chapterNumber}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              "{chapter.title}" sẽ bị xóa mềm. Nếu nó đã được xuất bản, số lượng
              chương của câu chuyện sẽ được cập nhật tự động.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ChapterDetailPage
