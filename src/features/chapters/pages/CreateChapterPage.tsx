import { useParams } from 'react-router-dom'
import { CreateChapterForm } from '../components/ChapterForm'
import { useCreateChapter } from '../hooks/useChapters'
import type { ChapterFormValues } from '../types/chapter.types'

export const CreateChapterPage = () => {
  const { storyId = '' } = useParams<{ storyId: string }>()
  const createMutation = useCreateChapter(storyId)

  const handleSubmit = (values: ChapterFormValues) => {
    createMutation.mutate(values)
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tạo chương mới</h1>
      </div>

      <div className="rounded-lg bg-card p-6">
        <CreateChapterForm
          storyId={storyId}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  )
}

export default CreateChapterPage
