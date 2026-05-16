import { useParams, Navigate } from 'react-router-dom'
import { useStoryDetail, useUpdateStory } from '../hooks/useStories'
import useAuthStore from '@/store/authStore'
import { StoryForm } from '../components/StoryForm'
import type { StoryFormValues } from '../types/story.types'

export const EditStoryPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const { user, hasMinRole } = useAuthStore()
  const isAdmin = hasMinRole('Admin')

  const { data: story, isLoading } = useStoryDetail(id)
  const updateMutation = useUpdateStory(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!story) return <Navigate to="/admin/stories" replace />

  // Chỉ edit được khi Draft hoặc Rejected
  if (story.status !== 'Draft' && story.status !== 'Rejected') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="font-medium">Không thể chỉnh sửa câu chuyện này.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Câu chuyện chỉ có thể được chỉnh sửa khi ở trạng thái Nháp hoặc Bị
            từ chối. Trạng thái hiện tại: <strong>{story.status}</strong>
          </p>
        </div>
      </div>
    )
  }

  // Contributor chỉ edit story của mình
  if (!isAdmin && story.uploadedByUserId !== user?.id) {
    return <Navigate to="/admin/stories" replace />
  }

  const handleSubmit = (values: StoryFormValues) => {
    updateMutation.mutate(values)
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Story</h1>
        <p className="text-sm text-muted-foreground truncate">{story.title}</p>
      </div>

      <div className="rounded-lg bg-card p-6">
        <StoryForm
          initialData={story}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  )
}

export default EditStoryPage
