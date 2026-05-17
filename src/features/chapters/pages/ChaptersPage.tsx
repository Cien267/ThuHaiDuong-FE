import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MoreHorizontal,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Send,
} from 'lucide-react'
import { ChapterStatusBadge } from '../components/ChapterStatusBadge'
import { useChapterList, useDeleteChapter } from '../hooks/useChapters'
import { useStoryDetail } from '@/features/stories/hooks/useStories'
import { useQueryClient } from '@tanstack/react-query'
import { chapterService } from '../services/chapterService'
import { chapterKeys } from '../constants/chapter.constants'
import { storyKeys } from '@/features/stories/constants/story.constants'
import { CHAPTER_STATUS } from '../types/chapter.types'
import type { ChapterListItem, ChapterStatus } from '../types/chapter.types'

export const ChaptersPage = () => {
  const { storyId = '' } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = useState<ChapterStatus | ''>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: story } = useStoryDetail(storyId)
  const { data, isLoading } = useChapterList({
    storyId,
    status: statusFilter || undefined,
    pageNumber: page,
    pageSize: 50,
  })

  // ── Mutations ──────────────────────────────────────────────────────────────
  const deleteMutation = useDeleteChapter(storyId)

  const handleStatusChange = async (id: string, status: ChapterStatus) => {
    await chapterService.updateStatus(id, { status })
    queryClient.invalidateQueries({ queryKey: chapterKeys.lists() })
    queryClient.invalidateQueries({ queryKey: storyKeys.detail(storyId) })
  }

  const totalPages = data ? Math.ceil(data.totalCount / 50) : 1

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/stories/${storyId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chapters</h1>
            {story && (
              <Link
                to={`/admin/stories/${storyId}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {story.title}
              </Link>
            )}
          </div>
        </div>
        <Button
          onClick={() => navigate(`/admin/stories/${storyId}/chapters/create`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chapter
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter || 'all'}
          onValueChange={(v) => {
            setStatusFilter(v === 'all' ? '' : (v as ChapterStatus))
            setPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(CHAPTER_STATUS).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {data && (
          <p className="text-sm text-muted-foreground">
            {data.totalCount} chapters total
          </p>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">VIP</TableHead>
              <TableHead className="text-center">Words</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead>Published</TableHead>
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
                  No chapters found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((ch: ChapterListItem) => (
                <TableRow
                  key={ch.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/admin/chapters/${ch.id}`)}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    {ch.chapterNumber}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {ch.title}
                  </TableCell>
                  <TableCell className="text-center">
                    <ChapterStatusBadge status={ch.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {ch.isVip && (
                      <Badge variant="secondary" className="text-xs">
                        VIP
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {ch.wordCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {ch.viewCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {ch.publishedAt ? (
                      new Date(ch.publishedAt).toLocaleDateString()
                    ) : (
                      <span className="italic">—</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/chapters/${ch.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/admin/chapters/${ch.id}/edit`)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Status actions */}
                        {ch.status !== 'Published' && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(ch.id, 'Published')
                            }
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {ch.status === 'Published' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(ch.id, 'Hidden')}
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide
                          </DropdownMenuItem>
                        )}
                        {ch.status !== 'Draft' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(ch.id, 'Draft')}
                          >
                            Move to Draft
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(ch.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the chapter. If it was Published, the
              story's chapter count will be updated automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
