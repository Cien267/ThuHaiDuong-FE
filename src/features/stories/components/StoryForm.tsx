import { useEffect, useState } from 'react'
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
import { useAuthorSummaryList } from '@/features/authors/hooks/useAuthors'
import { useCategoryTree } from '@/features/categories/hooks/useCategories'
import { useTagList } from '@/features/categories/hooks/useCategories'
import type { StoryFormValues, StoryAdminResult } from '../types/story.types'

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
  const [authorSearch, setAuthorSearch] = useState('')

  // ── Remote data ───────────────────────────────────────────────────────────────
  const { data: authorData } = useAuthorSummaryList(authorSearch || undefined)
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
  const coverUrl = form.watch('coverImageUrl')

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
                  Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Gả Cho Kẻ Thù" {...field} />
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
                    (auto if empty)
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
        <FormField
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Author <span className="text-destructive">*</span>
              </FormLabel>
              <div className="space-y-1">
                <Input
                  placeholder="Search author..."
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  className="mb-1"
                />
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
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

        {/* ── Cover image ─────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <div className="flex gap-3 items-start">
                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className="h-20 w-14 rounded object-cover border flex-shrink-0"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Description ─────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Story synopsis..."
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
                <FormLabel>Story Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={STORY_TYPE.Completed}>
                      Completed
                    </SelectItem>
                    <SelectItem value={STORY_TYPE.Serial}>
                      Serial (ongoing)
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
                      Release Schedule{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RELEASE_SCHEDULE.Daily}>
                          Daily
                        </SelectItem>
                        <SelectItem value={RELEASE_SCHEDULE.Weekly}>
                          Weekly
                        </SelectItem>
                        <SelectItem value={RELEASE_SCHEDULE.BiWeekly}>
                          Bi-weekly
                        </SelectItem>
                        <SelectItem value={RELEASE_SCHEDULE.Monthly}>
                          Monthly
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
                    <FormLabel>Next Chapter At</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                <FormLabel>Content Source</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CONTENT_SOURCE.Manual}>
                      Manual
                    </SelectItem>
                    <SelectItem value={CONTENT_SOURCE.Crawled}>
                      Crawled
                    </SelectItem>
                    <SelectItem value={CONTENT_SOURCE.UGC}>UGC</SelectItem>
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
              <FormLabel>Categories</FormLabel>
              <Select
                onValueChange={(val) => {
                  if (!field.value.includes(val))
                    field.onChange([...field.value, val])
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Add category..." />
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
              <FormLabel>Tags</FormLabel>
              <Select
                onValueChange={(val) => {
                  if (!field.value.includes(val))
                    field.onChange([...field.value, val])
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Add tag..." />
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
              : initialData
                ? 'Update Story'
                : 'Create Story'}
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
