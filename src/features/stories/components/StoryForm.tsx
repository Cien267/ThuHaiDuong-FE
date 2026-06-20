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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'
import { storySchema, storyDefaults } from '../constants/story.constants'
import {
  STORY_TYPE,
  RELEASE_SCHEDULE,
  CONTENT_SOURCE,
} from '../types/story.types'
import { useAuthorList } from '@/features/authors/hooks/useAuthors'
import { useCategoryTree } from '@/features/categories/hooks/useCategories'
import { useTagList } from '@/features/categories/hooks/useCategories'
import type { StoryFormValues, StoryAdminResult } from '../types/story.types'
import { DatePicker } from '@/components/common/DatePicker'
import { CoverImageUpload } from '../components/CoverImageUpload'

interface StoryFormProps {
  initialData?: StoryAdminResult
  onSubmit: (values: StoryFormValues) => void
  isLoading?: boolean
}

export const StoryForm = ({
  initialData,
  onSubmit,
  isLoading,
}: StoryFormProps) => {
  // ── Remote data ───────────────────────────────────────────────────────────────
  const { data: authorData } = useAuthorList({})
  const { data: categoryTree } = useCategoryTree()
  const { data: tagData } = useTagList({ pageSize: 200 })

  const authors = authorData?.data ?? []
  const categories = flattenTree(categoryTree ?? [])
  const tags = tagData?.data ?? []

  // ── Form ──────────────────────────────────────────────────────────────────────
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          authorId: initialData.authorId,
          sourceUrl: initialData.sourceUrl ?? '',
          description: initialData.description ?? '',
          coverImageUrl: initialData.coverImageUrl ?? '',
          storyType: initialData.storyType,
          releaseSchedule: initialData.releaseSchedule ?? undefined,
          nextChapterAt: initialData.nextChapterAt
            ? new Date(initialData.nextChapterAt).toISOString().slice(0, 16)
            : '',
          contentSource: initialData.contentSource,
          categoryIds: initialData.categories.map((c) => c.id),
          tagIds: initialData.tags.map((t) => t.id),
        }
      : storyDefaults,
  })

  const storyType = form.watch('storyType')

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        authorId: initialData.authorId,
        sourceUrl: initialData.sourceUrl ?? '',
        description: initialData.description ?? '',
        coverImageUrl: initialData.coverImageUrl ?? '',
        storyType: initialData.storyType,
        releaseSchedule: initialData.releaseSchedule ?? undefined,
        nextChapterAt: initialData.nextChapterAt
          ? new Date(initialData.nextChapterAt).toISOString().slice(0, 16)
          : '',
        contentSource: initialData.contentSource,
        categoryIds: initialData.categories.map((c) => c.id),
        tagIds: initialData.tags.map((t) => t.id),
      })
    }
  }, [initialData?.id])

  // Clear releaseSchedule khi đổi sang Completed
  useEffect(() => {
    if (storyType === STORY_TYPE.Completed) {
      form.setValue('releaseSchedule', undefined)
      form.setValue('nextChapterAt', '')
    }
  }, [storyType])

  const handleSubmit = (values: StoryFormValues) => {
    const payload: StoryFormValues = {
      ...values,
      slug: values.slug || undefined,
      sourceUrl: values.sourceUrl || undefined,
      description: values.description || undefined,
      coverImageUrl: values.coverImageUrl || undefined,
      nextChapterAt: values.nextChapterAt || undefined,
      releaseSchedule:
        values.storyType === STORY_TYPE.Serial
          ? values.releaseSchedule
          : undefined,
    }
    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* ── Basic info ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  Tiêu đề <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Gả Cho Kẻ Thù" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Slug
                  <span className="ml-1 text-xs text-muted-foreground">
                    (tự động nếu để trống)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="ga-cho-ke-thu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source URL */}
          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Author ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tác giả <span className="text-destructive">*</span>
                </FormLabel>
                <div className="space-y-1">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select author..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {authors.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                          {a.penName && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({a.penName})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Cover image ─────────────────────────────────────────────────────── */}
        <CoverImageUpload />

        {/* ── Description ─────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tóm tắt truyện..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Story Type + Schedule ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="storyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thể loại truyện</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={STORY_TYPE.Completed}>
                      Hoàn thành
                    </SelectItem>
                    <SelectItem value={STORY_TYPE.Serial}>
                      Đang tiến hành
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Release schedule — chỉ hiện khi Serial */}
          {storyType === STORY_TYPE.Serial && (
            <>
              <FormField
                control={form.control}
                name="releaseSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Lịch phát hành <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RELEASE_SCHEDULE.Daily}>
                          Hàng ngày
                        </SelectItem>
                        <SelectItem value={RELEASE_SCHEDULE.Weekly}>
                          Hàng tuần
                        </SelectItem>
                        <SelectItem value={RELEASE_SCHEDULE.BiWeekly}>
                          Hai tuần một lần
                        </SelectItem>
                        <SelectItem value={RELEASE_SCHEDULE.Monthly}>
                          Hàng tháng
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextChapterAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      Thời điểm phát hành chương sau
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        placeholder="Pick a date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Content Source */}
          <FormField
            control={form.control}
            name="contentSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nguồn nội dung</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CONTENT_SOURCE.Manual}>
                      Thủ công
                    </SelectItem>
                    <SelectItem value={CONTENT_SOURCE.Crawled}>
                      Thu thập
                    </SelectItem>
                    <SelectItem value={CONTENT_SOURCE.UGC}>
                      Nội dung do người dùng tạo
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Categories ──────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select
                onValueChange={(val) => {
                  if (!field.value.includes(val))
                    field.onChange([...field.value, val])
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Thêm danh mục..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories
                    .filter((c) => !field.value.includes(c.id))
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.depth > 0 ? `${'—'.repeat(c.depth)} ` : ''}
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* Selected badges */}
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {field.value.map((id) => {
                    const cat = categories.find((c) => c.id === id)
                    return cat ? (
                      <Badge key={id} variant="secondary" className="gap-1">
                        {cat.name}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(field.value.filter((v) => v !== id))
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Tags ────────────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thẻ</FormLabel>
              <Select
                onValueChange={(val) => {
                  if (!field.value.includes(val))
                    field.onChange([...field.value, val])
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Thêm thẻ..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tags
                    .filter((t) => !field.value.includes(t.id))
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {field.value.map((id) => {
                    const tag = tags.find((t) => t.id === id)
                    return tag ? (
                      <Badge key={id} variant="outline" className="gap-1">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(field.value.filter((v) => v !== id))
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Actions ─────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Hủy
          </Button>
          <Button variant="greenShiny" type="submit" disabled={isLoading}>
            {isLoading
              ? 'Đang lưu...'
              : initialData
                ? 'Cập nhật truyện'
                : 'Tạo truyện'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ── Helper ─────────────────────────────────────────────────────────────────────

interface FlatItem {
  id: string
  name: string
  depth: number
}

function flattenTree(
  nodes: { id: string; name: string; children?: any[] }[],
  depth = 0
): FlatItem[] {
  return nodes.flatMap((n) => [
    { id: n.id, name: n.name, depth },
    ...flattenTree(n.children ?? [], depth + 1),
  ])
}
