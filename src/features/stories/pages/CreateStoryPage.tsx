import { StoryForm } from '../components/StoryForm'
import { useCreateStory } from '../hooks/useStories'
import type { StoryFormValues } from '../types/story.types'

export const CreateStoryPage = () => {
  const createMutation = useCreateStory()

  const handleSubmit = (values: StoryFormValues) => {
    createMutation.mutate(values)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Story</h1>
        <p className="text-sm text-muted-foreground">
          Story will be saved as Draft. Submit for review when ready.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <StoryForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  )
}

export default CreateStoryPage
