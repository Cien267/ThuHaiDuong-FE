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
                  Chương số
                  <span className="ml-1 text-xs text-muted-foreground">
                    (tự động nếu để trống)
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
                <FormLabel>Xuất bản</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CHAPTER_STATUS.Draft}>
                      Lưu nháp
                    </SelectItem>
                    <SelectItem value={CHAPTER_STATUS.Published}>
                      Xuất bản ngay
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
                <FormLabel>Chương VIP</FormLabel>
                <div className="flex items-center gap-2 h-9">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value ? 'Yêu cầu đăng ký' : 'Miễn phí đọc'}
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
                Tiêu đề <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Tiêu đề chương..." {...field} />
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
                Nội dung <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Bắt đầu viết..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Hủy
          </Button>
          <Button variant={'greenShiny'} type="submit" disabled={isLoading}>
            {isLoading
              ? 'Đang lưu...'
              : form.watch('status') === 'Published'
                ? 'Xuất bản chương'
                : 'Lưu nháp'}
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
                  Tiêu đề <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Tiêu đề chương..." {...field} />
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
                <FormLabel className="mt-0">Chương VIP</FormLabel>
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
                Nội dung <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Hủy
          </Button>
          <Button variant={'greenShiny'} type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Cập nhật chương'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
