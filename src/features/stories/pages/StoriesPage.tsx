import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  MoreHorizontal,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  BookOpen,
} from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { StoryStatusBadge } from '../components/StoryStatusBadge'
import { ReviewDialog } from '../components/ReviewDialog'
import { UpdateStatusDialog } from '../components/UpdateStatusDialog'
import {
  useStoryList,
  useSubmitForReview,
  useUpdateStoryStatus,
  useReviewStory,
  useDeleteStory,
} from '../hooks/useStories'
import useAuthStore from '@/store/authStore'
import { STORY_STATUS } from '../types/story.types'
import { STORY_PAGE_SIZE } from '../constants/story.constants'
import type { StoryAdminResult, StoryStatus } from '../types/story.types'

export const StoriesPage = () => {
  const navigate = useNavigate()
  const { user, hasMinRole } = useAuthStore()
  const isAdmin = hasMinRole('Admin')
  const isSuperAdmin = user?.role === 'SuperAdmin'
  const isContributor = user?.role === 'Contributor'

  // ── Filters ───────────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<StoryStatus | ''>('')
  const [page, setPage] = useState(1)

  // ── Dialog state ──────────────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [reviewStory, setReviewStory] = useState<StoryAdminResult | null>(null)
  const [statusStory, setStatusStory] = useState<StoryAdminResult | null>(null)

  const debouncedKeyword = useDebounce(keyword, 400)

  // ── Data ──────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useStoryList({
    keyword: debouncedKeyword || undefined,
    status: statusFilter || undefined,
    pageNumber: page,
    pageSize: STORY_PAGE_SIZE,
  })

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const submitMutation = useSubmitForReview('') // id passed per-call
  const updateStatusMutation = useUpdateStoryStatus('')
  const reviewMutation = useReviewStory('')
  const deleteMutation = useDeleteStory()

  const totalPages = data ? Math.ceil(data.totalCount / STORY_PAGE_SIZE) : 1

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleSubmitReview = async (id: string) => {
    await useSubmitForReview(id).mutateAsync()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
          <p className="text-sm text-muted-foreground">
            {isContributor
              ? 'Manage your stories.'
              : 'Manage all stories on the platform.'}
          </p>
        </div>
        <Button onClick={() => navigate('/content/stories/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Story
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title or author..."
            className="pl-8"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as StoryStatus | '')
            setPage(1)
          }}
        >
          <option value="">All statuses</option>
          {Object.values(STORY_STATUS).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Story</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> Ch.
                </div>
              </TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead>Updated</TableHead>
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
                  No stories found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((story: StoryAdminResult) => {
                const canEdit = isAdmin || story.uploadedByUserId === user?.id
                const isDraftOrRejected =
                  story.status === 'Draft' || story.status === 'Rejected'
                const isPending = story.status === 'PendingReview'
                const isApproved =
                  story.status === 'Approved' ||
                  story.status === 'Publishing' ||
                  story.status === 'Completed' ||
                  story.status === 'Paused'

                return (
                  <TableRow key={story.id}>
                    {/* Story info */}
                    <TableCell>
                      <div className="flex items-center gap-3 max-w-xs">
                        {story.coverImageUrl && (
                          <img
                            src={story.coverImageUrl}
                            alt={story.title}
                            className="h-12 w-8 rounded object-cover flex-shrink-0 border"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate">{story.title}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {story.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {story.authorName}
                    </TableCell>

                    <TableCell>
                      {/* Show rejection reason tooltip if Rejected */}
                      {story.status === 'Rejected' && story.rejectionReason ? (
                        <div className="group relative inline-block">
                          <StoryStatusBadge status={story.status} />
                          <div className="absolute z-10 hidden group-hover:block bottom-full mb-1 left-0 w-64 rounded bg-popover border p-2 text-xs shadow-md">
                            <p className="font-medium mb-1">
                              Rejection reason:
                            </p>
                            <p className="text-muted-foreground">
                              {story.rejectionReason}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <StoryStatusBadge status={story.status} />
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {story.storyType}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {story.totalChapters}
                    </TableCell>

                    <TableCell className="text-center">
                      {story.totalViews.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(story.updatedAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {/* View detail */}
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/stories/${story.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Detail
                          </DropdownMenuItem>

                          {/* Edit — chỉ khi Draft/Rejected và có quyền */}
                          {canEdit && isDraftOrRejected && (
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/stories/${story.id}/edit`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}

                          {/* Submit for review — Draft/Rejected, owner */}
                          {isDraftOrRejected &&
                            (story.uploadedByUserId === user?.id ||
                              isAdmin) && <SubmitMenuItem storyId={story.id} />}

                          {/* Update status — Admin+, sau khi Approved */}
                          {isAdmin && isApproved && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setStatusStory(story)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                            </>
                          )}

                          {/* Review — SuperAdmin, PendingReview */}
                          {isSuperAdmin && isPending && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setReviewStory(story)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Review
                              </DropdownMenuItem>
                            </>
                          )}

                          {/* Delete */}
                          {(isAdmin ||
                            (isDraftOrRejected &&
                              story.uploadedByUserId === user?.id)) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteId(story.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data?.totalCount} stories total
          </p>
          <div className="flex items-center gap-2">
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
        </div>
      )}

      {/* Update Status Dialog */}
      {statusStory && (
        <UpdateStatusDialog
          open={!!statusStory}
          onOpenChange={(o) => !o && setStatusStory(null)}
          currentStatus={statusStory.status}
          isLoading={updateStatusMutation.isPending}
          onSubmit={async (status) => {
            await useUpdateStoryStatus(statusStory.id).mutateAsync({ status })
            setStatusStory(null)
          }}
        />
      )}

      {/* Review Dialog */}
      {reviewStory && (
        <ReviewDialog
          open={!!reviewStory}
          onOpenChange={(o) => !o && setReviewStory(null)}
          storyTitle={reviewStory.title}
          isLoading={reviewMutation.isPending}
          onSubmit={async (values) => {
            await useReviewStory(reviewStory.id).mutateAsync(values)
            setReviewStory(null)
          }}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the story and all its chapters. This action
              cannot be undone.
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

// ── Submit menu item với hook riêng ───────────────────────────────────────────

const SubmitMenuItem = ({ storyId }: { storyId: string }) => {
  const mutation = useSubmitForReview(storyId)
  return (
    <DropdownMenuItem
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <Send className="mr-2 h-4 w-4" />
      Submit for Review
    </DropdownMenuItem>
  )
}

export default StoriesPage
