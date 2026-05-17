import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from './RichTextEditor'
import {
  chapterSchema,
  updateChapterSchema,
  chapterDefaults,
} from '../constants/chapter.constants'
import { CHAPTER_STATUS } from '../types/chapter.types'
import type {
  ChapterFormValues,
  UpdateChapterInput,
  ChapterAdminResult,
} from '../types/chapter.types'

// ── Create mode ────────────────────────────────────────────────────────────────

interface CreateChapterFormProps {
  storyId: string
  onSubmit: (values: ChapterFormValues) => void
  isLoading?: boolean
}

export const CreateChapterForm = ({
  storyId,
  onSubmit,
  isLoading,
}: CreateChapterFormProps) => {
  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { ...chapterDefaults, storyId },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Chapter Number */}
          <FormField
            control={form.control}
            name="chapterNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Chapter No.
                  <span className="ml-1 text-xs text-muted-foreground">
                    (auto if empty)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Auto"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publish</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CHAPTER_STATUS.Draft}>
                      Save as Draft
                    </SelectItem>
                    <SelectItem value={CHAPTER_STATUS.Published}>
                      Publish Now
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VIP */}
          <FormField
            control={form.control}
            name="isVip"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end pb-1">
                <FormLabel>VIP Chapter</FormLabel>
                <div className="flex items-center gap-2 h-9">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value ? 'Subscription required' : 'Free to read'}
                  </span>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Chapter title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Content <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Start writing..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : form.watch('status') === 'Published'
                ? 'Publish Chapter'
                : 'Save Draft'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ── Edit mode ──────────────────────────────────────────────────────────────────

interface EditChapterFormProps {
  initialData: ChapterAdminResult
  onSubmit: (values: UpdateChapterInput) => void
  isLoading?: boolean
}

export const EditChapterForm = ({
  initialData,
  onSubmit,
  isLoading,
}: EditChapterFormProps) => {
  const form = useForm<UpdateChapterInput>({
    resolver: zodResolver(updateChapterSchema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
      isVip: initialData.isVip,
    },
  })

  useEffect(() => {
    form.reset({
      title: initialData.title,
      content: initialData.content,
      isVip: initialData.isVip,
    })
  }, [initialData.id])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Chapter title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VIP */}
          <FormField
            control={form.control}
            name="isVip"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="mt-0">VIP Chapter</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Content <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Update Chapter'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
