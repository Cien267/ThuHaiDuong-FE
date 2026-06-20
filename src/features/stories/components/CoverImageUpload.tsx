import { useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { Camera, Loader2, X, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useUploadStoryCover } from '../hooks/useStories'
import type { StoryFormValues } from '../types/story.types'

export function CoverImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { control, setValue, watch } = useFormContext<StoryFormValues>()
  const coverUrl = watch('coverImageUrl')
  const uploadCover = useUploadStoryCover()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      return
    }

    uploadCover.mutate(file, {
      onSuccess: (url: string) =>
        setValue('coverImageUrl', url, { shouldDirty: true }),
    })

    // Reset để có thể chọn lại cùng file
    e.target.value = ''
  }

  return (
    <FormField
      control={control}
      name="coverImageUrl"
      render={() => (
        <FormItem>
          <FormLabel>Ảnh bìa</FormLabel>

          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="relative shrink-0">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="h-32 w-24 rounded-md object-cover border"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <div className="h-32 w-24 rounded-md border bg-muted flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}

              {/* Loading overlay */}
              {uploadCover.isPending && (
                <div className="absolute inset-0 rounded-md bg-black/40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadCover.isPending}
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5"
              >
                <Camera className="h-4 w-4" />
                {coverUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}
              </Button>

              {coverUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={uploadCover.isPending}
                  onClick={() =>
                    setValue('coverImageUrl', '', { shouldDirty: true })
                  }
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  Xóa ảnh
                </Button>
              )}

              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP. Tối đa 5MB.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
