import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryService, tagService } from '../services/categoryService'
import {
  categoryKeys,
  tagKeys,
  CATEGORY_PAGE_SIZE,
  TAG_PAGE_SIZE,
} from '../constants/category.constants'
import type {
  CategoryQuery,
  TagQuery,
  CategoryFormValues,
  TagFormValues,
} from '../types/category.types'

// ════════════════════════════════════════════════════════════════════════════
// CATEGORY HOOKS
// ════════════════════════════════════════════════════════════════════════════

export const useCategoryList = (query: CategoryQuery = {}) => {
  const params = {
    pageNumber: 1,
    pageSize: CATEGORY_PAGE_SIZE,
    ...query,
  }

  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getList(params),
    staleTime: 1000 * 60 * 2, // 2 phút
  })
}

export const useCategoryTree = () =>
  useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: categoryService.getTree,
    staleTime: 1000 * 60 * 5, // 5 phút — tree ít thay đổi
  })

export const useCategoryDetail = (id: string) =>
  useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  })

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryFormValues) => categoryService.create(data),
    onSuccess: () => {
      // Invalidate cả list lẫn tree
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() })
      toast.success('Category created successfully.')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? 'Failed to create category.'
      )
    },
  })
}

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryFormValues) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      toast.success('Category updated successfully.')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? 'Failed to update category.'
      )
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() })
      toast.success('Category deleted.')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? 'Failed to delete category.'
      )
    },
  })
}

// ════════════════════════════════════════════════════════════════════════════
// TAG HOOKS
// ════════════════════════════════════════════════════════════════════════════

export const useTagList = (query: TagQuery = {}) => {
  const params = {
    pageNumber: 1,
    pageSize: TAG_PAGE_SIZE,
    ...query,
  }

  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => tagService.getList(params),
    staleTime: 1000 * 60 * 2,
  })
}

export const useTagDetail = (id: string) =>
  useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagService.getById(id),
    enabled: !!id,
  })

export const useCreateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TagFormValues) => tagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
      toast.success('Tag created successfully.')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to create tag.')
    },
  })
}

export const useUpdateTag = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TagFormValues) => tagService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) })
      toast.success('Tag updated successfully.')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to update tag.')
    },
  })
}

export const useDeleteTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
      toast.success('Tag deleted.')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to delete tag.')
    },
  })
}
