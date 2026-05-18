import { useParams, Navigate } from 'react-router-dom'
import { useChapterDetail, useUpdateChapter } from '../hooks/useChapters'
import { EditChapterForm } from '../components/ChapterForm'
import { type UpdateChapterInput, CHAPTER_STATUS } from '../types/chapter.types'

export const EditChapterPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const { storyId = '' } = useParams<{ storyId: string }>()

  const { data: chapter, isLoading } = useChapterDetail(id)
  const updateMutation = useUpdateChapter(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!chapter) return <Navigate to={`/content/stories/${storyId}`} replace />

  // Chỉ edit được khi Draft hoặc Rejected
  if (
    chapter.status !== CHAPTER_STATUS.Draft &&
    chapter.status !== CHAPTER_STATUS.Hidden
  ) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="font-medium">Không thể chỉnh sửa chương này.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Chương chỉ có thể được chỉnh sửa khi ở trạng thái Nháp hoặc Bị ẩn.
            Trạng thái hiện tại: <strong>{chapter.status}</strong>
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (values: UpdateChapterInput) => {
    updateMutation.mutate(values)
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Chapter</h1>
        <p className="text-sm text-muted-foreground truncate">
          {chapter.title}
        </p>
      </div>

      <div className="rounded-lg bg-card p-6">
        <EditChapterForm
          initialData={chapter}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  )
}

export default EditChapterPage
