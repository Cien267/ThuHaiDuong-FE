import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authorService } from '../services/authorService'
import { authorKeys, AUTHOR_PAGE_SIZE } from '../constants/author.constants'
import type { AuthorQuery, AuthorFormValues } from '../types/author.types'

export const useAuthorList = (query: AuthorQuery = {}) => {
  const params = {
    pageNumber: 1,
    pageSize: AUTHOR_PAGE_SIZE,
    ...query,
  }

  return useQuery({
    queryKey: authorKeys.list(params),
    queryFn: () => authorService.getList(params),
    staleTime: 1000 * 60 * 2,
  })
}

export const useAuthorDetail = (id: string) =>
  useQuery({
    queryKey: authorKeys.detail(id),
    queryFn: () => authorService.getById(id),
    enabled: !!id,
  })

// Dùng trong Story form — select tác giả
export const useAuthorSummaryList = (name?: string) =>
  useQuery({
    queryKey: [...authorKeys.all, 'summary', name],
    queryFn: () => authorService.getSummaryList(name),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateAuthor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AuthorFormValues) => authorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() })
      toast.success('Author created successfully.')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to create author.')
    },
  })
}

export const useUpdateAuthor = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AuthorFormValues) => authorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: authorKeys.detail(id) })
      toast.success('Author updated successfully.')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to update author.')
    },
  })
}

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() })
      toast.success('Author deleted.')
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to delete author.')
    },
  })
}
