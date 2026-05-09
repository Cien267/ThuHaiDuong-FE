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
import { tagSchema, tagDefaults } from '../constants/category.constants'
import type { TagFormValues, TagResult } from '../types/category.types'

interface TagFormProps {
  initialData?: TagResult
  onSubmit: (values: TagFormValues) => void
  isLoading?: boolean
}

export const TagForm = ({ initialData, onSubmit, isLoading }: TagFormProps) => {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: initialData
      ? { name: initialData.name, slug: initialData.slug }
      : tagDefaults,
  })

  useEffect(() => {
    if (initialData) {
      form.reset({ name: initialData.name, slug: initialData.slug })
    }
  }, [initialData?.id])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Xuyên Không" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <Input placeholder="e.g. xuyen-khong" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
