import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  ArrowLeft,
  Pencil,
  Send,
  CheckCircle,
  Trash2,
  Eye,
  BookOpen,
  Star,
  BarChart2,
} from 'lucide-react'
import { StoryStatusBadge } from '../components/StoryStatusBadge'
import { ReviewDialog } from '../components/ReviewDialog'
import { UpdateStatusDialog } from '../components/UpdateStatusDialog'
import {
  useStoryDetail,
  useSubmitForReview,
  useUpdateStoryStatus,
  useReviewStory,
  useDeleteStory,
} from '../hooks/useStories'
import useAuthStore from '@/store/authStore'
import type { StoryStatus, ReviewStoryValues } from '../types/story.types'

export const StoryDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, hasMinRole } = useAuthStore()

  const isAdmin = hasMinRole('Admin')
  const isSuperAdmin = user?.role === 'SuperAdmin'

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data: story, isLoading } = useStoryDetail(id)

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const submitMutation = useSubmitForReview(id)
  const updateStatusMutation = useUpdateStoryStatus(id)
  const reviewMutation = useReviewStory(id)
  const deleteMutation = useDeleteStory()

  // ── Dialog state ──────────────────────────────────────────────────────────────
  const [reviewOpen, setReviewOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!story) return <Navigate to="/admin/stories" replace />

  // ── Permissions ───────────────────────────────────────────────────────────────
  const isOwner = story.uploadedByUserId === user?.id
  const isDraftOrRejected =
    story.status === 'Draft' || story.status === 'Rejected'
  const isPending = story.status === 'PendingReview'
  const isApprovedOrBeyond = [
    'Approved',
    'Publishing',
    'Completed',
    'Paused',
  ].includes(story.status)

  const canEdit = (isAdmin || isOwner) && isDraftOrRejected
  const canSubmit = (isAdmin || isOwner) && isDraftOrRejected
  const canReview = isSuperAdmin && isPending
  const canUpdateStatus = isAdmin && isApprovedOrBeyond
  const canDelete = isAdmin || (isOwner && isDraftOrRejected)

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleReview = (values: ReviewStoryValues) => {
    reviewMutation.mutate(values, {
      onSuccess: () => setReviewOpen(false),
    })
  }

  const handleUpdateStatus = (status: StoryStatus) => {
    updateStatusMutation.mutate(
      { status },
      {
        onSuccess: () => setStatusOpen(false),
      }
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/stories')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{story.title}</h1>
              <StoryStatusBadge status={story.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              by <span className="font-medium">{story.authorName}</span>
              {story.uploadedByUserName && (
                <span> · Uploaded by {story.uploadedByUserName}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/stories/${id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}

          {canSubmit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {submitMutation.isPending ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}

          {canUpdateStatus && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusOpen(true)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          )}

          {canReview && (
            <Button size="sm" onClick={() => setReviewOpen(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Review
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* ── Rejection reason banner ───────────────────────────────────────────── */}
      {story.status === 'Rejected' && story.rejectionReason && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm font-semibold text-destructive mb-1">
            Rejected
          </p>
          <p className="text-sm text-destructive/90">{story.rejectionReason}</p>
        </div>
      )}

      {/* ── Stats row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chapters</p>
            </div>
            <p className="text-2xl font-bold mt-1">{story.totalChapters}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Views</p>
            </div>
            <p className="text-2xl font-bold mt-1">
              {story.totalViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
            <p className="text-2xl font-bold mt-1">
              {story.averageRating.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({story.ratingCount})
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Last Update</p>
            </div>
            <p className="text-sm font-semibold mt-1">
              {story.lastChapterAt
                ? new Date(story.lastChapterAt).toLocaleDateString()
                : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Story info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              {story.description ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {story.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Chapters */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Chapters ({story.totalChapters})
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/admin/stories/${id}/chapters/create`)}
              >
                + Add Chapter
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {story.chapters.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No chapters yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-center">VIP</TableHead>
                      <TableHead>Published</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {story.chapters.map((ch) => (
                      <TableRow
                        key={ch.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/admin/chapters/${ch.id}`)}
                      >
                        <TableCell className="text-muted-foreground font-mono">
                          {ch.chapterNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {ch.title}
                        </TableCell>
                        <TableCell className="text-center">
                          {ch.isVip && (
                            <Badge variant="secondary" className="text-xs">
                              VIP
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {ch.publishedAt ? (
                            new Date(ch.publishedAt).toLocaleDateString()
                          ) : (
                            <span className="italic">Draft</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Metadata */}
        <div className="space-y-4">
          {/* Cover */}
          {story.coverImageUrl && (
            <Card>
              <CardContent className="pt-4">
                <img
                  src={story.coverImageUrl}
                  alt={story.title}
                  className="w-full rounded object-cover max-h-72"
                />
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <MetaRow label="Type">{story.storyType}</MetaRow>
              <MetaRow label="Source">{story.contentSource}</MetaRow>

              {story.releaseSchedule && (
                <MetaRow label="Schedule">{story.releaseSchedule}</MetaRow>
              )}

              {story.nextChapterAt && (
                <MetaRow label="Next Chapter">
                  {new Date(story.nextChapterAt).toLocaleString()}
                </MetaRow>
              )}

              {story.sourceUrl && (
                <MetaRow label="Source URL">
                  <a
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate block"
                  >
                    {story.sourceUrl}
                  </a>
                </MetaRow>
              )}

              <MetaRow label="Created">
                {new Date(story.createdAt).toLocaleDateString()}
              </MetaRow>
              <MetaRow label="Updated">
                {new Date(story.updatedAt).toLocaleDateString()}
              </MetaRow>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {story.categories.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">None</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {story.categories.map((c) => (
                    <Badge key={c.id} variant="secondary">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {story.tags.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">None</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {story.tags.map((t) => (
                    <Badge key={t.id} variant="outline">
                      {t.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────────── */}

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        storyTitle={story.title}
        isLoading={reviewMutation.isPending}
        onSubmit={handleReview}
      />

      <UpdateStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        currentStatus={story.status}
        isLoading={updateStatusMutation.isPending}
        onSubmit={handleUpdateStatus}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{story.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the story and all its chapters permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
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

// ── Helper component ──────────────────────────────────────────────────────────

const MetaRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between gap-2">
    <span className="text-muted-foreground flex-shrink-0">{label}</span>
    <span className="font-medium text-right">{children}</span>
  </div>
)
