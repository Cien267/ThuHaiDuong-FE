import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Search, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { useStoryList } from '@/features/stories/hooks/useStories'
import { useChapterList } from '@/features/chapters/hooks/useChapters'
import {
  affiliateLinkSchema,
  type AffiliateLinkFormValues,
  AFFILIATE_LINK_DEFAULTS,
} from '../constants/affiliate.constants'
import {
  AFFILIATE_PLACEMENTS,
  PLACEMENT_LABELS,
} from '../types/affiliate.types'
import type {
  AffiliateLinkResult,
  AffiliateLinkTargetItem,
} from '../types/affiliate.types'
import { DatePicker } from '@/components/common/DatePicker'
import { InputNumber } from '@/components/common/InputNumber'
import { AffiliateImageUpload } from './AffiliateImageUpload'

// ── Story search combobox ─────────────────────────────────────────────────────

interface StorySearchBoxProps {
  selectedItems: AffiliateLinkTargetItem[]
  onAdd: (item: AffiliateLinkTargetItem) => void
  onRemove: (id: string) => void
}

function StorySearchBox({
  selectedItems,
  onAdd,
  onRemove,
}: StorySearchBoxProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [debouncedInput] = useDebounce(input, 300)

  const { data, isLoading } = useStoryList({
    keyword: debouncedInput || undefined,
    pageNumber: 1,
    pageSize: 10,
  })

  const results = data?.data ?? []

  return (
    <div className="space-y-2">
      <Label>Truyện cụ thể</Label>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <Badge key={item.id} variant="secondary" className="gap-1 pr-1">
              <span className="max-w-[200px] truncate text-xs">
                {item.title}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="ml-0.5 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-muted-foreground font-normal"
          >
            <Search className="h-4 w-4 mr-2 shrink-0" />
            Tìm truyện...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Nhập tên truyện..."
              value={input}
              onValueChange={setInput}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && results.length === 0 && (
                <CommandEmpty>Không tìm thấy truyện</CommandEmpty>
              )}
              {!isLoading && results.length > 0 && (
                <CommandGroup>
                  {results
                    .filter((r) => !selectedItems.some((s) => s.id === r.id))
                    .map((story) => (
                      <CommandItem
                        key={story.id}
                        value={story.id}
                        onSelect={() => {
                          onAdd({
                            id: story.id,
                            title: story.title,
                            slug: story.slug,
                          })
                          setInput('')
                          setOpen(false)
                        }}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{story.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {story.authorName}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ── Chapter search combobox (chỉ trong 1 story đã chọn) ──────────────────────

interface ChapterSearchBoxProps {
  selectedStories: AffiliateLinkTargetItem[]
  selectedItems: AffiliateLinkTargetItem[]
  onAdd: (item: AffiliateLinkTargetItem) => void
  onRemove: (id: string) => void
}

function ChapterSearchBox({
  selectedStories,
  selectedItems,
  onAdd,
  onRemove,
}: ChapterSearchBoxProps) {
  const [open, setOpen] = useState(false)
  // Story tab được user bấm chọn thủ công
  const [pinnedStoryId, setPinnedStoryId] = useState<string | null>(null)

  const hasStories = selectedStories.length > 0

  // activeStoryId = pinnedStoryId nếu còn trong danh sách, ngược lại fallback về story đầu tiên
  const activeStoryId =
    pinnedStoryId && selectedStories.some((s) => s.id === pinnedStoryId)
      ? pinnedStoryId
      : (selectedStories[0]?.id ?? '')

  const { data, isLoading } = useChapterList({
    storyId: activeStoryId,
    pageNumber: 1,
    pageSize: 50,
  })

  const results = data?.data ?? []

  return (
    <div className="space-y-2">
      <Label>
        Chapter cụ thể{' '}
        {!hasStories && (
          <p className="text-xs text-muted-foreground italic">
            (Chọn ít nhất 1 truyện ở trên trước khi chọn chapter)
          </p>
        )}
      </Label>

      {/* Selected chapter tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <Badge key={item.id} variant="secondary" className="gap-1 pr-1">
              <span className="max-w-[200px] truncate text-xs">
                {item.title}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="ml-0.5 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover
        open={open}
        onOpenChange={(val) => {
          if (hasStories) setOpen(val)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={!hasStories}
            className="w-full justify-start text-muted-foreground font-normal disabled:opacity-50"
          >
            <Search className="h-4 w-4 mr-2 shrink-0" />
            Tìm chapter...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-0" align="start">
          {/* Story selector tabs — chọn story nào để load chapter */}
          {selectedStories.length > 1 && (
            <div className="border-b px-2 py-1.5 flex gap-1 flex-wrap">
              {selectedStories.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPinnedStoryId(s.id)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    activeStoryId === s.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  <span className="max-w-[120px] truncate block">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          <Command shouldFilter={false}>
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && results.length === 0 && (
                <CommandEmpty>Truyện này chưa có chapter nào</CommandEmpty>
              )}
              {!isLoading && results.length > 0 && (
                <CommandGroup>
                  {results
                    .filter((r) => !selectedItems.some((s) => s.id === r.id))
                    .map((chapter) => (
                      <CommandItem
                        key={chapter.id}
                        value={chapter.id}
                        onSelect={() => {
                          onAdd({
                            id: chapter.id,
                            title: `Chương ${chapter.chapterNumber}: ${chapter.title}`,
                            slug: activeStoryId, // dùng activeStoryId đang query thay vì chapter.storyId
                          })
                          setOpen(false)
                        }}
                      >
                        <span className="truncate">
                          Chương {chapter.chapterNumber}: {chapter.title}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

interface AffiliateLinkFormProps {
  initialData?: AffiliateLinkResult
  isEdit?: boolean
  onSubmit: (values: AffiliateLinkFormValues) => void
  isPending: boolean
}

export function AffiliateLinkForm({
  initialData,
  isEdit = false,
  onSubmit,
  isPending,
}: AffiliateLinkFormProps) {
  const form = useForm<
    AffiliateLinkFormValues,
    unknown,
    AffiliateLinkFormValues
  >({
    resolver: zodResolver(affiliateLinkSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          targetUrl: initialData.targetUrl,
          trackingCode: initialData.trackingCode,
          placement: initialData.placement,
          priority: initialData.priority,
          isActive: initialData.isActive,
          startDate: initialData.startDate?.slice(0, 10) ?? '',
          endDate: initialData.endDate?.slice(0, 10) ?? '',
          storyIds: initialData.stories.map((s) => s.id),
          chapterIds: initialData.chapters.map((c) => c.id),
          imageUrl: initialData.imageUrl,
        }
      : AFFILIATE_LINK_DEFAULTS,
  })

  const [selectedStories, setSelectedStories] = useState<
    AffiliateLinkTargetItem[]
  >(initialData?.stories ?? [])
  const [selectedChapters, setSelectedChapters] = useState<
    AffiliateLinkTargetItem[]
  >(initialData?.chapters ?? [])

  // Khi xóa story → cũng xóa các chapter thuộc story đó
  const handleAddStory = (item: AffiliateLinkTargetItem) => {
    const next = [...selectedStories, item]
    setSelectedStories(next)
    form.setValue(
      'storyIds',
      next.map((s) => s.id)
    )
  }

  const handleRemoveStory = (id: string) => {
    const next = selectedStories.filter((s) => s.id !== id)
    setSelectedStories(next)
    form.setValue(
      'storyIds',
      next.map((s) => s.id)
    )

    // Xóa chapter thuộc story bị remove (slug = storyId theo mapping ở FromLink)
    const nextChapters = selectedChapters.filter((c) => c.slug !== id)
    setSelectedChapters(nextChapters)
    form.setValue(
      'chapterIds',
      nextChapters.map((c) => c.id)
    )
  }

  const handleAddChapter = (item: AffiliateLinkTargetItem) => {
    const next = [...selectedChapters, item]
    setSelectedChapters(next)
    form.setValue(
      'chapterIds',
      next.map((c) => c.id)
    )
  }

  const handleRemoveChapter = (id: string) => {
    const next = selectedChapters.filter((c) => c.id !== id)
    setSelectedChapters(next)
    form.setValue(
      'chapterIds',
      next.map((c) => c.id)
    )
  }

  const handleFormSubmit = (values: AffiliateLinkFormValues) => {
    onSubmit({
      ...values,
      trackingCode: values.trackingCode || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* ── Thông tin cơ bản ── */}
        <div className=" p-5 space-y-4">
          <h3 className="font-medium">Thông tin cơ bản</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên link</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Banner mùa hè sidebar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL đích</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEdit && (
            <FormField
              control={form.control}
              name="trackingCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tracking code
                    <span className="text-muted-foreground text-xs">
                      (để trống để tự tạo)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="VD: summer24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isEdit && initialData && (
            <FormField
              control={form.control}
              name="trackingCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking code</FormLabel>
                  <FormControl>
                    <div>
                      <Input disabled placeholder="VD: summer24" {...field} />
                      <p className="text-xs text-muted-foreground">
                        Tracking code không thể thay đổi sau khi tạo
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <AffiliateImageUpload />
        </div>

        {/* ── Cấu hình hiển thị ── */}
        <div className=" p-5 space-y-4">
          <h3 className="font-medium">Cấu hình hiển thị</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="placement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vị trí <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        {AFFILIATE_PLACEMENTS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {PLACEMENT_LABELS[p]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Độ ưu tiên{' '}
                    <p className="text-xs text-muted-foreground">
                      (Số càng cao, ưu tiên càng cao)
                    </p>
                  </FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Enter value"
                      {...field}
                      allowDecimal={false}
                      allowNegative={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kích hoạt</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">Ngày bắt đầu</FormLabel>
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
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">Ngày kết thúc</FormLabel>
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
          </div>
        </div>

        {/* ── Phạm vi hiển thị ── */}
        <div className=" p-5 space-y-4">
          <div>
            <h3 className="font-medium">Phạm vi hiển thị</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Để trống = hiển thị toàn cục. Chọn truyện trước, sau đó có thể thu
              hẹp xuống chapter cụ thể.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StorySearchBox
              selectedItems={selectedStories}
              onAdd={handleAddStory}
              onRemove={handleRemoveStory}
            />

            <ChapterSearchBox
              selectedStories={selectedStories}
              selectedItems={selectedChapters}
              onAdd={handleAddChapter}
              onRemove={handleRemoveChapter}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Hủy
          </Button>
          <Button variant={'greenShiny'} type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? 'Lưu thay đổi' : 'Tạo link'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
