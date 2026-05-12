import { z } from 'zod'
import type { AuthorFormValues } from '../types/author.types'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const authorKeys = {
  all: ['authors'] as const,
  lists: () => [...authorKeys.all, 'list'] as const,
  list: (q: object) => [...authorKeys.lists(), q] as const,
  detail: (id: string) => [...authorKeys.all, id] as const,
}

// ── Zod Schema ─────────────────────────────────────────────────────────────────

export const authorSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be at most 200 characters'),
  slug: z.string().max(250).optional().or(z.literal('')),
  penName: z.string().max(200).optional().or(z.literal('')),
  country: z.string().max(10).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  avatarUrl: z.string().max(500).optional().or(z.literal('')),
})

// ── Form Defaults ──────────────────────────────────────────────────────────────

export const authorDefaults: AuthorFormValues = {
  name: '',
  slug: '',
  penName: '',
  country: '',
  description: '',
  avatarUrl: '',
}

// ── Table config ───────────────────────────────────────────────────────────────

export const AUTHOR_PAGE_SIZE = 20
