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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  categorySchema,
  categoryDefaults,
} from '../constants/category.constants'
import { useCategoryTree } from '../hooks/useCategories'
import type {
  CategoryFormValues,
  CategoryResult,
} from '../types/category.types'

interface CategoryFormProps {
  initialData?: CategoryResult // có → edit mode; không có → create mode
  onSubmit: (values: CategoryFormValues) => void
  isLoading?: boolean
}

export const CategoryForm = ({
  initialData,
  onSubmit,
  isLoading,
}: CategoryFormProps) => {
  const { data: tree } = useCategoryTree()

  // Flatten tree thành flat list để render select options
  const flatCategories = flattenTree(tree ?? [])

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description ?? '',
          parentId: initialData.parentId ?? undefined,
          sortOrder: initialData.sortOrder,
          isActive: initialData.isActive,
        }
      : categoryDefaults,
  })

  // Reset form khi initialData thay đổi (navigate giữa các items)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description ?? '',
        parentId: initialData.parentId ?? undefined,
        sortOrder: initialData.sortOrder,
        isActive: initialData.isActive,
      })
    }
  }, [initialData?.id]) // chỉ reset khi id thay đổi, không theo toàn bộ object

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
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ngôn Tình" {...field} />
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
                  (auto-generated if empty)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. ngon-tinh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parent Category */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={(val) =>
                  field.onChange(val === 'none' ? undefined : val)
                }
                value={field.value ?? 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="No parent (root category)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No parent (root)</SelectItem>
                  {flatCategories
                    .filter((c) => c.id !== initialData?.id) // không cho chọn chính mình làm cha
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.depth > 0 ? `${'—'.repeat(c.depth)} ` : ''}
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sort Order */}
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Active */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <FormLabel>Active</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Inactive categories are hidden from the client site.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface FlatCategory {
  id: string
  name: string
  depth: number
}

function flattenTree(
  nodes: { id: string; name: string; children: any[] }[],
  depth = 0
): FlatCategory[] {
  return nodes.flatMap((node) => [
    { id: node.id, name: node.name, depth },
    ...flattenTree(node.children ?? [], depth + 1),
  ])
}
