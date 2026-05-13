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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { authorSchema, authorDefaults } from '../constants/author.constants'
import { COUNTRIES } from '../types/author.types'
import type { AuthorFormValues, AuthorResult } from '../types/author.types'

interface AuthorFormProps {
  initialData?: AuthorResult
  onSubmit: (values: AuthorFormValues) => void
  isLoading?: boolean
}

export const AuthorForm = ({
  initialData,
  onSubmit,
  isLoading,
}: AuthorFormProps) => {
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          penName: initialData.penName ?? '',
          country: initialData.country ?? '',
          description: initialData.description ?? '',
          avatarUrl: initialData.avatarUrl ?? '',
        }
      : authorDefaults,
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        slug: initialData.slug,
        penName: initialData.penName ?? '',
        country: initialData.country ?? '',
        description: initialData.description ?? '',
        avatarUrl: initialData.avatarUrl ?? '',
      })
    }
  }, [initialData?.id])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tân Di Ổ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pen Name */}
        <FormField
          control={form.control}
          name="penName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bút danh</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 辛夷坞" {...field} />
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
                  (tự động tạo nếu để trống)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. tan-di-o" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quốc gia</FormLabel>
              <Select
                onValueChange={(val) =>
                  field.onChange(val === 'none' ? '' : val)
                }
                value={field.value || 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quốc gia..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">— Không xác định —</SelectItem>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avatar URL */}
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
              {/* Preview */}
              {field.value && (
                <img
                  src={field.value}
                  alt="Avatar preview"
                  className="mt-1 h-16 w-16 rounded-full object-cover border"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief bio..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button variant={'greenShiny'} type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
