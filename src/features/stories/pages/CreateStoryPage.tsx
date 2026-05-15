import { StoryForm } from '../components/StoryForm'
import { useCreateStory } from '../hooks/useStories'
import type { StoryFormValues } from '../types/story.types'

export const CreateStoryPage = () => {
  const createMutation = useCreateStory()

  const handleSubmit = (values: StoryFormValues) => {
    createMutation.mutate(values)
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tạo truyện mới</h1>
        <p className="text-sm text-muted-foreground">
          Truyện sẽ được lưu dưới dạng Nháp. Gửi để xem xét khi đã sẵn sàng.
        </p>
      </div>

      <div className="rounded-lg bg-card p-6">
        <StoryForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  )
}

export default CreateStoryPage
