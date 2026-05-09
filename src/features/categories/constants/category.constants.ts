import { z } from 'zod'
import type { CategoryFormValues, TagFormValues } from '../types/category.types'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (q: object) => [...categoryKeys.lists(), q] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  detail: (id: string) => [...categoryKeys.all, id] as const,
}

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (q: object) => [...tagKeys.lists(), q] as const,
  detail: (id: string) => [...tagKeys.all, id] as const,
}

// ── Zod schemas ────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  slug: z.string().max(120).optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
})

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  slug: z.string().max(120).optional().or(z.literal('')),
})

// ── Form defaults ──────────────────────────────────────────────────────────────

export const categoryDefaults: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  parentId: undefined,
  sortOrder: 0,
  isActive: true,
}

export const tagDefaults: TagFormValues = {
  name: '',
  slug: '',
}

// ── Table config ───────────────────────────────────────────────────────────────

export const CATEGORY_PAGE_SIZE = 20
export const TAG_PAGE_SIZE = 50
