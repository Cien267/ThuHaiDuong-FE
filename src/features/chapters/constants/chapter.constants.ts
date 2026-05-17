import { z } from 'zod'
import type { ChapterFormValues } from '../types/chapter.types'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const chapterKeys = {
  all: ['chapters'] as const,
  lists: () => [...chapterKeys.all, 'list'] as const,
  list: (q: object) => [...chapterKeys.lists(), q] as const,
  detail: (id: string) => [...chapterKeys.all, id] as const,
}

// ── Zod Schemas ────────────────────────────────────────────────────────────────

export const chapterSchema = z.object({
  storyId: z.string().min(1, 'Story is required'),
  chapterNumber: z.number().int().positive().optional(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(300, 'Title must be at most 300 characters'),
  content: z.string().min(1, 'Content is required'),
  isVip: z.boolean(),
  status: z.enum(['Draft', 'Published', 'Hidden']),
})

export const updateChapterSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().min(1, 'Content is required'),
  isVip: z.boolean(),
})

// ── Defaults ───────────────────────────────────────────────────────────────────

export const chapterDefaults: ChapterFormValues = {
  storyId: '',
  chapterNumber: undefined,
  title: '',
  content: '',
  isVip: false,
  status: 'Draft',
}

// ── Config ─────────────────────────────────────────────────────────────────────

export const CHAPTER_PAGE_SIZE = 50
